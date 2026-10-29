import { z } from "zod";
import {
  dateSchema,
  idSchema,
  nullableDateSchema,
  nullableUrlSchema,
  slugSchema,
} from "./common";

// Forme attendue d'une ligne de la table « articles ».
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

export type Article = z.infer<typeof articleSchema>;
