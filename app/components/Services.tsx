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
            className={`svc${i === active ? " is-on" : ""}`}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <img className="cover" src={s.img} alt={s.title} loading="lazy" />
            <div className="shade" />
            <span className="svc-n">0{i + 1}</span>
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
            <img className="cover" src={s.img} alt={s.title} loading="lazy" />
            <div className="shade" />
            <div className="svc-card-body">
              <span className="num accent">0{i + 1}</span>
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
