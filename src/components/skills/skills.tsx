"use client";

import dynamic from "next/dynamic";
import type { PortfolioPage, Skill } from "@/lib/api/schemas";
import styles from "./skills.module.css";

const SkillsScene = dynamic(
  () => import("./skills-scene").then((module) => module.SkillsScene),
  {
    ssr: false,
    loading: () => <div className={styles.sceneLoader} aria-hidden="true" />,
  },
);

type SkillsProps = {
  page: PortfolioPage | null;
  skills: Skill[];
};

export function Skills({ page, skills }: SkillsProps) {
  if (!page || skills.length === 0) return null;

  return (
    <section className={styles.skills} id={page.slug} aria-labelledby="skills-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <div>
            <h2 id="skills-title">{page.title}</h2>
          </div>
          {page.content.trim() && <p>{page.content}</p>}
        </header>

        <div className={styles.visualization}>
          <SkillsScene skills={skills} />
        </div>
      </div>
    </section>
  );
}
