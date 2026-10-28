import styles from "./project.module.css";

export default function ProjectLoading() {
  return (
    <main className={styles.page} aria-busy="true" aria-label="Chargement du projet">
      <div className={styles.loading}>Chargement du projet…</div>
    </main>
  );
}
