import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

