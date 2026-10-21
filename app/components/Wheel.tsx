// Roda de corrida que atravessa o botão no hover (ver .fx-wheel em globals.css).
// Aro de malha com 12 raios, calota dourada e pneu com banda de rodagem.
export default function Wheel() {
  return (
    <span className="fx-wheel" aria-hidden="true">
      <svg viewBox="0 0 100 100" focusable="false">
        <circle className="w-tire" cx="50" cy="50" r="48" />
        <circle className="w-tread" cx="50" cy="50" r="46" />
        <circle className="w-lip" cx="50" cy="50" r="35" />
        <circle className="w-face" cx="50" cy="50" r="33" />
        <g className="w-spokes">
      <line x1="59.0" y1="50.0" x2="83.0" y2="50.0" />
      <line x1="57.8" y1="54.5" x2="78.6" y2="66.5" />
      <line x1="54.5" y1="57.8" x2="66.5" y2="78.6" />
      <line x1="50.0" y1="59.0" x2="50.0" y2="83.0" />
      <line x1="45.5" y1="57.8" x2="33.5" y2="78.6" />
      <line x1="42.2" y1="54.5" x2="21.4" y2="66.5" />
      <line x1="41.0" y1="50.0" x2="17.0" y2="50.0" />
      <line x1="42.2" y1="45.5" x2="21.4" y2="33.5" />
      <line x1="45.5" y1="42.2" x2="33.5" y2="21.4" />
      <line x1="50.0" y1="41.0" x2="50.0" y2="17.0" />
      <line x1="54.5" y1="42.2" x2="66.5" y2="21.4" />
      <line x1="57.8" y1="45.5" x2="78.6" y2="33.5" />
        </g>
        <circle className="w-cap" cx="50" cy="50" r="8" />
        <g className="w-lugs">
      <circle cx="50.0" cy="36.0" r="1.8" />
      <circle cx="63.3" cy="45.7" r="1.8" />
      <circle cx="58.2" cy="61.3" r="1.8" />
      <circle cx="41.8" cy="61.3" r="1.8" />
      <circle cx="36.7" cy="45.7" r="1.8" />
        </g>
      </svg>
    </span>
  );
}
