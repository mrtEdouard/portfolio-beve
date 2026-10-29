import "server-only";

import {
  githubProfileSchema,
  type GitHubProfile,
} from "./schemas/github";

const GITHUB_PROFILE_URL = "https://api.github.com/users/mrtEdouard";

export class GitHubApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export async function getGitHubProfile(): Promise<GitHubProfile> {
  const response = await fetch(GITHUB_PROFILE_URL, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-edouard-mouret",
      "X-GitHub-Api-Version": "2026-03-10",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new GitHubApiError(
      `GitHub a refusé la lecture du profil public (${response.status}).`,
    );
  }

  const payload: unknown = await response.json();
  const parsed = githubProfileSchema.safeParse(payload);

  if (!parsed.success) {
    console.error("Validation Zod échouée pour GitHub", parsed.error.issues);
    throw new GitHubApiError(
      "Le profil GitHub reçu ne respecte pas le schéma attendu.",
    );
  }

  return parsed.data;
}
