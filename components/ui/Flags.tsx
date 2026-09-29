import { useId, type SVGProps } from "react";

/*
 * Small, simplified flags for the language switcher. Both share a 20x14 box
 * with a hairline edge so they sit quietly next to each other.
 */

type FlagProps = SVGProps<SVGSVGElement>;

function Frame({ children, ...props }: FlagProps) {
  const clip = `flag${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 20 14" aria-hidden="true" focusable="false" {...props}>
      <defs>
        <clipPath id={clip}>
          <rect width="20" height="14" rx="1.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>{children}</g>
      <rect x="0.25" y="0.25" width="19.5" height="13.5" rx="1.35" fill="none" stroke="rgba(30,30,27,0.18)" strokeWidth="0.5" />
    </svg>
  );
}

export function BrazilFlag(props: FlagProps) {
  return (
    <Frame {...props}>
      <rect width="20" height="14" fill="#1f8a4c" />
      <path d="M10 1.6 18.2 7 10 12.4 1.8 7Z" fill="#f2cf3a" />
      <circle cx="10" cy="7" r="3.3" fill="#1f3f7a" />
      <path d="M6.85 6.2c2.1-.45 4.5-.1 6.25 1.05" fill="none" stroke="#f5f3ee" strokeWidth="0.55" />
    </Frame>
  );
}

const STRIPE = 14 / 13;
const STARS = Array.from({ length: 20 }, (_, i) => ({
  cx: 1 + (i % 5) * 1.7 + (Math.floor(i / 5) % 2) * 0.85,
  cy: 0.95 + Math.floor(i / 5) * 1.6,
}));

export function UsFlag(props: FlagProps) {
  return (
    <Frame {...props}>
      <rect width="20" height="14" fill="#f5f3ee" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={i * 2 * STRIPE} width="20" height={STRIPE} fill="#b0303b" />
      ))}
      <rect width="9" height={7 * STRIPE} fill="#2c3563" />
      {STARS.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r="0.32" fill="#f5f3ee" />
      ))}
    </Frame>
  );
}
