"use client";

import { useEffect, useRef, useState } from "react";
import { withArrow } from "./Arrow";
import { WHATSAPP_URL } from "../config";

const LINKS = [
  ["Projetos", "#vitrine"],
  ["Para quem", "#para-quem"],
  ["Formatos", "#formatos"],
  ["Como funciona", "#processo"],
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobile: trava a rolagem, leva o foco ao 1º link, Esc fecha e devolve o foco ao botão.
  useEffect(() => {
    if (!menuOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); btnRef.current?.focus(); }
    };
    const onResize = () => { if (window.innerWidth >= 1100) setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const cls = ["header", scrolled || menuOpen ? "is-solid" : "", scrolled ? "is-scrolled" : ""].join(" ");

  return (
    <>
      <header className={cls}>
        <div className="wrap header-inner">
          <a href="#top" className="logo" onClick={close}>
            <span>LEGIT</span>
            <span>MEDIA</span>
          </a>
          <nav className="nav" aria-label="Principal">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nav-cta">
              {withArrow("Orçamento ↗")}
              <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
            </a>
          </nav>
          <button ref={btnRef} className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-controls="menu-mobile">
            {menuOpen ? "Fechar" : "Menu"}
          </button>
        </div>
      </header>
      {menuOpen && (
        <nav id="menu-mobile" className="menu-overlay" aria-label="Menu">
          {[...LINKS, ["Contato", "#contato"] as const].map(([label, href], i) => (
            <a key={href} href={href} onClick={close} ref={i === 0 ? firstLink : undefined}>
              <span aria-hidden="true">0{i + 1}</span>
              {label}
            </a>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={close}>
            <span aria-hidden="true">06</span>
            Orçamento <span aria-hidden="true">↗</span>
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
        </nav>
      )}
    </>
  );
}
