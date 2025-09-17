export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-10">
      <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-slate-400">
        © {new Date().getFullYear()} UISmith • Visual component smithing for the
        web
      </div>
    </footer>
  );
}
