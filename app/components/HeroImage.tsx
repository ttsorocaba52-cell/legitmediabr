"use client";

import { useEffect, useRef } from "react";

// Foto do hero com parallax leve (scrollY × 0.16), desligado em movimento reduzido.
export default function HeroImage() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (ref.current && y < window.innerHeight * 1.2) {
        ref.current.style.transform = `translate3d(0,${y * 0.16}px,0)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <img
      ref={ref}
      className="hero-img"
      src="/assets/hero-sunset.webp"
      alt="Carro em movimento ao pôr do sol"
      fetchPriority="high"
    />
  );
}
