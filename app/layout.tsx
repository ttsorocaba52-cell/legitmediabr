import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Legit Media — Filme e fotografia automotiva",
  description:
    "Fotografias e filmes do seu carro por Felipe Xavier. Cada história, uma perspectiva. Fale com a gente pelo Direct.",
};

// Marca o <html> antes da pintura para o reveal-on-scroll esconder os
// elementos só quando há JS e o usuário não pediu movimento reduzido.
const revealBoot = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-reveal')`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* <link> direto em vez de next/font: o fetch do next/font roda no servidor e falha atrás de proxy. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: revealBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
