export type ComponentKind = "simple" | "functional";

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
  kind: ComponentKind;
}[] = [
  {
    slug: "dialog",
    title: "Dialog",
    blurb: "Modal with title, body, footer, actions",
    kind: "simple",
  },
  {
    slug: "navbar",
    title: "Navbar",
    blurb: "Responsive top bar with hamburger",
    kind: "functional",
  },
  {
    slug: "login",
    title: "Login",
    blurb: "Auth form (coming soon)",
    kind: "functional",
  },

  {
    slug: "button",
    title: "Button",
    blurb: "States, variants, icons",
    kind: "simple",
  },
  {
    slug: "card",
    title: "Card",
    blurb: "Surface for content blocks",
    kind: "simple",
  },
  {
    slug: "sheet",
    title: "Sheet",
    blurb: "Edge-docked overlay panel",
    kind: "simple",
  },
  {
    slug: "tabs",
    title: "Tabs",
    blurb: "Switch between views",
    kind: "simple",
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    blurb: "Hover/focus hints with motion",
    kind: "simple",
  },
];

export function isSupported(slug: string): slug is ComponentSlug {
  return COMPONENTS.some((c) => c.slug === slug);
}
