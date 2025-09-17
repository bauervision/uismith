import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-slate-950/20 backdrop-blur supports-[backdrop-filter]:bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          UISmith
        </Link>
        <div className="text-sm text-slate-400">Design → Export → Drop-in</div>
      </div>
    </nav>
  );
}
