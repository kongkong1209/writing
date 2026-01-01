import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "手把手带你练写作 | Gu's Method",
  description: "基于《手把手教你雅思写作》的AI辅助写作训练平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="pb-16 md:pb-0 md:ml-[var(--sidebar-width)] md:transition-all md:duration-300 relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

