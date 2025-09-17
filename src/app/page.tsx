import Link from "next/link";
import { COMPONENTS } from "@/lib/registry/components";

export default function Home() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">What do you want to craft?</h1>
        <p className="text-slate-400">Pick a component to design or edit.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {COMPONENTS.map((c) => (
          <Link
            key={c.slug}
            href={`/designer/${c.slug}`}
            className="rounded-xl border border-white/10 bg-slate-900/50 p-4 hover:border-emerald-500/40 transition"
          >
            <div className="font-semibold">{c.title}</div>
            <div className="text-sm text-slate-400">{c.blurb}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
