import { z } from "zod";
import {
  dateSchema,
  idSchema,
  nullableDateSchema,
  nullableUrlSchema,
} from "./common";

// Catégories autorisées pour classer les expériences dans la timeline.
export const experienceTypeSchema = z.enum([
  "professional",
  "education",
  "other",
]);

// Forme attendue d'une ligne de la table « experiences ».
export const experienceSchema = z.object({
  id: idSchema,
  created_at: dateSchema,
  title: z.string().min(1),
  organization: z.string().min(1),
  location: z.string().nullable(),
  start_date: z.string().date(),
  end_date: z.string().date().nullable(),
  period_label: z.string().nullable(),
  current: z.boolean(),
  type: experienceTypeSchema,
  description: z.string(),
  link_url: nullableUrlSchema,
  link_label: z.string().nullable(),
  published_at: nullableDateSchema,
});

export type ExperienceType = z.infer<typeof experienceTypeSchema>;
export type Experience = z.infer<typeof experienceSchema>;
