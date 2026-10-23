"use client";

import { useEffect } from "react";

// Fade + subida dos elementos [data-reveal] ao entrarem na tela. Os que já
// estão visíveis no carregamento entram em sequência (0.2s + 0.12s cada).
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("js-reveal")) return;
    let cleanup = () => {};
    let armed = false;

    const arm = () => {
      if (armed) return;
      armed = true;
      const show = (el: Element) => el.classList.add("is-in");
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (en.isIntersecting) {
              show(en.target);
              io.unobserve(en.target);
            }
          }),
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );

      let k = 0;
      const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.style.setProperty("--d", `${0.2 + k++ * 0.12}s`);
      });
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => els.forEach((el) => io.observe(el))));

      // Rede de segurança: nada que esteja na tela fica invisível.
      const t = setTimeout(() => {
        els.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) show(el);
        });
      }, 1600);

      cleanup = () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
        io.disconnect();
      };
    };

    arm();
    return () => cleanup();
  }, []);

  return null;
}
