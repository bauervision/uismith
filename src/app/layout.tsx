import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { defaultTheme } from "@/lib/theme";
import { ThemeProvider } from "./providers/ThemeProvider";
import { DataProvider } from "./providers/DataProvider";
import { ConfigProvider } from "./providers/ConfigProvider";

export const metadata: Metadata = {
  title: "UiSmith",
  description: "Forge your UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = defaultTheme; // SSR default = matches first client paint
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
              <Navbar />
              <main className="mx-auto max-w-7xl">{children}</main>
            </ThemeProvider>
          </ConfigProvider>
        </DataProvider>
      </body>
    </html>
  );
}
