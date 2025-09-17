import { use } from "react";
import { notFound } from "next/navigation";
import { isSupported } from "@/lib/registry/components";
import DesignerClient from "./DesignerClient";

type Params = { slug: string };

// In newer Next, params is a Promise. Typing it this way keeps TS happy.
export default function DesignerPage({
  params,
}: {
  params: Promise<Params> | Params;
}) {
  // Support both shapes during migration
  const resolved = isPromise(params)
    ? use(params as Promise<Params>)
    : (params as Params);
  const { slug } = resolved;

  if (!isSupported(slug)) {
    notFound();
  }

  return <DesignerClient slug={slug} />;
}

function isPromise<T>(value: unknown): value is Promise<T> {
  return !!value && typeof value === "object" && "then" in (value as any);
}
