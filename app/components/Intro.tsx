"use client";

import { useEffect, useRef, useState } from "react";
import { ICONS } from "./intro-icons";

/* Abertura: o painel de um carro "dá a partida" antes do site aparecer.
   Port da animação "painel-start" (protótipo de motion), comprimida de 7,2 s
   para ~2 s. As cenas originais continuam nos mesmos números (Ignição → Pronto
   → Apagar), em "tempo original"; K converte para segundos reais.
   Desenhada num <canvas> (sem React por quadro) e com resolução adaptativa: se o
   aparelho for lento, a abertura baixa a resolução em vez de travar.
   - só aparece na 1ª visita da sessão (ou com ?intro na URL);
   - toque, clique ou qualquer tecla pulam direto para a saída;
   - não aparece com movimento reduzido nem economia de dados;
   - a classe html.intro-on (definida antes da pintura, no layout) esconde o site
     desde o 1º quadro; se o JS falhar, um fallback em CSS tira a tela em 6 s. */

const K = 0.45; // 1 = velocidade do protótipo (7,2 s); 0,45 ≈ 2 s
const I = 0, P = 3, X = 3.5, END = 4.5; // início, "pronto", começo da saída, fim (tempo original)
const DURATION = END * K;

const C = {
  surface: "#222327", text: "#f7f7f5",
  n300: "#ececea", n400: "#c9c9c6", n500: "#a0a09c", n700: "#5a5a57", n800: "#3b3b39",
  a200: "#fff3c2", a300: "#ffe88a", a400: "#ffd84d", a500: "#f5c21b", a600: "#d9a70c", a700: "#a07a08",
};
// fonte do sistema de propósito: a do site pode ainda não ter carregado e trocaria no meio da animação
const FONT = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const E = {
  outCubic: (t: number) => { t -= 1; return t * t * t + 1; },
  inOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
};
const anim = (s: number, e: number, ease: (t: number) => number) => (t: number) => (t <= s ? 0 : t >= e ? 1 : ease((t - s) / (e - s)));
const enter = (s: number, e: number) => anim(s, e, E.outCubic);
const sweep = (s: number, e: number) => anim(s, e, E.inOutQuart);
function curve(t: number, inp: number[], out: number[]) {
  if (t <= inp[0]) return out[0];
  if (t >= inp[inp.length - 1]) return out[out.length - 1];
  for (let i = 0; i < inp.length - 1; i++) if (t <= inp[i + 1]) return out[i] + (out[i + 1] - out[i]) * E.inOutSine((t - inp[i]) / (inp[i + 1] - inp[i]));
  return out[out.length - 1];
}

const RAD = Math.PI / 180;
const a2r = (a: number) => (a - 90) * RAD; // 0° = 12 horas, horário
const pt = (cx: number, cy: number, r: number, a: number): [number, number] => [cx + r * Math.sin(a * RAD), cy - r * Math.cos(a * RAD)];
const ang = (v: number, max: number) => -120 + 240 * clamp(v / max, 0, 1);

type Layout = { W: number; H: number; d1: [number, number]; d2: [number, number]; panel: { x: number; y: number; w: number; h: number; big: number }; tellY: number; housing: string; edge: [number, number, number, number] };
const LAND: Layout = {
  W: 1920, H: 1080, d1: [480, 540], d2: [1440, 540],
  panel: { x: 790, y: 285, w: 340, h: 510, big: 120 }, tellY: 815,
  housing: "M 480 205 L 1440 205 A 335 335 0 0 1 1440 875 L 480 875 A 335 335 0 0 1 480 205 Z",
  edge: [140, 0, 1780, 0],
};
const PORT: Layout = { // celular em pé: os dois mostradores empilhados
  W: 760, H: 1780, d1: [380, 335], d2: [380, 1445],
  panel: { x: 210, y: 690, w: 340, h: 372, big: 78 }, tellY: 1082,
  housing: "M 45 335 A 335 335 0 0 1 715 335 L 715 1445 A 335 335 0 0 1 45 1445 Z",
  edge: [0, 20, 0, 1760],
};

type Tick = { f: number; major: boolean; hot: boolean; x0: number; y0: number; x1: number; y1: number; lx: number; ly: number; label: string };
type DialDef = { cx: number; cy: number; r: number; max: number; red?: number; unit: string; level: number; lo: string; hi: string; icon: string; ticks: Tick[] };
type Scene = { L: Layout; dials: [DialDef, DialDef]; housing: Path2D; edge: CanvasGradient; fill: [CanvasGradient, CanvasGradient]; glow: [CanvasGradient, CanvasGradient]; panelBg: CanvasGradient; housingLen: number };

const iconCache: Record<string, Path2D> = {};
const icon = (n: string) => (iconCache[n] ??= new Path2D(ICONS[n]));

function makeDial(cx: number, cy: number, r: number, max: number, step: number, sub: number, red: number | undefined, label: (v: number) => string, unit: string, level: number, lo: string, hi: string, ic: string): DialDef {
  const n = Math.round(max / sub), ticks: Tick[] = [];
  for (let i = 0; i <= n; i++) {
    const v = i * sub, major = Math.abs(v / step - Math.round(v / step)) < 1e-6, ta = ang(v, max);
    const [x0, y0] = pt(cx, cy, r - 18, ta), [x1, y1] = pt(cx, cy, r - (major ? 46 : 32), ta), [lx, ly] = pt(cx, cy, r - 80, ta);
    ticks.push({ f: i / n, major, hot: red != null && v >= red, x0, y0, x1, y1, lx, ly, label: major ? label(v) : "" });
  }
  return { cx, cy, r, max, red, unit, level, lo, hi, icon: ic, ticks };
}

function buildScene(ctx: CanvasRenderingContext2D, L: Layout): Scene {
  const rg = (cx: number, cy: number, r: number, stops: [number, string][]) => { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  const edge = ctx.createLinearGradient(...L.edge);
  edge.addColorStop(0, "rgba(90,90,87,0)"); edge.addColorStop(0.15, C.n700); edge.addColorStop(0.5, C.a600); edge.addColorStop(0.85, C.n700); edge.addColorStop(1, "rgba(90,90,87,0)");
  const panelBg = ctx.createLinearGradient(0, 0, 0, L.panel.h); panelBg.addColorStop(0, C.surface); panelBg.addColorStop(1, "#101012");
  const [c1, c2] = [L.d1, L.d2];
  const fill = (c: [number, number]) => rg(c[0], c[1], 300, [[0, C.surface], [1, "#101012"]]);
  const glow = (c: [number, number]) => rg(c[0], c[1], 260, [[0, "rgba(217,167,12,0.55)"], [1, "rgba(217,167,12,0)"]]);
  return {
    L, edge, panelBg, housing: new Path2D(L.housing),
    housingLen: L.W > L.H ? 960 * 2 + 2 * Math.PI * 335 : (L.d2[1] - L.d1[1]) * 2 + 2 * Math.PI * 335,
    fill: [fill(c1), fill(c2)], glow: [glow(c1), glow(c2)],
    dials: [
      makeDial(c1[0], c1[1], 300, 8000, 1000, 250, 6500, (v) => String(v / 1000), "x1000 rpm", 0.62, "R", "C", "gas-pump"),
      makeDial(c2[0], c2[1], 300, 200, 20, 10, undefined, (v) => String(v), "km/h", 0.35, "F", "Q", "thermometer-simple"),
    ],
  };
}

const TELL = ["engine", "battery-warning", "drop", "thermometer-simple", "warning", "headlights"];

function txt(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = "left", weight = 400, spacing = 0) {
  ctx.font = `${weight} ${size}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = align;
  if ("letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = spacing ? `${spacing}px` : "0px";
  ctx.fillText(s, x, y);
}
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function drawIcon(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, size: number, color: string, alpha: number) {
  if (alpha <= 0.005) return;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.scale(size / 1024, size / 1024); ctx.transform(1, 0, 0, -1, 0, 960);
  ctx.fillStyle = color; ctx.fill(icon(name)); ctx.restore();
}

function drawDial(ctx: CanvasRenderingContext2D, d: DialDef, value: number, draw: number, on: number) {
  const { cx, cy, r } = d, a = ang(value, d.max);
  ctx.lineCap = "butt";
  if (draw > 0.001) { ctx.lineWidth = 1.5; ctx.strokeStyle = C.n800; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI / 2, Math.PI / 2 + draw * 2 * Math.PI); ctx.stroke(); }
  ctx.save(); ctx.globalAlpha = on;
  if (d.red != null) { ctx.lineWidth = 8; ctx.strokeStyle = C.a700; ctx.beginPath(); ctx.arc(cx, cy, r - 10, a2r(ang(d.red, d.max)), a2r(120)); ctx.stroke(); }
  ctx.restore();
  for (const t of d.ticks) {
    const vis = enter(t.f * 0.8, t.f * 0.8 + 0.2)(draw);
    if (vis < 0.01) continue;
    ctx.globalAlpha = vis; ctx.lineWidth = t.major ? 3 : 1.5; ctx.strokeStyle = t.hot ? C.a400 : t.major ? C.n300 : C.n700;
    ctx.beginPath(); ctx.moveTo(t.x0, t.y0); ctx.lineTo(t.x1, t.y1); ctx.stroke();
    if (t.major) txt(ctx, t.label, t.lx, t.ly + 9, 27, t.hot ? C.a300 : C.n300, "center", 500);
  }
  ctx.globalAlpha = on;
  if (a + 120 > 0.05) {
    ctx.lineCap = "butt"; ctx.lineWidth = 22; ctx.strokeStyle = C.a600; ctx.globalAlpha = on * 0.25; ctx.beginPath(); ctx.arc(cx, cy, r - 10, a2r(-120), a2r(a)); ctx.stroke();
    ctx.globalAlpha = on; ctx.lineWidth = 5; ctx.strokeStyle = C.a400; ctx.beginPath(); ctx.arc(cx, cy, r - 10, a2r(-120), a2r(a)); ctx.stroke();
  }
  txt(ctx, d.unit, cx, cy + r * 0.36, 20, C.n500, "center", 400, 2);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(a * RAD);
  ctx.fillStyle = C.a300; ctx.beginPath(); ctx.moveTo(-7, 34); ctx.lineTo(-2.5, -r + 36); ctx.lineTo(2.5, -r + 36); ctx.lineTo(7, 34); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.a200; ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(0, -r + 36); ctx.lineTo(2, 0); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.fillStyle = C.surface; ctx.strokeStyle = C.n700; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.a500; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, 7); ctx.fill();
  const ly = cy + r * 0.62; ctx.lineCap = "round"; ctx.lineWidth = 6;
  ctx.strokeStyle = C.n800; ctx.beginPath(); ctx.moveTo(cx - 70, ly); ctx.lineTo(cx + 70, ly); ctx.stroke();
  ctx.strokeStyle = C.n300; ctx.beginPath(); ctx.moveTo(cx - 70, ly); ctx.lineTo(cx - 70 + 140 * d.level, ly); ctx.stroke();
  ctx.lineCap = "butt";
  txt(ctx, d.lo, cx - 70, ly + 34, 18, C.n500, "left");
  txt(ctx, d.hi, cx + 70, ly + 34, 18, C.n500, "right");
  drawIcon(ctx, d.icon, cx - 11, cy + 158, 22, C.n500, 1);
  ctx.globalAlpha = 1;
}

function render(ctx: CanvasRenderingContext2D, sc: Scene, t0: number) {
  const L = sc.L;
  const on = enter(I + 0.3, I + 1.2)(t0) * (1 - enter(X, END - 0.1)(t0));
  const draw = sweep(I, I + 1.4)(t0) * (1 - sweep(X, END - 0.1)(t0));
  const sweepUp = sweep(I + 0.9, I + 1.7)(t0) * (1 - sweep(I + 1.8, I + 2.7)(t0));
  const idle = enter(I + 2.7, P + 0.4)(t0) * (1 - enter(X, X + 0.6)(t0));
  const speed = 200 * sweepUp;
  const rpm = Math.max(8000 * sweepUp, (800 + 60 * Math.sin(t0 * 9)) * idle);
  const ready = enter(P, P + 0.6)(t0) * (1 - enter(X, X + 0.5)(t0));
  const tell = enter(I + 0.5, I + 0.7)(t0) * (1 - enter(I + 2.3, I + 2.6)(t0));
  const zoom = curve(t0, [I, P, X, END], [0.95, 1.02, 1.06, 1.3]);

  ctx.save();
  ctx.translate(L.W / 2, L.H / 2); ctx.scale(zoom, zoom); ctx.translate(-L.W / 2, -L.H / 2);

  // caixa do painel
  ctx.globalAlpha = on; ctx.fillStyle = "#101012"; ctx.fill(sc.housing);
  if (draw > 0.001) {
    ctx.globalAlpha = 1; ctx.lineWidth = 1.5; ctx.strokeStyle = sc.edge;
    ctx.setLineDash([draw * sc.housingLen, sc.housingLen]); ctx.stroke(sc.housing); ctx.setLineDash([]);
  }
  // fundo e brilho dos mostradores
  const [d1, d2] = sc.dials;
  ctx.globalAlpha = on;
  ctx.fillStyle = sc.fill[0]; ctx.beginPath(); ctx.arc(d1.cx, d1.cy, 300, 0, 7); ctx.fill();
  ctx.fillStyle = sc.fill[1]; ctx.beginPath(); ctx.arc(d2.cx, d2.cy, 300, 0, 7); ctx.fill();
  ctx.globalAlpha = on * (0.1 + (0.5 * rpm) / 8000); ctx.fillStyle = sc.glow[0]; ctx.beginPath(); ctx.arc(d1.cx, d1.cy, 260, 0, 7); ctx.fill();
  ctx.globalAlpha = on * (0.1 + (0.5 * speed) / 200); ctx.fillStyle = sc.glow[1]; ctx.beginPath(); ctx.arc(d2.cx, d2.cy, 260, 0, 7); ctx.fill();
  ctx.globalAlpha = 1;
  drawDial(ctx, d1, rpm, draw, on);
  drawDial(ctx, d2, speed, draw, on);

  // tela central
  const p = L.panel, big = p.big;
  if (on > 0.003) {
    ctx.save(); ctx.globalAlpha = on; ctx.translate(p.x, p.y + (1 - on) * 16);
    rr(ctx, 0.5, 0.5, p.w - 1, p.h - 1, 22); ctx.fillStyle = sc.panelBg; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = C.n800; ctx.stroke();
    txt(ctx, "14:32", 24, 38, 20, C.n400, "left"); txt(ctx, "22 °C", p.w - 24, 38, 20, C.n400, "right");
    const gx = (p.w - 226) / 2;
    ["P", "R", "N", "D", "S"].forEach((g, i) => {
      const x = gx + i * 48, sel = g === "P";
      if (sel) { rr(ctx, x + 0.5, 56.5, 33, 33, 6); ctx.lineWidth = 1; ctx.strokeStyle = C.a500; ctx.stroke(); }
      txt(ctx, g, x + 17, 80, 22, sel ? C.a200 : C.n700, "center", 500);
    });
    const by = 106 + big;
    txt(ctx, "0", p.w / 2, by - big * 0.12, big, C.text, "center", 500, -big * 0.04);
    txt(ctx, "km/h", p.w / 2, by + 18, 20, C.n400, "center");
    const sy = by + 30;
    ctx.globalAlpha = on; ctx.strokeStyle = C.n800; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(24, sy + 0.5); ctx.lineTo(p.w - 24, sy + 0.5); ctx.stroke();
    ctx.globalAlpha = on * ready;
    drawIcon(ctx, "car-profile", p.w / 2 - 20, sy + 14, 40, C.a400, 1);
    txt(ctx, "Pronto para partir", p.w / 2, sy + 90 + (1 - ready) * 8, 26, C.text, "center", 500);
    txt(ctx, "PISE NO FREIO E ENGATE", p.w / 2, sy + 118, 17, C.n500, "center", 400, 2.4);
    if (p.h > 400) { ctx.globalAlpha = on; txt(ctx, "ODO 48.213 km", 24, p.h - 22, 16, C.n500, "left"); txt(ctx, "412 km", p.w - 24, p.h - 22, 16, C.n500, "right"); }
    ctx.restore();
  }

  // luzes de alerta
  ctx.globalAlpha = on;
  const tx = (L.W - 330) / 2;
  TELL.forEach((n, i) => drawIcon(ctx, n, tx + i * 60, L.tellY, 30, n === "headlights" ? C.a400 : C.a300, n === "headlights" ? Math.max(tell, enter(I + 2.4, I + 2.8)(t0)) : 0.12 + 0.88 * tell));
  ctx.restore();
  ctx.globalAlpha = 1;
}

export default function Intro() {
  const [done, setDone] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const canvas = cv.current, box = wrap.current;
    if (!root.classList.contains("intro-on") || !canvas || !box) { setDone(true); return; }
    try { sessionStorage.setItem("legit-intro", "1"); } catch { /* ok */ }
    const ctx = canvas.getContext("2d");
    if (!ctx) { root.classList.remove("intro-on"); window.dispatchEvent(new Event("intro-done")); setDone(true); return; }

    // resolução: até 1,5x do aparelho (o painel é fino e escuro, não precisa de mais);
    // se os quadros ficarem lentos, desce em degraus (QUALITY) até fluir
    const QUALITY = [1, 0.75, 0.55, 0.4];
    let qi = 0, scene: Scene | null = null, vw = 0, vh = 0, fitScale = 1;
    const fit = () => {
      vw = window.innerWidth; vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * QUALITY[qi];
      canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
      canvas.style.width = vw + "px"; canvas.style.height = vh + "px";
      const L = vw / vh < 0.9 ? PORT : LAND;
      fitScale = Math.min(vw / L.W, vh / L.H);
      ctx.setTransform(dpr * fitScale, 0, 0, dpr * fitScale, (dpr * (vw - L.W * fitScale)) / 2, (dpr * (vh - L.H * fitScale)) / 2);
      scene = buildScene(ctx, L);
    };
    fit();
    const onResize = () => fit();
    window.addEventListener("resize", onResize);

    const page = document.querySelector(".page");
    page?.setAttribute("inert", "");
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";

    // O tempo avança por quadro com teto de 50 ms: se a página engasga (hidratação,
    // aparelho lento), a animação pausa naquele instante em vez de pular quadros.
    // Enquanto o React hidrata o resto do site a CPU engasga; a tela escura espera
    // 4 quadros seguidos rápidos (no máx. ~1,2 s) e só então a animação começa.
    let T = 0, raf = 0, finished = false, last = 0, ema = 16.7, since = 0, calm = 0, waited = 0, started = false;
    const skip = () => { if (T < X * K) T = X * K; }; // pular: vai direto para o início da saída
    const finish = () => {
      if (finished) return; finished = true;
      root.classList.remove("intro-on");
      root.style.overflow = overflow;
      page?.removeAttribute("inert");
      window.dispatchEvent(new Event("intro-done"));
      setDone(true);
    };
    const loop = (now: number) => {
      const dt = last ? now - last : 16.7;
      last = now;
      if (!started) {
        waited += dt; calm = last && dt <= 22 ? calm + 1 : 0;
        if (calm >= 4 || waited > 1200) { started = true; window.dispatchEvent(new Event("intro-start")); }
        else { raf = requestAnimationFrame(loop); return; }
      }
      T += Math.min(dt, 50) / 1000;
      if (T >= DURATION) { finish(); return; }
      // aparelho lento: desce um degrau de resolução (no máx. 1 a cada 12 quadros)
      ema += (Math.min(dt, 120) - ema) * 0.2; since++;
      if (since > 12 && ema > 24 && qi < QUALITY.length - 1) { qi++; since = 0; fit(); }
      const t = T / K;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.restore();
      if (scene) render(ctx, scene, t);
      box.style.opacity = String(1 - enter(X + 0.2, END)(t));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      if (!finished) { root.style.overflow = overflow; page?.removeAttribute("inert"); }
    };
  }, []);

  if (done) return null;
  return (
    <div ref={wrap} className="intro" aria-hidden="true">
      <canvas ref={cv} className="intro-canvas" />
    </div>
  );
}
