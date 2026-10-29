import { z } from "zod";
import {
  dateSchema,
  idSchema,
  nullableDateSchema,
  slugSchema,
} from "./common";

// Forme attendue d'une ligne de la table « pages ».
export const pageSchema = z.object({
  id: idSchema,
  created_at: dateSchema,
  title: z.string().min(1),
  slug: slugSchema,
  content: z.string(),
  published_at: nullableDateSchema,
});

export type PortfolioPage = z.infer<typeof pageSchema>;
