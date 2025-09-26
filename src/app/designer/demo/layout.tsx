import type { Metadata } from "next";
import { defaultTheme } from "@/lib/theme";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { DataProvider } from "@/app/providers/DataProvider";
import { ConfigProvider } from "@/app/providers/ConfigProvider";

export const metadata: Metadata = {
  title: "UiSmith — Demo",
  description: "All components together with your theme applied",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = defaultTheme;
  const ssrVars = `
    :root{
      --bg:${t.bg}; --fg:${t.fg}; --accent:${t.accent}; --border:${t.border};
      --title-fg:${t.titleFg}; --body-fg:${t.bodyFg}; --footer-bg:${t.footerBg};
    }
  `;

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: ssrVars }} />
      </head>
      <body className="bg-slate-950 text-slate-100 overflow-x-hidden">
        <DataProvider baseUrl={process.env.NEXT_PUBLIC_API_BASE}>
          <ConfigProvider>
            <ThemeProvider>
              <a
                href="/"
                className="fixed left-3 top-3 z-[60] rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm hover:bg-black/60"
              >
                ← Return to UiSmith
              </a>
              {children}
            </ThemeProvider>
          </ConfigProvider>
        </DataProvider>
      </body>
    </html>
  );
}
