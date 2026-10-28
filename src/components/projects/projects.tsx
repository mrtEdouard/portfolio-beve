import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/api/schemas";
import styles from "./projects.module.css";

type ProjectsProps = {
  projects: Project[];
};

export function Projects({ projects }: ProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className={styles.projects} id="projets" aria-labelledby="projects-title">
      <div className={styles.inner}>
        <h2 id="projects-title">Projets</h2>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <article key={project.id}>
              <Link className={styles.card} href={`/projets/${project.slug}`}>
                <div className={styles.cover}>
                  {project.cover_url ? (
                    <Image
                      src={project.cover_url}
                      alt={project.cover_alt ?? `Aperçu du projet ${project.title}`}
                      fill
                      sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 400px"
                    />
                  ) : (
                    <span className={styles.coverFallback}>{project.title.slice(0, 1)}</span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>

                  <span className={styles.discover}>
                    Découvrir le projet <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
