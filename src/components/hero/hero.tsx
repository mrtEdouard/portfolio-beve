"use client";

import dynamic from "next/dynamic";
import type { GitHubProfile } from "@/lib/api/schemas";
import { PortfolioTerminal, type TerminalPage } from "./portfolio-terminal";
import styles from "./hero.module.css";

const HeroScene = dynamic(
  () => import("./hero-scene").then((module) => module.HeroScene),
  {
    ssr: false,
    loading: () => <div className={styles.sceneLoader} aria-hidden="true" />,
  },
);

type HeroProps = {
  pages: TerminalPage[];
  githubProfile: GitHubProfile | null;
};

export function Hero({ pages, githubProfile }: HeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="hero-title">Edouard Mouret</h1>
          <p>Développeur FullStack</p>

          <div className={styles.socials} aria-label="Réseaux sociaux">
            <a
              href="https://www.linkedin.com/in/edouard-mouret-4456862b2/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn d’Edouard Mouret"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.5 8.2V18M6.5 5.5v.1M10.5 18v-5.4a3.2 3.2 0 0 1 6.4 0V18M10.5 8.2V18" />
              </svg>
              <span className={styles.socialLabel}>LinkedIn</span>
            </a>
            <a
              href="https://github.com/mrtEdouard"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub d’Edouard Mouret"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 19c-4.5 1.4-4.5-2.3-6.3-2.8M15.3 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.7-1.4 5.7-6.2A4.8 4.8 0 0 0 19.2 6 4.5 4.5 0 0 0 19 2.7S18 2.4 15.4 4a12.4 12.4 0 0 0-6.4 0C6.4 2.4 5.4 2.7 5.4 2.7A4.5 4.5 0 0 0 5.2 6 4.8 4.8 0 0 0 4 9.3c0 4.8 2.8 5.9 5.6 6.2-.5.5-.6 1.1-.6 2V21" />
              </svg>
              <span className={styles.socialLabel}>GitHub</span>
              {githubProfile && (
                <small className={styles.githubStats}>
                  <i aria-hidden="true" />
                  <span>{githubProfile.public_repos} dépôts</span>
                  <span className={styles.followers}>
                    · {githubProfile.followers} abonnés
                  </span>
                </small>
              )}
            </a>
            <a
              href="https://www.instagram.com/mrt.edouard/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram d’Edouard Mouret"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r=".7" className={styles.filledIconPart} />
              </svg>
              <span className={styles.socialLabel}>Instagram</span>
            </a>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.scene} aria-hidden="true">
            <HeroScene />
          </div>
          <PortfolioTerminal pages={pages} />
        </div>
      </div>
    </section>
  );
}
