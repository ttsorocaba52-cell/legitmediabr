"use client";

import { useState } from "react";
import { SERVICES } from "../config";

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <>
      <div data-reveal="" className="svc-accordion">
        {SERVICES.map((s, i) => (
          <article
            key={s.title}
            tabIndex={0}
            aria-label={s.title}
            className={`svc${i === active ? " is-on" : ""}`}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            onFocus={(e) => e.currentTarget.matches(":focus-visible") && setActive(i)}
            onClick={() => setActive(i)}
          >
            <img className="cover" src={s.img} alt="" style={s.pos ? { objectPosition: s.pos } : undefined} loading="lazy" />
            <div className="shade" />
            <span className="svc-n" aria-hidden="true">0{i + 1}</span>
            <div className="svc-body">
              <span className="svc-title">{s.title}</span>
              <p className="svc-desc">{s.desc}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="wrap cards3 svc-grid">
        {SERVICES.map((s, i) => (
          <article key={s.title} className="svc-card">
            <img className="cover" src={s.img} alt="" style={s.pos ? { objectPosition: s.pos } : undefined} loading="lazy" />
            <div className="shade" />
            <div className="svc-card-body">
              <span className="num accent" aria-hidden="true">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
