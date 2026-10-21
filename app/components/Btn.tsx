import { withArrow } from "./Arrow";
import Wheel from "./Wheel";

type Props = {
  href: string;
  variant?: "primary" | "secondary";
  strong?: boolean;
  external?: boolean;
  reveal?: boolean;
  children: string;
};

export default function Btn({ href, variant = "primary", strong, external, reveal, children }: Props) {
  const cls = `btn btn-${variant}${strong ? " strong" : ""}`;
  return (
    <a
      href={href}
      className={cls}
      {...(reveal ? { "data-reveal": "" } : {})}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <Wheel />
      {withArrow(children)}
    </a>
  );
}
