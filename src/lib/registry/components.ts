export type ComponentSlug =
  | "dialog"
  | "navbar"
  | "login"
  | "button"
  | "card"
  | "sheet"
  | "tabs"
  | "tooltip";

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

  // new (stubs/mini previews now; full designers later)
  { slug: "button", title: "Button", blurb: "States, variants, icons" },
  { slug: "card", title: "Card", blurb: "Surface for content blocks" },
  { slug: "sheet", title: "Sheet", blurb: "Edge-docked overlay panel" },
  { slug: "tabs", title: "Tabs", blurb: "Switch between views" },
  { slug: "tooltip", title: "Tooltip", blurb: "Hover/focus hints with motion" },
];

export function isSupported(slug: string): slug is ComponentSlug {
  return COMPONENTS.some((c) => c.slug === slug);
}
