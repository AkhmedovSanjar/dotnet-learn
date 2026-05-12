import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  Source_Serif_4,
} from "next/font/google";

import { Header } from "@/components/Header";
import { Providers } from "@/app/providers";
import { siteConfig } from "@/config/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DotnetLearn",
    template: "%s | DotnetLearn",
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${sourceSerif.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--page-background)] text-[var(--foreground)]">
        <Providers>
          <div className="relative min-h-screen">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.16),_transparent_30%)]" />
            <Header />
            <main className="relative z-10 pb-16">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
