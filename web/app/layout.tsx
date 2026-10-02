import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MarketAnalyst · Terminal de Tendências",
  description:
    "Inteligência de investimentos: radar de tendências, teses fundamentalistas e educação financeira sem economês.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-void font-sans text-fg">{children}</body>
    </html>
  );
}
