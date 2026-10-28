"use client";

import { useMemo, useState } from "react";
import type {
  Experience,
  ExperienceType,
  PortfolioPage,
} from "@/lib/api/schemas";
import styles from "./experiences.module.css";

type ExperiencesProps = {
  page: PortfolioPage | null;
  experiences: Experience[];
};

type ExperienceFilter = "all" | ExperienceType;

const FILTERS: Array<{ value: ExperienceFilter; label: string }> = [
  { value: "all", label: "Toutes" },
  { value: "professional", label: "Professionnelles" },
  { value: "education", label: "Scolaires" },
  { value: "other", label: "Annexes" },
];

const TYPE_LABELS: Record<ExperienceType, string> = {
  professional: "Professionnelle",
  education: "Scolaire",
  other: "Annexe",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  year: "numeric",
  timeZone: "Europe/Paris",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T12:00:00+01:00`));
}

export function Experiences({ page, experiences }: ExperiencesProps) {
  const [activeFilter, setActiveFilter] = useState<ExperienceFilter>("all");

  const filteredExperiences = useMemo(
    () =>
      activeFilter === "all"
        ? experiences
        : experiences.filter((experience) => experience.type === activeFilter),
    [activeFilter, experiences],
  );

  if (!page) return null;

  return (
    <section className={styles.experiences} id={page.slug} aria-labelledby="experiences-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <div>
            <p className={styles.kicker}>Mon parcours</p>
            <h2 id="experiences-title">{page.title}</h2>
          </div>
          {page.content.trim() && <p className={styles.intro}>{page.content}</p>}
        </header>

        <div className={styles.filters} aria-label="Filtrer les expériences">
          {FILTERS.map((filter) => {
            const count =
              filter.value === "all"
                ? experiences.length
                : experiences.filter((experience) => experience.type === filter.value).length;

            return (
              <button
                className={activeFilter === filter.value ? styles.activeFilter : undefined}
                type="button"
                aria-pressed={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
                key={filter.value}
              >
                {filter.label} <span>{count}</span>
              </button>
            );
          })}
        </div>

        {filteredExperiences.length > 0 ? (
          <div className={styles.timeline}>
            {filteredExperiences.map((experience) => (
              <article className={styles.item} key={experience.id}>
                <span className={styles.node} data-type={experience.type} aria-hidden="true" />

                <div className={styles.card}>
                  <div className={styles.meta}>
                    <span data-type={experience.type}>{TYPE_LABELS[experience.type]}</span>
                    <time>
                      {experience.period_label ?? (
                        <>
                          {formatDate(experience.start_date)} — {experience.current
                            ? "Aujourd’hui"
                            : experience.end_date
                              ? formatDate(experience.end_date)
                              : "Ponctuel"}
                        </>
                      )}
                    </time>
                  </div>

                  <h3>{experience.title}</h3>
                  <p className={styles.organization}>
                    {experience.organization}
                    {experience.location && <span> · {experience.location}</span>}
                  </p>
                  {experience.description && (
                    <p className={styles.description}>{experience.description}</p>
                  )}

                  {experience.link_url && (
                    <a href={experience.link_url} target="_blank" rel="noreferrer">
                      {experience.link_label ?? "En savoir plus"} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            {experiences.length === 0
              ? "La timeline apparaîtra dès que la table experiences contiendra des entrées publiées."
              : "Aucune expérience dans cette catégorie pour le moment."}
          </p>
        )}
      </div>
    </section>
  );
}
