"use client";

import { useEffect, useRef, useState } from "react";
import { ICONS } from "./intro-icons";

/* Abertura: o painel de um carro "dá a partida" antes do site aparecer.
   Port da animação "painel-start" (protótipo de motion), comprimida de 7,2 s
   para ~2 s. As cenas originais continuam nos mesmos números (Ignição → Pronto
   → Apagar), em "tempo original"; K converte para segundos reais.
   - só aparece na 1ª visita da sessão (ou com ?intro na URL);
   - toque, clique ou qualquer tecla pulam direto para a saída;
   - não aparece com movimento reduzido nem economia de dados;
   - a classe html.intro-on (definida antes da pintura, no layout) esconde o site
     desde o 1º quadro; se o JS falhar, um fallback em CSS tira a tela em 6 s. */

const K = 0.45; // 1 = velocidade do protótipo (7,2 s); 0,45 ≈ 2 s
const I = 0, P = 3, X = 3.5, END = 4.5; // início, "pronto", começo da saída, fim (tempo original)
const DURATION = END * K;

const C = {
  bg: "#16171a", surface: "#222327", text: "#f7f7f5",
  n300: "#ececea", n400: "#c9c9c6", n500: "#a0a09c", n700: "#5a5a57", n800: "#3b3b39",
  a200: "#fff3c2", a300: "#ffe88a", a400: "#ffd84d", a500: "#f5c21b", a600: "#d9a70c", a700: "#a07a08",
};
const FONT = '"Bricolage Grotesque", system-ui, sans-serif';

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

const pt = (cx: number, cy: number, r: number, a: number): [number, number] => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
const ang = (v: number, max: number) => -120 + 240 * clamp(v / max, 0, 1);
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  if (a1 - a0 < 0.05) return "";
  const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
}

type Layout = { W: number; H: number; d1: [number, number]; d2: [number, number]; panel: { x: number; y: number; w: number; h: number; big: number }; tellY: number; housing: string; edge: { x1: number; y1: number; x2: number; y2: number } };
const LAND: Layout = {
  W: 1920, H: 1080, d1: [480, 540], d2: [1440, 540],
  panel: { x: 790, y: 285, w: 340, h: 510, big: 120 }, tellY: 815,
  housing: "M 480 205 L 1440 205 A 335 335 0 0 1 1440 875 L 480 875 A 335 335 0 0 1 480 205 Z",
  edge: { x1: 140, y1: 0, x2: 1780, y2: 0 },
};
const PORT: Layout = { // celular em pé: os dois mostradores empilhados
  W: 760, H: 1700, d1: [380, 335], d2: [380, 1365],
  panel: { x: 210, y: 690, w: 340, h: 300, big: 78 }, tellY: 1024,
  housing: "M 45 335 A 335 335 0 0 1 715 335 L 715 1365 A 335 335 0 0 1 45 1365 Z",
  edge: { x1: 0, y1: 20, x2: 0, y2: 1680 },
};

function Icon({ name, size, color, opacity = 1 }: { name: string; size: number; color: string; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" style={{ opacity, display: "block" }} aria-hidden="true">
      <path transform="matrix(1 0 0 -1 0 960)" d={ICONS[name]} fill={color} />
    </svg>
  );
}

type DialProps = { cx: number; cy: number; r: number; max: number; step: number; sub: number; label: (v: number) => string | number; value: number; draw: number; on: number; red?: number; unit: string; level: number; lo: string; hi: string; icon: string };
function Dial({ cx, cy, r, max, step, sub, label, value, draw, on, red, unit, level, lo, hi, icon }: DialProps) {
  const n = Math.round(max / sub), a = ang(value, max), ticks = [];
  for (let i = 0; i <= n; i++) {
    const v = i * sub, major = Math.abs(v / step - Math.round(v / step)) < 1e-6, ta = ang(v, max);
    const vis = enter((i / n) * 0.8, (i / n) * 0.8 + 0.2)(draw);
    const [x0, y0] = pt(cx, cy, r - 18, ta), [x1, y1] = pt(cx, cy, r - (major ? 46 : 32), ta), [lx, ly] = pt(cx, cy, r - 80, ta);
    const hot = red != null && v >= red;
    ticks.push(
      <g key={i} opacity={vis}>
        <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={hot ? C.a400 : major ? C.n300 : C.n700} strokeWidth={major ? 3 : 1.5} />
        {major && <text x={lx} y={ly + 9} textAnchor="middle" fontFamily={FONT} fontSize="27" fontWeight="500" fill={hot ? C.a300 : C.n300}>{label(v)}</text>}
      </g>,
    );
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.n800} strokeWidth="1.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} transform={`rotate(90 ${cx} ${cy})`} />
      {red != null && <path d={arc(cx, cy, r - 10, ang(red, max), 120)} stroke={C.a700} strokeWidth="8" fill="none" opacity={on} />}
      {ticks}
      <g opacity={on}>
        <path d={arc(cx, cy, r - 10, -120, a)} stroke={C.a600} strokeWidth="22" fill="none" opacity="0.25" />
        <path d={arc(cx, cy, r - 10, -120, a)} stroke={C.a400} strokeWidth="5" fill="none" />
        <text x={cx} y={cy + r * 0.36} textAnchor="middle" fontFamily={FONT} fontSize="20" letterSpacing="2" fill={C.n500}>{unit}</text>
        <g transform={`rotate(${a} ${cx} ${cy})`}>
          <path d={`M ${cx - 7} ${cy + 34} L ${cx - 2.5} ${cy - r + 36} L ${cx + 2.5} ${cy - r + 36} L ${cx + 7} ${cy + 34} Z`} fill={C.a300} />
          <path d={`M ${cx - 2} ${cy} L ${cx} ${cy - r + 36} L ${cx + 2} ${cy} Z`} fill={C.a200} />
        </g>
        <circle cx={cx} cy={cy} r="30" fill={C.surface} stroke={C.n700} strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="8" fill={C.a500} />
        <line x1={cx - 70} x2={cx + 70} y1={cy + r * 0.62} y2={cy + r * 0.62} stroke={C.n800} strokeWidth="6" strokeLinecap="round" />
        <line x1={cx - 70} x2={cx - 70 + 140 * level} y1={cy + r * 0.62} y2={cy + r * 0.62} stroke={C.n300} strokeWidth="6" strokeLinecap="round" />
        <text x={cx - 70} y={cy + r * 0.62 + 34} fontFamily={FONT} fontSize="18" fill={C.n500}>{lo}</text>
        <text x={cx + 70} y={cy + r * 0.62 + 34} textAnchor="end" fontFamily={FONT} fontSize="18" fill={C.n500}>{hi}</text>
      </g>
      <svg x={cx - 11} y={cy + 158} width="22" height="22" viewBox="0 0 1024 1024" opacity={on}>
        <path transform="matrix(1 0 0 -1 0 960)" d={ICONS[icon]} fill={C.n500} />
      </svg>
    </g>
  );
}

const TELL = ["engine", "battery-warning", "drop", "thermometer-simple", "warning", "headlights"];

function Cluster({ t0, L, bigOverride }: { t0: number; L: Layout; bigOverride?: number }) {
  const on = enter(I + 0.3, I + 1.2)(t0) * (1 - enter(X, END - 0.1)(t0));
  const draw = sweep(I, I + 1.4)(t0) * (1 - sweep(X, END - 0.1)(t0));
  const sweepUp = sweep(I + 0.9, I + 1.7)(t0) * (1 - sweep(I + 1.8, I + 2.7)(t0));
  const idle = enter(I + 2.7, P + 0.4)(t0) * (1 - enter(X, X + 0.6)(t0));
  const speed = 200 * sweepUp;
  const rpm = Math.max(8000 * sweepUp, (800 + 60 * Math.sin(t0 * 9)) * idle);
  const ready = enter(P, P + 0.6)(t0) * (1 - enter(X, X + 0.5)(t0));
  const tell = enter(I + 0.5, I + 0.7)(t0) * (1 - enter(I + 2.3, I + 2.6)(t0));
  const zoom = curve(t0, [I, P, X, END], [0.95, 1.02, 1.06, 1.3]);
  const small = { fontSize: 17, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.n500 };
  const [x1, y1] = [L.edge.x1, L.edge.y1], [x2, y2] = [L.edge.x2, L.edge.y2];
  const p = L.panel, big = bigOverride ?? p.big;
  const tellW = 6 * 30 + 5 * 30;

  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: `${L.W / 2}px ${L.H / 2}px` }}>
      <svg width={L.W} height={L.H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="iEdge" x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.n700} stopOpacity="0" /><stop offset="0.15" stopColor={C.n700} />
            <stop offset="0.5" stopColor={C.a600} /><stop offset="0.85" stopColor={C.n700} /><stop offset="1" stopColor={C.n700} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="iDialFill"><stop offset="0" stopColor={C.surface} /><stop offset="1" stopColor="#101012" /></radialGradient>
          <radialGradient id="iDialGlow"><stop offset="0" stopColor={C.a600} stopOpacity="0.55" /><stop offset="1" stopColor={C.a600} stopOpacity="0" /></radialGradient>
        </defs>
        <path d={L.housing} fill="#101012" opacity={on} />
        <path d={L.housing} fill="none" stroke="url(#iEdge)" strokeWidth="1.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
        <circle cx={L.d1[0]} cy={L.d1[1]} r="300" fill="url(#iDialFill)" opacity={on} />
        <circle cx={L.d2[0]} cy={L.d2[1]} r="300" fill="url(#iDialFill)" opacity={on} />
        <circle cx={L.d1[0]} cy={L.d1[1]} r="260" fill="url(#iDialGlow)" opacity={on * (0.1 + (0.5 * rpm) / 8000)} />
        <circle cx={L.d2[0]} cy={L.d2[1]} r="260" fill="url(#iDialGlow)" opacity={on * (0.1 + (0.5 * speed) / 200)} />
        <Dial cx={L.d1[0]} cy={L.d1[1]} r={300} max={8000} step={1000} sub={250} red={6500} label={(v) => v / 1000} value={rpm} draw={draw} on={on} unit="x1000 rpm" level={0.62} lo="R" hi="C" icon="gas-pump" />
        <Dial cx={L.d2[0]} cy={L.d2[1]} r={300} max={200} step={20} sub={10} label={(v) => v} value={speed} draw={draw} on={on} unit="km/h" level={0.35} lo="F" hi="Q" icon="thermometer-simple" />
      </svg>

      <div style={{ position: "absolute", left: p.x, top: p.y, width: p.w, height: p.h, boxSizing: "border-box", borderRadius: 22, border: `1px solid ${C.n800}`, background: `linear-gradient(180deg, ${C.surface}, #101012)`, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12, opacity: on, transform: `translateY(${(1 - on) * 16}px)`, fontFamily: FONT, color: C.text }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: C.n400, fontVariantNumeric: "tabular-nums" }}><span>14:32</span><span>22 °C</span></div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, fontSize: 22, fontWeight: 500 }}>
          {["P", "R", "N", "D", "S"].map((g) => (
            <span key={g} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, color: g === "P" ? C.a200 : C.n700, border: `1px solid ${g === "P" ? C.a500 : "transparent"}` }}>{g}</span>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 4 }}>
          <div style={{ fontSize: big, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>0</div>
          <div style={{ fontSize: 20, color: C.n400 }}>km/h</div>
        </div>
        <div style={{ flex: 1, borderTop: `1px solid ${C.n800}`, paddingTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Icon name="car-profile" size={40} color={C.a400} opacity={ready} />
          <div style={{ fontSize: 26, fontWeight: 500, color: C.text, opacity: ready, transform: `translateY(${(1 - ready) * 8}px)` }}>Pronto para partir</div>
          <div style={{ ...small, opacity: ready }}>Pise no freio e engate</div>
        </div>
        {p.h > 400 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: C.n500, fontVariantNumeric: "tabular-nums" }}><span>ODO 48.213 km</span><span>412 km</span></div>}
      </div>

      <div style={{ position: "absolute", left: (L.W - tellW) / 2, top: L.tellY, width: tellW, display: "flex", justifyContent: "space-between", opacity: on }}>
        {TELL.map((n) => (
          <Icon key={n} name={n} size={30} color={n === "headlights" ? C.a400 : C.a300} opacity={n === "headlights" ? Math.max(tell, enter(I + 2.4, I + 2.8)(t0)) : 0.12 + 0.88 * tell} />
        ))}
      </div>
    </div>
  );
}

export default function Intro() {
  const [t0, setT0] = useState(0);          // tempo original (7,2 s = protótipo)
  const [L, setL] = useState<Layout>(LAND);
  const [scale, setScale] = useState(0.5);
  const [alpha, setAlpha] = useState(1);
  const [done, setDone] = useState(false);
  const shift = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("intro-on")) { setDone(true); return; }
    try { sessionStorage.setItem("legit-intro", "1"); } catch { /* ok */ }

    const fit = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const l = w / h < 0.9 ? PORT : LAND;
      setL(l); setScale(Math.min(w / l.W, h / l.H));
    };
    fit();
    window.addEventListener("resize", fit);

    const page = document.querySelector(".page");
    page?.setAttribute("inert", "");
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";

    // pular: vai direto para o início da saída
    let start = performance.now(), raf = 0, finished = false;
    const skip = () => {
      const t = ((performance.now() - start) / 1000 + shift.current) / K;
      if (t < X) shift.current += (X - t) * K;
    };
    const finish = () => {
      if (finished) return; finished = true;
      root.classList.remove("intro-on");
      root.style.overflow = overflow;
      page?.removeAttribute("inert");
      window.dispatchEvent(new Event("intro-done"));
      setDone(true);
    };
    const loop = (now: number) => {
      const T = (now - start) / 1000 + shift.current;
      if (T >= DURATION) { finish(); return; }
      const t = T / K;
      setT0(t);
      setAlpha(1 - enter(X + 0.2, END)(t));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    // a contagem só começa quando a página está pintada (evita comer o início da animação)
    raf = requestAnimationFrame(() => { start = performance.now(); raf = requestAnimationFrame(loop); });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      if (!finished) { root.style.overflow = overflow; page?.removeAttribute("inert"); }
    };
  }, []);

  if (done) return null;
  return (
    <div className="intro" aria-hidden="true" style={{ opacity: alpha }}>
      <div className="intro-stage" style={{ width: L.W, height: L.H, transform: `translate(-50%, -50%) scale(${scale})` }}>
        <Cluster t0={t0} L={L} />
      </div>
    </div>
  );
}
