import { z } from "zod";
import {
  dateSchema,
  idSchema,
  nullableDateSchema,
  slugSchema,
  nullableUrlSchema,
} from "./common";

// Une couverture peut venir d'un hébergeur externe ou du dossier public/images.
const projectCoverSchema = z
  .union([
    z.string().url(),
    z.string().regex(/^\/images\/[a-z0-9/_-]+\.(?:avif|jpe?g|png|webp)$/i),
  ])
  .nullable();

// Forme attendue d'une ligne de la table « projects ».
export const projectSchema = z.object({
  id: idSchema,
  created_at: dateSchema,
  title: z.string().min(1),
  slug: slugSchema,
  summary: z.string(),
  description: z.string(),
  cover_url: projectCoverSchema,
  cover_alt: z.string().nullable(),
  demo_url: nullableUrlSchema,
  repo_url: nullableUrlSchema,
  published_at: nullableDateSchema,
});

// Table de liaison entre les projets et leurs compétences.
export const projectSkillSchema = z.object({
  project_id: idSchema,
  skill_id: idSchema,
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectSkill = z.infer<typeof projectSkillSchema>;
