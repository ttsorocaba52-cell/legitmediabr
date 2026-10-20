"use client";

import { useEffect, useRef } from "react";

// Vídeo do hero (mudo, em loop) com parallax leve (scrollY × 0.16). Com
// movimento reduzido não há parallax nem autoplay: fica só o poster.
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
    const onScroll = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) v.style.transform = `translate3d(0,${y * 0.16}px,0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <video
      ref={ref}
      className="hero-img"
      poster="/assets/hero-poster.webp"
      muted
      loop
      playsInline
      preload="auto"
      aria-label="Golf amarelo em um posto à noite"
    >
      <source src="/assets/hero-720.webm" type="video/webm" media="(max-width: 759px)" />
      <source src="/assets/hero-720.mp4" type="video/mp4" media="(max-width: 759px)" />
      <source src="/assets/hero.webm" type="video/webm" />
      <source src="/assets/hero.mp4" type="video/mp4" />
    </video>
  );
}
