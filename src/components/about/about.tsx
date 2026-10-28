import Image from "next/image";
import type { PortfolioPage } from "@/lib/api/schemas";
import profilePhoto from "../../../photo.jpg";
import styles from "./about.module.css";

type AboutProps = {
  page: PortfolioPage | null;
};

export function About({ page }: AboutProps) {
  if (!page) return null;

  return (
    <section className={styles.about} id={page.slug} aria-labelledby="about-title">
      <div className={styles.inner}>
        <h2 id="about-title">{page.title}</h2>

        <div className={styles.layout}>
          <div className={styles.photoFrame}>
            <Image
              src={profilePhoto}
              alt="Portrait d’Edouard Mouret"
              fill
              sizes="(max-width: 760px) 100vw, 430px"
              priority={false}
            />
          </div>

          <div className={styles.text}>
            <p>{page.content}</p>

            {/* À remplacer par un lien <a> lorsque le portfolio sera disponible. */}
            <button className={styles.animatorPortfolio} type="button" disabled>
              Portfolio d’animateur
              <span>Bientôt disponible</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
