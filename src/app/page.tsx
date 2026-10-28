import { Navbar } from "@/components/navbar/navbar";
import { getPages, PortfolioApiError } from "@/lib/api/supabase";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  let pages: Awaited<ReturnType<typeof getPages>> = [];

  try {
    pages = await getPages();
  } catch (error) {
    // La navbar reste utilisable même si Supabase est momentanément indisponible.
    if (error instanceof PortfolioApiError) {
      console.error(error.message);
    } else {
      console.error("Impossible de récupérer les pages Supabase.");
    }
  }

  // On transmet au composant client uniquement les champs nécessaires au menu.
  const navigationPages = pages.map(({ id, title, slug }) => ({
    id,
    title,
    slug,
  }));

  return (
    <>
      <Navbar pages={navigationPages} />
      <main className={styles.main} />
    </>
  );
}
