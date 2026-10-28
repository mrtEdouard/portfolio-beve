"use client";

import dynamic from "next/dynamic";
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
};

export function Hero({ pages }: HeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="hero-title">Edouard Mouret</h1>
          <p>Développeur FullStack</p>
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
