import { Navbar } from "@/components/navbar/navbar";
import { Hero } from "@/components/hero/hero";
import { About } from "@/components/about/about";
import { Projects } from "@/components/projects/projects";
import { Skills } from "@/components/skills/skills";
import {
  getPages,
  getProjects,
  getSkills,
  PortfolioApiError,
} from "@/lib/api/supabase";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  let pages: Awaited<ReturnType<typeof getPages>> = [];
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let skills: Awaited<ReturnType<typeof getSkills>> = [];

  const [pagesResult, projectsResult, skillsResult] = await Promise.allSettled([
    getPages(),
    getProjects(),
    getSkills(),
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

  if (skillsResult.status === "fulfilled") {
    skills = skillsResult.value;
  } else {
    const error = skillsResult.reason;
    console.error(
      error instanceof PortfolioApiError
        ? error.message
        : "Impossible de récupérer les compétences Supabase.",
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
  const skillsPage =
    pages.find(
      (page) =>
        ["skills", "competences"].includes(page.slug) ||
        /skills|compétences/i.test(page.title),
    ) ?? null;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;

  return (
    <>
      <Navbar pages={navigationPages} contactEmail={contactEmail} />
      <main className={styles.main}>
        <Hero pages={terminalPages} />
        <About page={aboutPage} />
        <Projects projects={projects} />
        <Skills page={skillsPage} skills={skills} />
      </main>
    </>
  );
}
