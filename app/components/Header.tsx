"use client";

import { useEffect, useState } from "react";

const LINKS = [
  ["Projetos", "#vitrine"],
  ["Para quem", "#para-quem"],
  ["Formatos", "#formatos"],
  ["Como funciona", "#processo"],
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <nav className="nav">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
            <a href="#contato" className="nav-cta">Orçamento ↗</a>
          </nav>
          <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
            {menuOpen ? "Fechar" : "Menu"}
          </button>
        </div>
      </header>
      {menuOpen && (
        <div className="menu-overlay">
          {[...LINKS, ["Contato", "#contato"] as const].map(([label, href], i) => (
            <a key={href} href={href} onClick={close}>
              <span>0{i + 1}</span>
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
