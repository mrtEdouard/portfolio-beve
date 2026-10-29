import { z } from "zod";

// Sous-ensemble public du profil GitHub utilisé par l'indicateur du hero.
export const githubProfileSchema = z.object({
  login: z.string().min(1),
  html_url: z.string().url(),
  public_repos: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
});

export type GitHubProfile = z.infer<typeof githubProfileSchema>;
