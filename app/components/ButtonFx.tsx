"use client";

import { useEffect } from "react";

/* Burnout nos botões — port da animação "Botão Like Burnout" do protótipo.
   Ao passar o mouse (ou focar pelo teclado, ou tocar), a seta do botão cede
   lugar a uma roda: ela afunda e se preenche, gira no lugar deixando um risco
   de borracha com brilho de calor, solta fumaça para trás e treme; depois dá
   um tranco, para, o risco encolhe e a seta volta. Tudo desenhado num canvas
   sobre o botão (só existe enquanto anima). */

const SEL = ".btn, .nav-cta";
const SPOKE = (2 * Math.PI) / 5;

// Cenas (s), baseadas no protótipo e comprimidas para um hover: Press → Burnout → Settle → Reset → End
const CUE = { Press: 0, Burnout: 0.3, Settle: 1.35, Reset: 1.95, End: 2.65 };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (T: number, a: number, b: number) => clamp((T - a) / (b - a), 0, 1);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeBack = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const rnd = (i: number, k: number) => { const s = Math.sin(i * 91.7 + k * 271.3) * 43758.5453; return s - Math.floor(s); };

// ângulo da roda: pequeno recuo ao pressionar, arrancada com rampa, giro constante, frenagem e acomodação num raio
function wheelAngle(T: number) {
  const c = CUE, w = 34, ramp = 0.3, B = c.Settle - c.Burnout, dec = 0.6;
  const angB = (u: number) => (u < ramp ? 0.5 * (w / ramp) * u * u : 0.5 * w * ramp + w * (u - ramp));
  const pre = -0.35 * Math.sin(Math.PI * seg(T, c.Press, c.Burnout));
  if (T < c.Burnout) return pre;
  if (T < c.Settle) return angB(T - c.Burnout);
  const A = angB(B);
  const v = Math.min(T - c.Settle, dec);
  const stop = A + w * v - 0.5 * (w / dec) * v * v;
  if (T < c.Reset) return stop;
  const target = Math.ceil(stop / SPOKE) * SPOKE;
  return stop + (target - stop) * easeInOut(seg(T, c.Reset, c.Reset + 0.5));
}

type Puff = { t: number; vx: number; vy: number; r: number; life: number; dy: number };
function buildSmoke(): Puff[] {
  const out: Puff[] = []; let i = 0;
  for (let t = CUE.Burnout + 0.1; t < CUE.Settle - 0.05; t += 0.035, i++) {
    out.push({ t, vx: -(260 + rnd(i, 1) * 380), vy: -(60 + rnd(i, 2) * 140), r: 12 + rnd(i, 3) * 16, life: 0.55 + rnd(i, 4) * 0.4, dy: rnd(i, 5) * 16 });
  }
  return out;
}
const PUFFS = buildSmoke();

type Pal = { icon: string; surface: string; smoke: string; smokeLine: string; trail: string; trailHi: string; glow: string };
// botão claro (primário, ou secundário já preenchido): roda escura, fumaça clara com contorno, risco dourado
const PAL: Pal = { icon: "#090909", surface: "#F2F2F0", smoke: "#E9E8E4", smokeLine: "#8a8d93", trail: "#C99A2E", trailHi: "#E3B84F", glow: "201,154,46" };

function drawWheel(ctx: CanvasRenderingContext2D, ang: number, fill: number, pop: number, shake: number) {
  const R = 46;
  ctx.save();
  ctx.translate(shake, -Math.abs(shake) * 0.5);
  const sc = 1 + 0.22 * pop; ctx.scale(sc, sc);
  ctx.globalAlpha *= fill; ctx.fillStyle = PAL.icon; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); ctx.globalAlpha /= (fill || 1);
  ctx.lineWidth = 8; ctx.strokeStyle = PAL.icon; ctx.beginPath(); ctx.arc(0, 0, R - 4, 0, 7); ctx.stroke();
  ctx.rotate(ang);
  if (fill > 0.5) { ctx.fillStyle = PAL.surface; ctx.beginPath(); ctx.arc(0, 0, R - 16, 0, 7); ctx.fill(); }
  else { ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, R - 16, 0, 7); ctx.stroke(); }
  ctx.lineWidth = 9; ctx.lineCap = "round";
  for (let i = 0; i < 5; i++) { ctx.save(); ctx.rotate(i * 1.2566370614); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -(R - 16)); ctx.stroke(); ctx.restore(); }
  ctx.fillStyle = fill > 0.5 ? PAL.surface : PAL.icon; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function frame(ctx: CanvasRenderingContext2D, T: number, cx: number, cy: number, r: number, W: number, H: number) {
  ctx.clearRect(0, 0, W, H);
  const c = CUE, s = r / 46, ks = s * 1.5;
  const burning = T > c.Burnout && T < c.Settle;
  const intensity = burning ? easeOut(seg(T, c.Burnout, c.Burnout + 0.4)) : 0;
  const shake = burning ? (Math.sin(T * 83) * 3 + Math.sin(T * 47) * 2) * intensity : 0;
  const lurch = Math.sin(Math.PI * seg(T, c.Settle, c.Settle + 0.35)) * 16;
  const fill = clamp(seg(T, c.Press + 0.12, c.Press + 0.2) - seg(T, c.Reset + 0.2, c.Reset + 0.5), 0, 1);
  const pop = Math.sin(Math.PI * seg(T, c.Press + 0.12, c.Burnout + 0.2)) * 0.8;
  const trailGrow = easeOut(seg(T, c.Burnout + 0.05, c.Settle));
  const trailShrink = easeOut(seg(T, c.Settle, c.Settle + 0.5));
  const trailLen = (230 * trailGrow - 150 * trailShrink) * 1.4;
  const trailOp = 1 - easeInOut(seg(T, c.Reset, c.Reset + 0.5));
  const heat = intensity * (1 - trailShrink);
  const wheelA = seg(T, 0, 0.1) * (1 - seg(T, c.Reset + 0.45, c.End));

  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  ctx.globalAlpha = wheelA;
  // brilho de calor sob a roda
  if (heat > 0.01) {
    ctx.save(); ctx.translate(0, 50); ctx.scale(150, 60);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, `rgba(${PAL.glow},0.55)`); g.addColorStop(1, `rgba(${PAL.glow},0)`);
    ctx.globalAlpha = wheelA * heat; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1, 0, 7); ctx.fill(); ctx.restore();
  }
  // risco de borracha
  if (trailLen > 1) {
    const g = ctx.createLinearGradient(lurch - trailLen, 0, lurch, 0);
    g.addColorStop(0, PAL.trail + "00"); g.addColorStop(0.45, PAL.trail); g.addColorStop(1, PAL.trailHi);
    ctx.globalAlpha = wheelA * trailOp; ctx.fillStyle = g;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(lurch - trailLen, 22, trailLen, 28, 14);
    else ctx.rect(lurch - trailLen, 22, trailLen, 28);
    ctx.fill();
  }
  ctx.globalAlpha = wheelA;
  ctx.save(); ctx.translate(lurch, 0); drawWheel(ctx, wheelAngle(T), fill, pop, shake); ctx.restore();
  ctx.restore();

  // fumaça (um pouco maior que a escala da roda, para aparecer num botão pequeno)
  ctx.save(); ctx.translate(cx, cy); ctx.scale(ks, ks);
  const live: { x: number; y: number; r: number }[] = [];
  for (const p of PUFFS) {
    const a = T - p.t; if (a < 0 || a > p.life) continue;
    const k = a / p.life, tau = (1 - Math.exp(-3 * a)) / 3;
    const rr = p.r * (0.3 + 0.7 * easeBack(clamp(k / 0.25, 0, 1))) * (1 + k * 0.6) * (k > 0.55 ? 1 - easeOut((k - 0.55) / 0.45) : 1);
    if (rr > 0.5) live.push({ x: -20 + p.vx * tau * 0.8, y: 34 + p.dy + p.vy * tau * 0.8, r: rr });
  }
  ctx.globalAlpha = wheelA;
  ctx.fillStyle = PAL.smokeLine; for (const p of live) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 4, 0, 7); ctx.fill(); }
  ctx.fillStyle = PAL.smoke; for (const p of live) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
  ctx.restore();
  return shake;
}

function burn(el: HTMLElement) {
  if (el.classList.contains("is-burning")) return;
  const rect = el.getBoundingClientRect();
  if (!rect.width) return;
  const W = rect.width, H = rect.height;
  let cv = el.querySelector<HTMLCanvasElement>(":scope > .fx-burn");
  if (!cv) { cv = document.createElement("canvas"); cv.className = "fx-burn"; cv.setAttribute("aria-hidden", "true"); el.appendChild(cv); }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const ctx = cv.getContext("2d"); if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // a roda toma o lugar da seta; sem seta, fica no canto direito
  const arrow = el.querySelector(".fx-arrow");
  let cx = W - 17, cy = H / 2;
  if (arrow) { const a = arrow.getBoundingClientRect(); cx = a.left + a.width / 2 - rect.left; cy = a.top + a.height / 2 - rect.top; }
  const r = clamp(H * (arrow ? 0.21 : 0.18), 8, 12.5);
  // botões com preenchimento (secundário e CTA do menu): espera o preenchimento chegar ao canto direito
  const delay = el.matches(".btn-secondary, .nav-cta") ? 0.32 : 0;

  el.classList.add("is-burning");
  const t0 = performance.now();
  const loop = (now: number) => {
    const T = (now - t0) / 1000 - delay;
    if (T >= CUE.End) {
      ctx.clearRect(0, 0, W, H); el.style.translate = ""; el.classList.remove("is-burning"); return;
    }
    if (T >= 0) {
      const sh = frame(ctx, T, cx, cy, r, W, H);
      el.style.translate = sh ? `${(sh * 0.22).toFixed(2)}px ${(Math.cos(T * 61) * Math.abs(sh) * 0.12).toFixed(2)}px` : "";
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

export default function ButtonFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element).closest<HTMLElement>(SEL);
      if (el && !el.contains(e.relatedTarget as Node | null)) burn(el);
    };
    const onFocus = (e: FocusEvent) => {
      const t = e.target as Element;
      if (t.matches?.(":focus-visible")) { const el = t.closest<HTMLElement>(SEL); if (el) burn(el); }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") { const el = (e.target as Element).closest<HTMLElement>(SEL); if (el) burn(el); }
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
