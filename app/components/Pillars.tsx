"use client";

import { useEffect, useRef } from "react";

const PILLARS = [
  { lead: "nascido da", word: "Ousadia", text: "Exploramos novos ângulos e possibilidades para registrar seu carro de um jeito que você ainda não viu." },
  { lead: "guiado pela", word: "Exclusividade", text: "Cada pessoa tem sua própria história. Por isso, cada produção carrega uma interpretação artística única." },
  { lead: "movido pelo", word: "Sonho", text: "Aquela cena que você sempre imaginou do seu carro merece sair da imaginação e se tornar realidade." },
];

// Cada pilar fica fixo (sticky) e o seguinte sobe por cima. Enquanto é
// coberto, o pilar de baixo escurece e encolhe um pouco (--cover: 0 a 1).
export default function Pillars() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(el.children) as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      items.forEach((it, i) => {
        const next = items[i + 1];
        if (!next) return;
        const stickyTop = parseFloat(getComputedStyle(it).top) || 0;
        const h = it.offsetHeight;
        const cover = 1 - (next.getBoundingClientRect().top - stickyTop) / h;
        it.style.setProperty("--cover", String(Math.min(1, Math.max(0, cover))));
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={root} className="pillars">
      {PILLARS.map((p, i) => (
        <div className="pillar" key={p.word}>
          <div className="pillar-main">
            <span className="pillar-n">0{i + 1}</span>
            <span className="pillar-words">
              <span className="serif pillar-lead">{p.lead}</span>
              <span className="pillar-word">{p.word}</span>
            </span>
          </div>
          <p>{p.text}</p>
        </div>
      ))}
    </div>
  );
}
