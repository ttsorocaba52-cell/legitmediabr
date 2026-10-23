"use client";

import { useEffect, useRef } from "react";

type Conn = { saveData?: boolean };

// Faixa de vídeo em largura total que divide duas seções. Decorativa (sem som, sem texto):
// só baixa e toca quando está perto da tela e pausa ao sair. Ao fim do vídeo faz um
// fade rápido antes de recomeçar (o corte do loop não aparece). Sem autoplay com
// movimento reduzido ou economia de dados: fica só a foto de capa.
export default function VideoBand() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: Conn }).connection?.saveData;
    if (reduced || saveData) return;

    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); },
      { rootMargin: "200px 0px", threshold: 0 },
    );
    io.observe(v);
    const onEnded = () => {
      v.classList.add("is-fading");
      t = setTimeout(() => { v.currentTime = 0; v.play().catch(() => {}); v.classList.remove("is-fading"); }, 450);
    };
    v.addEventListener("ended", onEnded);
    return () => { io.disconnect(); v.removeEventListener("ended", onEnded); clearTimeout(t); };
  }, []);

  return (
    <div className="video-band" aria-hidden="true">
      <video ref={ref} className="video-band-media" poster="/assets/divisor-poster.webp" muted playsInline preload="none" tabIndex={-1}>
        <source src="/assets/divisor-720.webm" type="video/webm" media="(max-width: 759px)" />
        <source src="/assets/divisor-720.mp4" type="video/mp4" media="(max-width: 759px)" />
        <source src="/assets/divisor.webm" type="video/webm" />
        <source src="/assets/divisor.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
