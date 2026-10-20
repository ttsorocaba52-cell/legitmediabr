"use client";

import { useEffect, useRef, useState } from "react";

type Conn = { saveData?: boolean };

// Vídeo do hero (mudo, em loop) com parallax leve (scrollY × 0.16) e botão de
// pausa (WCAG 2.2.2). Não toca sozinho com movimento reduzido ou economia de
// dados: fica o poster, e a pessoa pode dar play se quiser.
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const decided = useRef(false); // só mexe no vídeo depois de ler as preferências

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: Conn }).connection?.saveData;
    setPaused(!!(reduced || saveData));
    decided.current = true;
    if (reduced) return;
    const v = ref.current;
    const onScroll = () => {
      const y = window.scrollY;
      if (v && y < window.innerHeight * 1.2) v.style.transform = `translate3d(0,${y * 0.16}px,0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !decided.current) return;
    if (paused) v.pause();
    else v.play().catch(() => setPaused(true));
  }, [paused]);

  return (
    <>
      <video
        ref={ref}
        className="hero-img"
        poster="/assets/hero-poster.webp"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/assets/hero-720.webm" type="video/webm" media="(max-width: 759px)" />
        <source src="/assets/hero-720.mp4" type="video/mp4" media="(max-width: 759px)" />
        <source src="/assets/hero.webm" type="video/webm" />
        <source src="/assets/hero.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        className="hero-toggle"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo"}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="currentColor">
          {paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M2.5 1.5h3.2v11H2.5zM8.3 1.5h3.2v11H8.3z" />}
        </svg>
      </button>
    </>
  );
}
