import { Navbar } from "@/components/navbar/navbar";
import { Hero } from "@/components/hero/hero";
import { About } from "@/components/about/about";
import { Projects } from "@/components/projects/projects";
import { getPages, getProjects, PortfolioApiError } from "@/lib/api/supabase";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  let pages: Awaited<ReturnType<typeof getPages>> = [];
  let projects: Awaited<ReturnType<typeof getProjects>> = [];

  const [pagesResult, projectsResult] = await Promise.allSettled([
    getPages(),
    getProjects(),
  ]);

  if (pagesResult.status === "fulfilled") {
    pages = pagesResult.value;
  } else {
    // La navbar reste utilisable même si Supabase est momentanément indisponible.
    const error = pagesResult.reason;
    console.error(
      error instanceof PortfolioApiError
        ? error.message
        : "Impossible de récupérer les pages Supabase.",
    );
  }

  if (projectsResult.status === "fulfilled") {
    projects = projectsResult.value;
  } else {
    const error = projectsResult.reason;
    console.error(
      error instanceof PortfolioApiError
        ? error.message
        : "Impossible de récupérer les projets Supabase.",
    );
  }

  // On transmet au composant client uniquement les champs nécessaires au menu.
  const navigationPages = pages.map(({ id, title, slug }) => ({
    id,
    title,
    slug,
  }));

  const terminalPages = pages.map(({ id, title, slug, content }) => ({
    id,
    title,
    slug,
    content,
  }));

  const aboutPage = pages.find((page) => page.slug === "a-propos") ?? null;

  return (
    <>
      <Navbar pages={navigationPages} />
      <main className={styles.main}>
        <Hero pages={terminalPages} />
        <About page={aboutPage} />
        <Projects projects={projects} />
      </main>
    </>
  );
}
