"use client";


import Link from "next/link";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/theme-store";
import styles from "./navbar.module.css";

type NavbarPage = {
  id: number;
  title: string;
  slug: string;
};

type NavbarProps = {
  pages: NavbarPage[];
};

export function Navbar({ pages }: NavbarProps) {
  // Switch pour ouvrir / fermer le burger menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Switch pour le thème clair / sombre. Le thème est stocké dans un Zustand store.
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  // Réhydratation dans le local storage pour que le thème choisi soit conservé entre les sessions.
  useEffect(() => {
    useThemeStore.persist.rehydrate();
  }, []);

  // data-theme permet aux variables CSS globales de choisir les bonnes couleurs.
  // colorScheme adapte aussi les éléments natifs du navigateur au thème actif.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navigation principale">
        <Link
          className={styles.logo}
          href="/"
          aria-label="Edouard Mouret — retour à l’accueil"
        >
          <span className={styles.logoMark} aria-hidden="true">
            <span>E</span>
            <i />
            <span>M</span>
          </span>
          <span className={styles.logoType}>
            <strong>
              EDOUARD <span>/</span> MOURET
            </strong>
            <small>DÉVELOPPEUR WEB</small>
          </span>
        </Link>

        {/*
          Navigation générée depuis les pages Supabase. La classe linksOpen
          est ajoutée uniquement lorsque le menu mobile est ouvert.
        */}
        <div
          className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}
          id="mobile-navigation"
        >
          {pages.map((page) => (
            <a
              href={`#${page.slug}`}
              key={page.id}
              // Referme automatiquement le menu après le choix d'une section.
              onClick={() => setMenuOpen(false)}
            >
              {page.title}
            </a>
          ))}
        </div>

        {/* Boutons d'action : changement de thème et ouverture du menu mobile. */}
        <div className={styles.actions}>
          <button
            className={styles.themeButton}
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"
            }
            title={theme === "light" ? "Mode sombre" : "Mode clair"}
          >
            {/* L'icône affichée dépend du thème actuellement actif. */}
            {theme === "light" ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 15.2A9 9 0 0 1 8.8 3a9 9 0 1 0 12.2 12.2Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
              </svg>
            )}
          </button>

          <button
            className={styles.menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      
      <div className={styles.waves} aria-hidden="true">
        <svg
          className={`${styles.wave} ${styles.waveBack}`}
          viewBox="0 0 2880 64"
          preserveAspectRatio="none"
        >
          <path d="M0 20C180 2 360 46 540 24S900 2 1080 24s360 22 540 0 360-22 540 0 360 22 540 0 360-22 540 0V0H0Z" />
        </svg>
        <svg
          className={`${styles.wave} ${styles.waveMiddle}`}
          viewBox="0 0 2880 64"
          preserveAspectRatio="none"
        >
          <path d="M0 17c150 25 330 25 510 0s360-25 540 0 360 25 540 0 360-25 540 0 360 25 540 0 360-25 540 0V0H0Z" />
        </svg>
        <svg
          className={`${styles.wave} ${styles.waveFront}`}
          viewBox="0 0 2880 64"
          preserveAspectRatio="none"
        >
          <path d="M0 13c180-16 360 30 540 13s360-30 540-13 360 30 540 13 360-30 540-13 360 30 540 13 360-30 540-13V0H0Z" />
        </svg>
      </div>
    </header>
  );
}
