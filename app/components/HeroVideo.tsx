"use client";

import { useEffect, useRef } from "react";

type Conn = { saveData?: boolean };

// Vídeo do hero (mudo, em loop) com parallax leve (scrollY × 0.16). Com
// movimento reduzido ou economia de dados não toca: fica só o poster.
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: Conn }).connection?.saveData;
    if (reduced || saveData) return;
    // com a abertura na tela, o vídeo só começa quando ela termina (não decodifica por trás dela)
    let t: ReturnType<typeof setTimeout> | undefined;
    const play = () => { clearTimeout(t); v.play().catch(() => {}); };
    if (document.documentElement.classList.contains("intro-on")) {
      window.addEventListener("intro-done", play, { once: true });
      t = setTimeout(play, 7000);
    } else play();
    const onScroll = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) v.style.transform = `translate3d(0,${y * 0.16}px,0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("intro-done", play); clearTimeout(t); };
  }, []);

  return (
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
  );
}
