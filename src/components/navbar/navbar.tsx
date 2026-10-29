"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/theme-store";
import styles from "./navbar.module.css";

const socialLinks = [
  {
    name: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/edouard-mouret-4456862b2/",
  },
  {
    name: "github",
    label: "GitHub",
    href: "https://github.com/mrtEdouard",
  },
  {
    name: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/mrt.edouard/",
  },
] as const;

type SocialName = (typeof socialLinks)[number]["name"];

function SocialIcon({ name }: { name: SocialName }) {
  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 8.2V18M6.5 5.5v.1M10.5 18v-5.4a3.2 3.2 0 0 1 6.4 0V18M10.5 8.2V18" />
      </svg>
    );
  }

  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 19c-4.5 1.4-4.5-2.3-6.3-2.8M15.3 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.7-1.4 5.7-6.2A4.8 4.8 0 0 0 19.2 6 4.5 4.5 0 0 0 19 2.7S18 2.4 15.4 4a12.4 12.4 0 0 0-6.4 0C6.4 2.4 5.4 2.7 5.4 2.7A4.5 4.5 0 0 0 5.2 6 4.8 4.8 0 0 0 4 9.3c0 4.8 2.8 5.9 5.6 6.2-.5.5-.6 1.1-.6 2V21" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".7" className={styles.filledIconPart} />
    </svg>
  );
}

function SocialLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={mobile ? styles.mobileSocials : styles.desktopSocials}
      role="group"
      aria-label="Réseaux sociaux"
    >
      {socialLinks.map((social) => (
        <a
          className={styles.socialLink}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Voir le profil ${social.label} d’Edouard Mouret`}
          title={social.label}
          key={social.name}
        >
          <SocialIcon name={social.name} />
          {mobile && <span>{social.label}</span>}
        </a>
      ))}
    </div>
  );
}

type NavbarPage = {
  id: number;
  title: string;
  slug: string;
};

type NavbarProps = {
  pages: NavbarPage[];
  contactEmail: string | null;
};

export function Navbar({ pages, contactEmail }: NavbarProps) {
  // Switch pour ouvrir / fermer le burger menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Switch pour le thème clair / sombre. Le thème est stocké dans un Zustand store.
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const contactPage = pages.find((page) => page.slug === "contact");

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
          {pages
            .filter((page) => page.slug !== "contact")
            .map((page) => (
              <a
                href={`#${page.slug}`}
                key={page.id}
                // Referme automatiquement le menu après le choix d'une section.
                onClick={() => setMenuOpen(false)}
              >
                {page.title}
              </a>
            ))}
          <SocialLinks mobile />
        </div>

        {/* Boutons d'action : changement de thème et ouverture du menu mobile. */}
        <div className={styles.actions}>
          <SocialLinks />

          {contactPage && (
            <a
              className={styles.contactButton}
              href={`mailto:${contactEmail ?? ""}`}
              aria-label="Contacter Edouard Mouret par e-mail"
            >
              <span>{contactPage.title}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
          )}

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
