import type { Metadata, Viewport } from "next";
import "./globals.css";
import Intro from "./components/Intro";

export const metadata: Metadata = {
  title: "Legit Media — Filme e fotografia automotiva",
  description:
    "Fotografias e filmes do seu carro por Felipe Xavier. Cada história, uma perspectiva. Fale com a gente pelo Direct.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // usa a tela toda em celulares com notch
  themeColor: "#090909",
  colorScheme: "dark",
};

// Antes da pintura marca o <html>: js-reveal (o reveal-on-scroll só esconde
// elementos quando há JS e sem movimento reduzido) e intro-on (abertura: só na
// 1ª visita da sessão ou com ?intro; nunca com movimento reduzido/economia de dados).
const revealBoot = `var d=document.documentElement,r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!r)d.classList.add('js-reveal');try{var c=navigator.connection;if(!r&&!(c&&c.saveData)&&(location.search.indexOf('intro')>-1||!sessionStorage.getItem('legit-intro')))d.classList.add('intro-on')}catch(e){}`;

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
      <body>
        <Intro />
        <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
        {children}
      </body>
    </html>
  );
}
