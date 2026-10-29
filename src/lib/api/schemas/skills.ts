import { z } from "zod";
import { dateSchema, idSchema } from "./common";

// Forme attendue d'une ligne de la table « skills ».
export const skillSchema = z.object({
  id: idSchema,
  created_at: dateSchema,
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.string().min(1),
});

export type Skill = z.infer<typeof skillSchema>;
