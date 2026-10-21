"use client";

import { useEffect } from "react";

const SEL = ".btn, .nav-cta";

// A roda dá a volta inteira mesmo que o mouse saia antes do fim: a classe
// is-rolling entra no hover/foco/toque e sai quando a animação termina.
export default function ButtonFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const roll = (el: Element | null) => {
      if (!el || el.classList.contains("is-rolling")) return;
      el.classList.add("is-rolling");
      const done = (e: Event) => {
        if ((e as AnimationEvent).animationName !== "wheel-roll") return;
        el.classList.remove("is-rolling");
        el.removeEventListener("animationend", done);
      };
      el.addEventListener("animationend", done);
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element).closest(SEL);
      if (el && !el.contains(e.relatedTarget as Node | null)) roll(el);
    };
    const onFocus = (e: FocusEvent) => {
      const t = e.target as Element;
      if (t.matches?.(":focus-visible")) roll(t.closest(SEL));
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") roll((e.target as Element).closest(SEL));
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return null;
}
