import "server-only";

import { z } from "zod";
import {
  articleSchema,
  pageSchema,
  portfolioDataSchema,
  projectSchema,
  projectSkillSchema,
  skillSchema,
  type PortfolioData,
  type PortfolioPage,
} from "./schemas";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const tableSchemas = {
  pages: z.array(pageSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillSchema),
  project_skills: z.array(projectSkillSchema),
  articles: z.array(articleSchema),
} as const;

export class PortfolioApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortfolioApiError";
  }
}

function getSupabaseConfig() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    throw new PortfolioApiError(
      "La configuration Supabase du serveur est absente ou invalide.",
    );
  }

  return {
    url: result.data.NEXT_PUBLIC_SUPABASE_URL,
    key: result.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

async function fetchTable<TData>(
  table: keyof typeof tableSchemas,
  schema: z.ZodType<TData>,
  query: Record<string, string> = {},
): Promise<TData> {
  const { url, key } = getSupabaseConfig();
  const endpoint = new URL(`/rest/v1/${table}`, url);
  endpoint.searchParams.set("select", "*");

  for (const [key, value] of Object.entries(query)) {
    endpoint.searchParams.set(key, value);
  }

  const response = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new PortfolioApiError(
      `Supabase a refusé la lecture de la table « ${table} » (${response.status}).`,
    );
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new PortfolioApiError(
      `La table « ${table} » n'a pas renvoyé du JSON valide.`,
    );
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    console.error(`Validation Zod échouée pour ${table}`, parsed.error.issues);
    throw new PortfolioApiError(
      `Les données reçues pour « ${table} » ne respectent pas le schéma attendu.`,
    );
  }

  return parsed.data;
}

// Récupère uniquement les pages publiées, puis valide toute la réponse avec Zod.
export async function getPages(): Promise<PortfolioPage[]> {
  return fetchTable("pages", tableSchemas.pages, {
    published_at: "not.is.null",
    order: "id.asc",
  });
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const [pages, projects, skills, projectSkills, articles] = await Promise.all([
    getPages(),
    fetchTable("projects", tableSchemas.projects),
    fetchTable("skills", tableSchemas.skills),
    fetchTable("project_skills", tableSchemas.project_skills),
    fetchTable("articles", tableSchemas.articles),
  ]);

  return portfolioDataSchema.parse({
    pages,
    projects,
    skills,
    projectSkills,
    articles,
  });
}
