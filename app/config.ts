// Pendente: confirmar o @ do Instagram e os links das redes com o Felipe.
export const INSTAGRAM_HANDLE = "legitmedia";

// Todo CTA de contato abre o Direct do Instagram (único canal, sem formulário).
export const DIRECT_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`;
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
export const YOUTUBE_URL = "#";
export const VIMEO_URL = "#";

export type Work = {
  img: string;
  title: string;
  meta: string;
  pos: string;
  car: string;
  loc: string;
  exif: [string, string, string, string];
  /** Pré-visualização em vídeo ao abrir o painel: caminho sem extensão (.webm e .mp4). */
  video?: string;
};

export const WORKS: Work[] = [
  { img: "/assets/p01.webp", title: "Golf Vermelho", meta: "Em movimento", pos: "45% 50%", car: "VW Golf", loc: "Rodovia", exif: ["35mm", "f/4", "1/60", "100"], video: "/assets/golf-vermelho" },
  { img: "/assets/p09.webp", title: "Golf na Represa", meta: "Fotografia", pos: "50% 55%", car: "VW Golf", loc: "Represa", exif: ["85mm", "f/1.8", "1/500", "200"], video: "/assets/golf-azul" },
  { img: "/assets/p13.webp", title: "Ferrari 296", meta: "Filme", pos: "55% 60%", car: "Ferrari 296", loc: "Pista", exif: ["50mm", "f/5.6", "1/50", "100"], video: "/assets/ferrari" },
  { img: "/assets/p11.webp", title: "Painel", meta: "Detalhe", pos: "50% 50%", car: "Ferrari", loc: "Estúdio", exif: ["24mm", "f/2", "1/125", "1600"], video: "/assets/painel" },
  { img: "/assets/p04.webp", title: "Comboio", meta: "Evento", pos: "30% 50%", car: "VW Polo GTS", loc: "Rodovia", exif: ["35mm", "f/4", "1/60", "100"], video: "/assets/polo-gts" },
  { img: "/assets/p12.webp", title: "Lamborghini", meta: "Em movimento", pos: "35% 50%", car: "Lamborghini", loc: "Avenida", exif: ["24mm", "f/5", "1/50", "200"], video: "/assets/lamborghini" },
  { img: "/assets/p02.webp", title: "Astra", meta: "Em movimento", pos: "50% 55%", car: "Chevrolet Astra", loc: "Rodovia", exif: ["35mm", "f/4", "1/60", "100"], video: "/assets/astra" },
];

export const SERVICES = [
  { title: "Fotografia automotiva", desc: "Para guardar os detalhes, as linhas e a personalidade do carro que faz parte da sua vida.", img: "/assets/servico-fotografia.webp" },
  { title: "Filmes cinematográficos", desc: "Movimento, som e atmosfera para reviver a sensação de estar ao volante ou admirar seu carro de outra perspectiva.", img: "/assets/p14.webp" },
  { title: "Eventos automotivos", desc: "Os encontros, as pessoas e os momentos que fazem a cultura automotiva acontecer.", img: "/assets/p03.webp" },
  { title: "Produções criativas", desc: "Para transformar aquela ideia que você sempre imaginou em uma experiência visual exclusiva.", img: "/assets/p10.webp" },
];

export const pad2 = (n: number) => String(n).padStart(2, "0");
