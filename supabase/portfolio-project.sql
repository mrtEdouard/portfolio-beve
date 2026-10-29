-- Fiche du portfolio personnel.
-- Le script est idempotent : il met à jour la fiche si elle existe déjà.
update public.projects
set
  title = 'Portfolio — Edouard Mouret',
  summary = 'Portfolio full-stack interactif conçu pour présenter mon parcours, mes projets et mes compétences à travers une expérience immersive.',
  description = E'Ce portfolio est une application web développée avec Next.js et TypeScript pour présenter mon profil de développeur autrement qu’avec une simple succession de pages statiques. Il réunit mon parcours, mes expériences, mes compétences et mes projets dans une interface cohérente, responsive et accessible.\n\nLes contenus sont administrés depuis Supabase et récupérés par son API REST. Chaque réponse est contrôlée avec des schémas Zod organisés par domaine avant d’être utilisée par l’interface. Cette architecture permet d’ajouter ou de modifier les données sans toucher directement aux composants du site.\n\nL’expérience visuelle s’appuie sur Three.js et React Three Fiber : terminal interactif, commandes cachées et constellation de compétences générée dynamiquement depuis la base de données. Zustand gère le thème clair ou sombre, tandis que les routes dynamiques de Next.js offrent une page détaillée propre à chaque projet.\n\nLe principal défi a été de concilier une direction artistique personnelle avec une architecture maintenable et performante. Le résultat est un portfolio évolutif qui constitue lui-même une démonstration concrète de mes compétences full-stack.',
  cover_url = '/images/projects/portfolio-cover.jpg',
  cover_alt = 'Aperçu de la page d’accueil du portfolio d’Edouard Mouret',
  demo_url = null,
  repo_url = 'https://github.com/mrtEdouard/portfolio-beve',
  published_at = now()
where slug = 'portfolio-edouard-mouret';

insert into public.projects (
  title,
  slug,
  summary,
  description,
  cover_url,
  cover_alt,
  demo_url,
  repo_url,
  published_at
)
select
  'Portfolio — Edouard Mouret',
  'portfolio-edouard-mouret',
  'Portfolio full-stack interactif conçu pour présenter mon parcours, mes projets et mes compétences à travers une expérience immersive.',
  E'Ce portfolio est une application web développée avec Next.js et TypeScript pour présenter mon profil de développeur autrement qu’avec une simple succession de pages statiques. Il réunit mon parcours, mes expériences, mes compétences et mes projets dans une interface cohérente, responsive et accessible.\n\nLes contenus sont administrés depuis Supabase et récupérés par son API REST. Chaque réponse est contrôlée avec des schémas Zod organisés par domaine avant d’être utilisée par l’interface. Cette architecture permet d’ajouter ou de modifier les données sans toucher directement aux composants du site.\n\nL’expérience visuelle s’appuie sur Three.js et React Three Fiber : terminal interactif, commandes cachées et constellation de compétences générée dynamiquement depuis la base de données. Zustand gère le thème clair ou sombre, tandis que les routes dynamiques de Next.js offrent une page détaillée propre à chaque projet.\n\nLe principal défi a été de concilier une direction artistique personnelle avec une architecture maintenable et performante. Le résultat est un portfolio évolutif qui constitue lui-même une démonstration concrète de mes compétences full-stack.',
  '/images/projects/portfolio-cover.jpg',
  'Aperçu de la page d’accueil du portfolio d’Edouard Mouret',
  null,
  'https://github.com/mrtEdouard/portfolio-beve',
  now()
where not exists (
  select 1
  from public.projects
  where slug = 'portfolio-edouard-mouret'
);
