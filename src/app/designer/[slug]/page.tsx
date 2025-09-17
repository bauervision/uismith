// /app/designer/[slug]/page.tsx
import { use } from "react";
import { notFound } from "next/navigation";
import { isSupported } from "@/lib/registry/components";
import DesignerClient from "./DesignerClient";

type Params = { slug: string };

export default function DesignerPage({ params }: { params: Promise<Params> }) {
  const { slug } = use(params); // unwrap the promise

  if (!isSupported(slug)) {
    notFound();
  }

  return <DesignerClient slug={slug} />;
}
