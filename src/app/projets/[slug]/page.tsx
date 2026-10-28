import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/api/supabase";
import styles from "./project.module.css";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: "Projet introuvable | Edouard Mouret" };

  return {
    title: `${project.title} | Edouard Mouret`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const projectDate = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(project.published_at ?? project.created_at));

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.identity} href="/" aria-label="Retour à l’accueil">
          <span>E/M</span>
          <strong>Edouard Mouret</strong>
        </Link>

        <Link className={styles.back} href="/#projets">
          <span aria-hidden="true">←</span> Retour aux projets
        </Link>
      </header>

      <article className={styles.repository}>
        <div className={styles.repoHeading}>
          <div className={styles.repoPath}>
            <span className={styles.repoIcon} aria-hidden="true">&lt;/&gt;</span>
            <span>edouard-mouret</span>
            <span className={styles.separator}>/</span>
            <h1>{project.slug}</h1>
            <span className={styles.visibility}>Public</span>
          </div>
          <p>{project.summary}</p>
        </div>

        <nav className={styles.repoNav} aria-label="Navigation du projet">
          <span className={styles.activeTab}>Aperçu</span>
          <span>README</span>
          <span>Détails</span>
        </nav>

        <div className={styles.branchBar}>
          <span className={styles.branch}><span aria-hidden="true">⑂</span> main</span>
          <span className={styles.commit}><strong>Edouard Mouret</strong> présentation du projet</span>
          <span className={styles.commitDate}>{projectDate}</span>
        </div>

        <div className={styles.repoLayout}>
          <div className={styles.readme}>
            <div className={styles.readmeTitle}>
              <span aria-hidden="true">▤</span>
              README.md
            </div>

            <div className={styles.readmeBody}>
              <h2>{project.title}</h2>

              <figure className={styles.visual}>
                <div className={styles.cover}>
                  {project.cover_url ? (
                    <Image
                      src={project.cover_url}
                      alt={project.cover_alt ?? `Aperçu du projet ${project.title}`}
                      fill
                      priority
                      sizes="(max-width: 900px) 100vw, 720px"
                    />
                  ) : (
                    <span>{project.title.slice(0, 1)}</span>
                  )}
                </div>
              </figure>

              <h3>À propos du projet</h3>
              <p>{project.description}</p>
            </div>
          </div>

          <aside className={styles.sidebar} aria-label="Informations sur le projet">
            <section>
              <h2>À propos</h2>
              <p>{project.summary}</p>

              <div className={styles.links}>
                {project.demo_url && (
                  <a href={project.demo_url} target="_blank" rel="noreferrer">
                    <span aria-hidden="true">↗</span> Voir la démo
                  </a>
                )}
                {project.repo_url && (
                  <a href={project.repo_url} target="_blank" rel="noreferrer">
                    <span aria-hidden="true">⌘</span> Code source
                  </a>
                )}
              </div>
            </section>

            <section>
              <h2>Informations</h2>
              <dl className={styles.details}>
                <div>
                  <dt>Branche</dt>
                  <dd>main</dd>
                </div>
                <div>
                  <dt>Publié</dt>
                  <dd>{projectDate}</dd>
                </div>
                <div>
                  <dt>Statut</dt>
                  <dd><span className={styles.statusDot} /> Public</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
