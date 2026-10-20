"use client";

import { useEffect, useRef, useState } from "react";
import { INSTAGRAM_URL, WORKS, pad2 } from "../config";
import Arrow, { withArrow } from "./Arrow";
import WorkVideo from "./WorkVideo";

const N = WORKS.length;
const wrap = (i: number) => (i + N) % N;
const EXIF_KEYS = ["Lente", "Abertura", "Obtur.", "ISO"];

// Enter e Espaço ativam elementos que não são <button> (role="button").
const onActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

export default function Works() {
  const [active, setActive] = useState(2);
  const [lb, setLb] = useState<number | null>(null);
  const [snap, setSnap] = useState(0); // cartão do carrossel (celular) que está no centro
  const carousel = useRef<HTMLDivElement>(null);

  // O cartão mais visível (≥ 55%) é o "ativo": toca o vídeo e os outros param.
  useEffect(() => {
    const el = carousel.current;
    if (!el) return;
    const ratios = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
        let best = -1, bestRatio = 0.55;
        Array.from(el.children).forEach((c, i) => {
          const r = ratios.get(c) ?? 0;
          if (r >= bestRatio) { best = i; bestRatio = r; }
        });
        if (best >= 0) setSnap(best);
      },
      { root: null, threshold: [0, 0.25, 0.55, 0.75, 1] },
    );
    Array.from(el.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Desktop e tablet: acordeão. Mouse abre ao passar; teclado abre ao focar;
          toque: 1º toque abre, 2º toque amplia (por isso só o mouse usa pointerenter). */}
      <div data-reveal="" className="works-accordion desktop-only" role="group" aria-label="Projetos selecionados">
        {WORKS.map((w, i) => {
          const on = i === active;
          const open = () => (on ? setLb(i) : setActive(i));
          return (
            <div
              key={w.title}
              role="button"
              tabIndex={0}
              aria-expanded={on}
              className={`work${on ? " is-on" : ""}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={(e) => e.currentTarget.matches(":focus-visible") && setActive(i)}
              onClick={open}
              onKeyDown={onActivate(open)}
            >
              <img className="cover" src={w.img} alt="" style={{ objectPosition: w.pos }} loading="lazy" />
              {w.video && <WorkVideo src={w.video} pos={w.pos} active={on} />}
              <div className="shade work-shade" />
              <div className="work-title work-fade">
                <strong>{w.title}</strong>
                <span className="sr-only">, {w.car}, {w.loc}.</span>
                <span>Ver projeto <i aria-hidden="true">→</i></span>
              </div>
              <div className="work-num" aria-hidden="true">{pad2(i + 1)}</div>
              <div className="spec work-fade" aria-hidden="true">
                <div className="spec-head">
                  <span>Ficha {pad2(i + 1)}</span>
                  <i />
                </div>
                <dl>
                  <dt>Carro</dt><dd>{w.car}</dd>
                  <dt>Local</dt><dd>{w.loc}</dd>
                  <dt>Captura</dt><dd>{w.meta}</dd>
                </dl>
              </div>
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner br" />
            </div>
          );
        })}
      </div>

      {/* Celular: carrossel com rolagem por toque; os cartões também recebem foco. */}
      <div ref={carousel} className="works-carousel mobile-only" role="group" aria-label="Projetos selecionados">
        {WORKS.map((w, i) => (
          <div
            key={w.title}
            role="button"
            tabIndex={0}
            className="work-card"
            onClick={() => setLb(i)}
            onKeyDown={onActivate(() => setLb(i))}
          >
            <img className="cover" src={w.img} alt="" style={{ objectPosition: w.pos }} loading="lazy" />
            {w.video && <WorkVideo src={w.video} pos={w.pos} active={snap === i} />}
            <div className="shade" />
            <div className="work-card-text">
              <strong>{w.title}</strong>
              <small>{pad2(i + 1)} · {w.meta} · {w.loc}</small>
            </div>
          </div>
        ))}
      </div>

      <div data-reveal="" className="wrap works-controls">
        <div className="arrows desktop-only">
          <button className="circle-btn" onClick={() => setActive(wrap(active - 1))} aria-label="Projeto anterior"><Arrow glyph="←" /></button>
          <button className="circle-btn" onClick={() => setActive(wrap(active + 1))} aria-label="Próximo projeto"><Arrow glyph="→" /></button>
          <span className="counter" aria-live="polite">{pad2(active + 1)} / {pad2(N)}</span>
        </div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline-link">
          {withArrow("Explorar todos os projetos ↗")}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>

      {lb !== null && <Lightbox index={lb} onIndex={setLb} onClose={() => setLb(null)} />}
    </>
  );
}

// "Modo foto": foco vai para o botão Fechar, Tab fica preso no diálogo, Esc
// fecha, ←/→ navegam e o foco volta para o painel de origem ao fechar.
function Lightbox({ index, onIndex, onClose }: { index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cur = WORKS[index];

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex(wrap(index + 1));
      else if (e.key === "ArrowLeft") onIndex(wrap(index - 1));
      else if (e.key === "Tab" && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>("button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onIndex, onClose]);

  return (
    <div ref={ref} className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${cur.title}, ${cur.car}, ${cur.loc}`}>
      <div className="lb-top">
        <span aria-live="polite">{pad2(index + 1)} / {pad2(N)}</span>
        <button ref={closeRef} className="pill-btn" onClick={onClose}>Fechar <span aria-hidden="true">✕</span></button>
      </div>
      <div className="lb-stage">
        <div className="lb-frame" onClick={(e) => e.stopPropagation()}>
          <img src={cur.img} alt={`${cur.title}: ${cur.car}, ${cur.loc}`} />
          <div className="lb-hud" aria-hidden="true">
            <span className="third v1" />
            <span className="third v2" />
            <span className="third h1" />
            <span className="third h2" />
            <span className="lb-center" />
            <span className="lb-corner tl" />
            <span className="lb-corner tr" />
            <span className="lb-corner bl" />
            <span className="lb-corner br" />
            <div className="lb-tag left"><i />Modo foto</div>
            <div className="lb-tag right">{cur.car} · {cur.loc}</div>
            <div className="lb-exif">
              {EXIF_KEYS.map((k, j) => (
                <span key={k}><em>{k}</em>{cur.exif[j]}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="lb-bottom">
        <button className="circle-btn" onClick={(e) => { e.stopPropagation(); onIndex(wrap(index - 1)); }} aria-label="Projeto anterior"><Arrow glyph="←" /></button>
        <div className="lb-caption">
          <strong>{cur.title}</strong>
          <small>{cur.meta}</small>
        </div>
        <button className="circle-btn" onClick={(e) => { e.stopPropagation(); onIndex(wrap(index + 1)); }} aria-label="Próximo projeto"><Arrow glyph="→" /></button>
      </div>
    </div>
  );
}
