"use client";

import { useEffect, useState } from "react";
import { INSTAGRAM_URL, WORKS, pad2 } from "../config";
import WorkVideo from "./WorkVideo";

const N = WORKS.length;
const wrap = (i: number) => (i + N) % N;
const EXIF_KEYS = ["Lente", "Abertura", "Obtur.", "ISO"];

export default function Works() {
  const [active, setActive] = useState(2);
  const [lb, setLb] = useState<number | null>(null);

  useEffect(() => {
    if (lb === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLb(null);
      if (e.key === "ArrowRight") setLb((i) => (i === null ? i : wrap(i + 1)));
      if (e.key === "ArrowLeft") setLb((i) => (i === null ? i : wrap(i - 1)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lb]);

  const cur = lb === null ? null : WORKS[lb];

  return (
    <>
      <div data-reveal="" className="works-accordion desktop-only">
        {WORKS.map((w, i) => {
          const on = i === active;
          return (
            <article
              key={w.title}
              className={`work${on ? " is-on" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => (on ? setLb(i) : setActive(i))}
            >
              <img className="cover" src={w.img} alt={w.title} style={{ objectPosition: w.pos }} loading="lazy" />
              {w.video && <WorkVideo src={w.video} pos={w.pos} active={on} />}
              <div className="shade work-shade" />
              <div className="work-title work-fade">
                <strong>{w.title}</strong>
                <span>Ver projeto →</span>
              </div>
              <div className="work-num">{pad2(i + 1)}</div>
              <div className="spec work-fade">
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
            </article>
          );
        })}
      </div>

      <div className="works-carousel mobile-only">
        {WORKS.map((w, i) => (
          <article key={w.title} className="work-card" onClick={() => setLb(i)}>
            <img className="cover" src={w.img} alt={w.title} style={{ objectPosition: w.pos }} loading="lazy" />
            <div className="shade" />
            <div className="work-card-text">
              <small>{pad2(i + 1)} · {w.meta} · {w.loc}</small>
              <strong>{w.title}</strong>
            </div>
          </article>
        ))}
      </div>

      <div data-reveal="" className="wrap works-controls">
        <div className="arrows desktop-only">
          <button className="circle-btn" onClick={() => setActive(wrap(active - 1))} aria-label="Projeto anterior">←</button>
          <button className="circle-btn" onClick={() => setActive(wrap(active + 1))} aria-label="Próximo projeto">→</button>
          <span className="counter">{pad2(active + 1)} / {pad2(N)}</span>
        </div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline-link">
          Explorar todos os projetos ↗
        </a>
      </div>

      {cur && lb !== null && (
        <div className="lightbox" onClick={() => setLb(null)} role="dialog" aria-modal="true" aria-label={cur.title}>
          <div className="lb-top">
            <span>{pad2(lb + 1)} / {pad2(N)}</span>
            <button className="pill-btn" onClick={() => setLb(null)}>Fechar ✕</button>
          </div>
          <div className="lb-stage">
            <div className="lb-frame" onClick={(e) => e.stopPropagation()}>
              <img src={cur.img} alt={cur.title} />
              <div className="lb-hud">
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
            <button className="circle-btn" onClick={(e) => { e.stopPropagation(); setLb(wrap(lb - 1)); }} aria-label="Anterior">←</button>
            <div className="lb-caption">
              <strong>{cur.title}</strong>
              <small>{cur.meta}</small>
            </div>
            <button className="circle-btn" onClick={(e) => { e.stopPropagation(); setLb(wrap(lb + 1)); }} aria-label="Próximo">→</button>
          </div>
        </div>
      )}
    </>
  );
}
