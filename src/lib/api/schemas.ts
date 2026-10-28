import { z } from "zod";

// Validations communes réutilisées dans plusieurs tables.
const idSchema = z.number().int().positive();
const dateSchema = z.string().datetime({ offset: true });
const nullableDateSchema = dateSchema.nullable();
const nullableUrlSchema = z.string().url().nullable();
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

// Forme attendue d'une ligne de la table « pages ».
export const pageSchema = z.object({
  id: idSchema,
  created_at: dateSchema,
  title: z.string().min(1),
  slug: slugSchema,
  content: z.string(),
  published_at: nullableDateSchema,
});

// Forme attendue d'une ligne de la table « projects ».
export const projectSchema = z.object({
  id: idSchema,
  created_at: dateSchema,
  title: z.string().min(1),
  slug: slugSchema,
  summary: z.string(),
  description: z.string(),
  cover_url: nullableUrlSchema,
  cover_alt: z.string().nullable(),
  demo_url: nullableUrlSchema,
  repo_url: nullableUrlSchema,
  published_at: nullableDateSchema,
});

// Forme attendue d'une compétence.
export const skillSchema = z.object({
  id: idSchema,
  created_at: dateSchema,
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.string().min(1),
});

// Table de liaison entre les projets et leurs compétences.
export const projectSkillSchema = z.object({
  project_id: idSchema,
  skill_id: idSchema,
});

// Forme attendue d'un article.
export const articleSchema = z.object({
  id: idSchema,
  created_at: dateSchema,
  title: z.string().min(1),
  slug: slugSchema,
  excerpt: z.string(),
  content: z.string(),
  cover_url: nullableUrlSchema,
  cover_alt: z.string().nullable(),
  published_at: nullableDateSchema,
});

// Validation de toutes les collections retournées par l'API du portfolio.
export const portfolioDataSchema = z.object({
  pages: z.array(pageSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillSchema),
  projectSkills: z.array(projectSkillSchema),
  articles: z.array(articleSchema),
});

// Types TypeScript automatiquement déduits des schémas Zod.
export type PortfolioPage = z.infer<typeof pageSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type ProjectSkill = z.infer<typeof projectSkillSchema>;
export type Article = z.infer<typeof articleSchema>;
export type PortfolioData = z.infer<typeof portfolioDataSchema>;
