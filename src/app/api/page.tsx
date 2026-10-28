import Link from "next/link";
import { getPortfolioData, PortfolioApiError } from "@/lib/api/supabase";
import type { PortfolioData } from "@/lib/api/schemas";
import styles from "./api.module.css";

export const dynamic = "force-dynamic";

const labels: Record<keyof PortfolioData, string> = {
  pages: "Pages",
  projects: "Projets",
  skills: "Compétences",
  projectSkills: "Relations projets / compétences",
  articles: "Articles",
};

function DataSection({
  name,
  value,
}: {
  name: keyof PortfolioData;
  value: PortfolioData[keyof PortfolioData];
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>{labels[name]}</h2>
        <span>{value.length} entrée{value.length > 1 ? "s" : ""}</span>
      </div>
      <pre className={styles.code}>
        <code>{JSON.stringify(value, null, 2)}</code>
      </pre>
    </section>
  );
}

export default async function ApiPage() {
  let data: PortfolioData;

  try {
    data = await getPortfolioData();
  } catch (error) {
    const message =
      error instanceof PortfolioApiError
        ? error.message
        : "Une erreur inattendue est survenue.";

    return (
      <main className={styles.page}>
        <div className={styles.error}>
          <p className={styles.eyebrow}>API indisponible</p>
          <h1>Impossible de charger les données</h1>
          <p>{message}</p>
          <Link href="/">Retour à l’accueil</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Supabase REST · validation Zod</p>
          <h1>Contenu de l’API</h1>
          <p className={styles.intro}>
            Les données ci-dessous sont récupérées côté serveur puis contrôlées
            avant leur affichage.
          </p>
        </div>
        <a className={styles.endpoint} href="/api/data">
          Voir le JSON brut →
        </a>
      </header>

      <div className={styles.grid}>
        {(Object.keys(labels) as Array<keyof PortfolioData>).map((name) => (
          <DataSection key={name} name={name} value={data[name]} />
        ))}
      </div>
    </main>
  );
}
