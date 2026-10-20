// Seta que "sai em velocidade" e é substituída por outra quando o botão
// recebe hover (a animação fica em globals.css, em .fx-arrow).
const DIR: Record<string, [number, number]> = { "↗": [1, -1], "↓": [0, 1], "→": [1, 0], "←": [-1, 0] };

export default function Arrow({ glyph }: { glyph: string }) {
  const [x, y] = DIR[glyph] ?? [1, 0];
  return (
    <span className="fx-arrow" data-a={glyph} style={{ "--ax": x, "--ay": y } as React.CSSProperties} aria-hidden="true">
      <span>{glyph}</span>
    </span>
  );
}

// "Texto ↗" -> [<span>Texto</span>, <Arrow />]
export function withArrow(text: string) {
  const m = text.match(/^(.*?)\s*([↗↓→←])$/);
  if (!m) return <span className="btn-label">{text}</span>;
  return (
    <>
      <span className="btn-label">{m[1]}</span>
      <Arrow glyph={m[2]} />
    </>
  );
}
