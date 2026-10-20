"use client";

import { useEffect, useRef, useState } from "react";

// Pré-visualização em vídeo de um projeto: toca por cima da foto enquanto o
// painel está aberto e na tela; ao fechar, pausa e volta ao início. O vídeo só
// é baixado na primeira vez que o painel abre (preload="none").
export default function WorkVideo({ src, pos, active }: { src: string; pos: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (active && inView && !reduced) {
      v.play().catch(() => {});
    } else {
      v.pause();
      if (!active) {
        v.currentTime = 0;
        setPlaying(false);
      }
    }
  }, [active, inView]);

  return (
    <video
      ref={ref}
      className={`work-video${playing && active ? " is-playing" : ""}`}
      style={{ objectPosition: pos }}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
    >
      <source src={`${src}.webm`} type="video/webm" />
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  );
}
