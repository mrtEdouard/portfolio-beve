import { z } from "zod";
import { articleSchema } from "./articles";
import { pageSchema } from "./pages";
import { projectSchema, projectSkillSchema } from "./projects";
import { skillSchema } from "./skills";

// Validation de la réponse agrégée retournée par l'API du portfolio.
export const portfolioDataSchema = z.object({
  pages: z.array(pageSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillSchema),
  projectSkills: z.array(projectSkillSchema),
  articles: z.array(articleSchema),
});

export type PortfolioData = z.infer<typeof portfolioDataSchema>;
