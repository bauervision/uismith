export type ComponentSlug = "dialog" | "navbar" | "login"; // grow here

export const COMPONENTS: {
  slug: ComponentSlug;
  title: string;
  blurb: string;
}[] = [
  {
    slug: "dialog",
    title: "Dialog",
    blurb: "Modal with title, body, footer, actions",
  },
  {
    slug: "navbar",
    title: "Navbar",
    blurb: "Responsive top bar with hamburger",
  },
  { slug: "login", title: "Login", blurb: "Auth form (coming soon)" },
];

export function isSupported(slug: string): slug is ComponentSlug {
  return COMPONENTS.some((c) => c.slug === slug);
}
