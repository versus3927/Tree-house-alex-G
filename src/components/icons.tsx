import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (p: P): P => ({
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...p,
});

export const MoonIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export const FogIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M17 12a5 5 0 1 0-.9-9.9A6 6 0 0 1 19 12" />
    <path d="M2 17h20M5 21h14" />
  </svg>
);

export const FlameIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-9-2 1.5-2.5 3-2.5 5C11 9 9.5 7 9.5 5 7 7 5 9.5 5 15a7 7 0 0 0 7 7z" />
    <path d="M12 22a3 3 0 0 0 3-3c0-1.8-1.5-2.7-3-4.5-1.5 1.8-3 2.7-3 4.5a3 3 0 0 0 3 3z" />
  </svg>
);

export const PlayIcon = (p: P) => (
  <svg {...base({ fill: "currentColor", stroke: "none", ...p })}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </svg>
);

export const PauseIcon = (p: P) => (
  <svg {...base({ fill: "currentColor", stroke: "none", ...p })}>
    <rect x="6" y="5" width="4.5" height="14" rx="1.2" />
    <rect x="13.5" y="5" width="4.5" height="14" rx="1.2" />
  </svg>
);

export const Back10 = (p: P) => (
  <svg {...base(p)}>
    <path d="M11 4 4 9l7 5V4z" />
    <path d="M4 9h9a6 6 0 1 1 0 12H8" />
  </svg>
);

export const Fwd10 = (p: P) => (
  <svg {...base(p)}>
    <path d="M13 4l7 5-7 5V4z" />
    <path d="M20 9h-9a6 6 0 1 0 0 12h5" />
  </svg>
);

export const LoopIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

export const RainIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 15a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 8a4 4 0 0 1-1 7.9" />
    <path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2" />
  </svg>
);

export const VolumeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M11 5 6 9H3v6h3l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);

export const ArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const LeafIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export const XIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const HammerIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m15 12-8.4 8.4a2.1 2.1 0 0 1-3-3L12 9" />
    <path d="M17.6 15 22 10.6M20 5l-3-3-4.4 4.4 3 3z" />
  </svg>
);

export const YouTubeIcon = (p: P) => (
  <svg {...base({ ...p, strokeWidth: 1.6 })}>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" stroke="none" />
  </svg>
);

export const FileIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v5h5M9 13h6M9 17h4" />
  </svg>
);

export const ArrowLeftIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 19-7-7 7-7M5 12h14" />
  </svg>
);
