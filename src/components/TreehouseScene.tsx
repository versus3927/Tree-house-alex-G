import { useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import { LADDER_NOTES, SCENE } from "../theme";

/* ---------- seeded randomness so the scene is stable between renders ---------- */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FADE: CSSProperties = {
  transition: "fill 1.3s ease, stroke 1.3s ease, stop-color 1.3s ease, opacity 1.3s ease",
};

const STARS = (() => {
  const r = mulberry32(21);
  return Array.from({ length: 46 }, () => ({
    x: r() * 800,
    y: r() * 270,
    r: 0.6 + r() * 1.4,
    d: r() * 4,
  }));
})();

const FIREFLIES = (() => {
  const r = mulberry32(5);
  return Array.from({ length: 18 }, () => ({
    x: 30 + r() * 740,
    y: 290 + r() * 250,
    dx: (r() - 0.5) * 70,
    dy: (r() - 0.5) * 50,
    delay: -r() * 9,
    blink: -r() * 3,
  }));
})();

const GRASS = (() => {
  const r = mulberry32(7);
  let d = "";
  for (let x = -5; x < 810; x += 8) {
    const h = 12 + r() * 24;
    const lean = (r() - 0.5) * 9;
    d += `M${x} 602 L${x + 3 + lean} ${602 - h} L${x + 7} 602Z`;
  }
  return d;
})();

const FLOWERS = (() => {
  const r = mulberry32(13);
  const cols = ["#e8e2d4", "#f0c98a", "#c9d2e2", "#f6ead2"];
  return Array.from({ length: 16 }, () => ({
    x: 20 + r() * 760,
    y: 548 + r() * 40,
    c: cols[Math.floor(r() * cols.length)],
  }));
})();

const BULB_COLORS = ["#ffd27a", "#ff8fa3", "#9be7c4", "#9ec5ff"];
const BULBS = (() => {
  const p0 = { x: 205, y: 322 };
  const p1 = { x: 410, y: 382 };
  const p2 = { x: 615, y: 322 };
  return Array.from({ length: 11 }, (_, i) => {
    const t = (i + 0.5) / 11;
    const u = 1 - t;
    return {
      x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
      y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y + 5,
      c: BULB_COLORS[i % BULB_COLORS.length],
      d: -i * 0.35,
    };
  });
})();

/* ---------- leafy clump ---------- */
function Leafy({
  cx,
  cy,
  r,
  seed,
  colors,
  delay = 0,
}: {
  cx: number;
  cy: number;
  r: number;
  seed: number;
  colors: string[];
  delay?: number;
}) {
  const blobs = useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({ length: 9 }, () => {
      const a = rnd() * Math.PI * 2;
      const d = rnd() * r * 0.6;
      return {
        x: cx + Math.cos(a) * d,
        y: cy + Math.sin(a) * d * 0.8,
        r: r * (0.42 + rnd() * 0.36),
        c: Math.floor(rnd() * 3),
      };
    });
  }, [cx, cy, r, seed]);
  return (
    <g className="sway" style={{ animationDelay: `${-delay}s` }}>
      <circle cx={cx} cy={cy} r={r * 0.85} style={{ ...FADE }} fill={colors[2]} />
      {blobs.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={colors[b.c]} style={FADE} />
      ))}
    </g>
  );
}

function onKey(fn: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };
}

interface Props {
  lamp: boolean;
  onLamp: () => void;
  onBell: () => void;
  onRung: (midi: number) => void;
}

export default function TreehouseScene({ lamp, onLamp, onBell, onRung }: Props) {
  const S = SCENE;
  const [ring, setRing] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  const glow = lamp ? S.glow : 0;
  const lightsOn = lamp ? S.lights : 0;

  const hitRung = (i: number) => {
    onRung(LADDER_NOTES[LADDER_NOTES.length - 1 - i]);
    setActive(i);
    window.setTimeout(() => setActive((a) => (a === i ? null : a)), 260);
  };
  const hitBell = () => {
    setRing((n) => n + 1);
    onBell();
  };

  return (
    <svg
      viewBox="0 0 800 600"
      className="block h-full w-full select-none"
      role="img"
      aria-label="An illustrated treehouse in a big tree, with a rope ladder, a glowing window and a tire swing"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ ...FADE, stopColor: S.sky[0] }} />
          <stop offset="0.58" style={{ ...FADE, stopColor: S.sky[1] }} />
          <stop offset="1" style={{ ...FADE, stopColor: S.sky[2] }} />
        </linearGradient>
        <radialGradient id="winGlow">
          <stop offset="0" stopColor="#ffcf70" stopOpacity="0.8" />
          <stop offset="0.45" stopColor="#ffb85a" stopOpacity="0.25" />
          <stop offset="1" stopColor="#ffb85a" stopOpacity="0" />
        </radialGradient>
        <clipPath id="roofClip">
          <polygon points="275,206 400,118 525,206" />
        </clipPath>
        <linearGradient id="trunkShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
        <radialGradient id="backGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#b9c6e8" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#8fa0cc" stopOpacity="0.16" />
          <stop offset="1" stopColor="#8fa0cc" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* sky */}
      <rect width="800" height="600" fill="url(#sky)" />

      {/* stars */}
      <g style={{ ...FADE, opacity: S.stars }}>
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#fff8e0"
            className="twinkle"
            style={{ animationDelay: `${-s.d}s` }}
          />
        ))}
      </g>

      {/* sun */}
      <g
        style={{
          transform: `translate(${S.sun.x}px, ${S.sun.y}px)`,
          opacity: S.sun.opacity,
          transition: "transform 1.8s ease, opacity 1.3s ease",
        }}
      >
        <circle r="120" fill={S.sun.color} opacity="0.1" style={FADE} />
        <circle r="82" fill={S.sun.color} opacity="0.16" style={FADE} />
        <circle r="58" fill={S.sun.color} opacity="0.28" style={FADE} />
        <circle r="38" fill={S.sun.color} style={FADE} />
      </g>

      {/* moon */}
      <g
        style={{
          transform: `translate(${S.moon.x}px, ${S.moon.y}px)`,
          opacity: S.moon.opacity,
          transition: "transform 1.8s ease, opacity 1.3s ease",
        }}
      >
        <circle r="70" fill="#f6f1d6" opacity="0.07" />
        <circle r="48" fill="#f6f1d6" opacity="0.12" />
        <circle r="28" fill="#f6f1d6" />
        <circle cx="-8" cy="-6" r="5" fill="#e4dcb4" />
        <circle cx="9" cy="6" r="7" fill="#e4dcb4" />
        <circle cx="-4" cy="13" r="3" fill="#e4dcb4" />
      </g>

      {/* clouds */}
      <g style={{ ...FADE, opacity: S.cloud.opacity }}>
        {[
          { y: 82, s: 1, dur: 120, del: -20 },
          { y: 150, s: 0.7, dur: 160, del: -90 },
          { y: 55, s: 0.55, dur: 200, del: -150 },
        ].map((c, i) => (
          <g key={i} className="cloud" style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.del}s` }}>
            <g transform={`translate(0 ${c.y}) scale(${c.s})`} fill={S.cloud.color} style={FADE}>
              <ellipse cx="0" cy="0" rx="46" ry="13" style={FADE} />
              <ellipse cx="26" cy="-9" rx="30" ry="15" style={FADE} />
              <ellipse cx="-22" cy="-6" rx="26" ry="12" style={FADE} />
            </g>
          </g>
        ))}
      </g>

      {/* hills */}
      <path
        d="M0 430 C100 405 210 425 320 432 S560 400 690 420 S770 425 800 418 L800 600 L0 600Z"
        fill={S.hillFar}
        style={FADE}
      />
      <g fill={S.pine} style={FADE}>
        {[34, 62, 98, 128, 598, 640, 700, 742, 774].map((x, i) => {
          const h = 34 + ((i * 7) % 5) * 5;
          return (
            <g key={x}>
              <path d={`M${x - 10} 442 L${x} ${442 - h} L${x + 10} 442Z`} style={FADE} />
              <path d={`M${x - 8} ${442 - h * 0.45} L${x} ${442 - h - 6} L${x + 8} ${442 - h * 0.45}Z`} style={FADE} />
            </g>
          );
        })}
      </g>
      <path
        d="M0 482 C140 452 280 472 400 487 S640 455 800 482 L800 600 L0 600Z"
        fill={S.hillNear}
        style={FADE}
      />
      <path d="M0 522 C200 506 600 506 800 522 L800 600 L0 600Z" fill={S.ground} style={FADE} />

      {/* soft backglow so the silhouette reads on black */}
      <ellipse cx="400" cy="290" rx="330" ry="240" fill="url(#backGlow)" opacity="0.5" pointerEvents="none" />
      <ellipse cx="400" cy="330" rx="190" ry="150" fill="url(#backGlow)" opacity="0.35" pointerEvents="none" />

      {/* fireflies */}
      <g style={{ ...FADE, opacity: S.fireflies }}>
        {FIREFLIES.map((f, i) => (
          <g
            key={i}
            className="firefly"
            style={
              {
                "--dx": `${f.dx}px`,
                "--dy": `${f.dy}px`,
                animationDelay: `${f.delay}s`,
              } as CSSProperties
            }
          >
            <g className="blink" style={{ animationDelay: `${f.blink}s` }}>
              <circle cx={f.x} cy={f.y} r="8" fill="#e9ff8a" opacity="0.22" />
              <circle cx={f.x} cy={f.y} r="2.4" fill="#f3ffb0" />
            </g>
          </g>
        ))}
      </g>

      {/* ---------- the tree ---------- */}
      {/* branches */}
      <path
        d="M352 438 C300 430 250 400 205 366"
        stroke={S.trunk}
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
        style={FADE}
      />
      <path
        d="M205 366 C196 352 192 340 190 326"
        stroke={S.trunk}
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
        style={FADE}
      />
      <path
        d="M448 448 C520 450 600 430 652 402"
        stroke={S.trunk}
        strokeWidth="19"
        strokeLinecap="round"
        fill="none"
        style={FADE}
      />

      {/* trunk */}
      <path
        d="M306 604 C338 586 350 548 352 500 C354 440 350 380 348 316 L452 316 C450 380 446 440 450 500 C454 548 466 586 498 604 Z"
        fill={S.trunk}
        style={FADE}
      />
      <path
        d="M306 604 C338 586 350 548 352 500 C354 440 350 380 348 316 L452 316 C450 380 446 440 450 500 C454 548 466 586 498 604 Z"
        fill="url(#trunkShade)"
      />
      <g stroke={S.trunkDark} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55" style={FADE}>
        <path d="M372 540 C376 500 370 470 374 430" />
        <path d="M398 580 C402 520 396 480 400 440" />
        <path d="M426 560 C428 520 424 490 428 450" />
        <path d="M382 400 C384 380 380 364 383 340" />
        <path d="M418 410 C420 388 416 370 420 346" />
      </g>
      <ellipse cx="402" cy="476" rx="9" ry="14" fill={S.trunkDark} opacity="0.7" style={FADE} />

      {/* tire swing */}
      <g className="tire">
        <line x1="650" y1="402" x2="650" y2="486" stroke="#7a6a52" strokeWidth="2.5" />
        <ellipse cx="650" cy="496" rx="19" ry="10" fill="none" stroke="#222229" strokeWidth="9" />
        <ellipse cx="650" cy="494" rx="19" ry="9" fill="none" stroke="#3a3a44" strokeWidth="2" opacity="0.6" />
      </g>

      {/* back canopy */}
      <Leafy cx={400} cy={104} r={72} seed={1} colors={S.leaves} delay={0} />
      <Leafy cx={324} cy={128} r={56} seed={2} colors={S.leaves} delay={1.2} />
      <Leafy cx={478} cy={126} r={56} seed={3} colors={S.leaves} delay={2.1} />
      <Leafy cx={262} cy={162} r={50} seed={4} colors={S.leaves} delay={3} />
      <Leafy cx={540} cy={160} r={50} seed={5} colors={S.leaves} delay={0.7} />
      <Leafy cx={208} cy={208} r={42} seed={6} colors={S.leaves} delay={2.6} />
      <Leafy cx={594} cy={208} r={42} seed={7} colors={S.leaves} delay={1.6} />
      <Leafy cx={384} cy={60} r={44} seed={8} colors={S.leaves} delay={3.4} />
      <Leafy cx={446} cy={66} r={42} seed={9} colors={S.leaves} delay={0.4} />
      <Leafy cx={190} cy={322} r={30} seed={10} colors={S.leaves} delay={2} />

      {/* platform struts */}
      <g stroke={S.woodDark} strokeWidth="8" strokeLinecap="round" style={FADE}>
        <line x1="352" y1="412" x2="228" y2="316" />
        <line x1="448" y1="412" x2="592" y2="316" />
      </g>

      {/* rope ladder */}
      <g>
        <line x1="232" y1="314" x2="230" y2="552" stroke="#8d8471" strokeWidth="3" />
        <line x1="278" y1="314" x2="280" y2="552" stroke="#8d8471" strokeWidth="3" />
        <ellipse cx="255" cy="556" rx="42" ry="7" fill="#000" opacity="0.18" />
        {Array.from({ length: 8 }, (_, i) => {
          const y = 344 + i * 27;
          const lit = active === i;
          return (
            <g
              key={i}
              className="hot"
              role="button"
              tabIndex={0}
              aria-label={`Ladder rung ${8 - i} — plays a note`}
              onPointerDown={() => hitRung(i)}
              onPointerEnter={(e) => {
                if (e.buttons === 1) hitRung(i);
              }}
              onKeyDown={onKey(() => hitRung(i))}
              style={{ touchAction: "none" }}
            >
              <rect x="222" y={y - 11} width="66" height="26" fill="transparent" />
              <rect
                x="227"
                y={y}
                width="56"
                height="8"
                rx="4"
                fill={lit ? "#ffd36b" : S.wood}
                stroke={S.woodDark}
                strokeWidth="1.5"
                style={{ transition: "fill .25s ease, stroke 1.3s ease" }}
              />
              <rect
                className="focus-ring"
                x="221"
                y={y - 6}
                width="68"
                height="20"
                rx="8"
                fill="none"
                stroke="transparent"
              />
            </g>
          );
        })}
      </g>

      {/* platform */}
      <rect x="205" y="300" width="410" height="15" rx="3" fill={S.woodDark} style={FADE} />
      <rect x="205" y="300" width="410" height="6" rx="3" fill={S.wood} style={FADE} />
      <g stroke={S.woodDark} strokeWidth="1.5" opacity="0.6" style={FADE}>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={230 + i * 32} y1="306" x2={230 + i * 32} y2="315" />
        ))}
      </g>

      {/* cabin */}
      <rect x="300" y="198" width="200" height="103" fill={S.wood} style={FADE} />
      <g stroke={S.woodDark} strokeWidth="2" opacity="0.5" style={FADE}>
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={320 + i * 20} y1="206" x2={320 + i * 20} y2="300" />
        ))}
      </g>
      <rect x="300" y="198" width="200" height="12" fill="#000" opacity="0.14" />

      {/* roof */}
      <polygon points="275,206 400,118 525,206" fill={S.roof} style={FADE} />
      <g clipPath="url(#roofClip)" stroke={S.roofDark} strokeWidth="2" opacity="0.55" style={FADE}>
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1="260" y1={132 + i * 12} x2="540" y2={132 + i * 12} />
        ))}
      </g>
      <rect x="275" y="203" width="250" height="9" rx="2" fill={S.roofDark} style={FADE} />

      {/* flag */}
      <line x1="400" y1="120" x2="400" y2="84" stroke={S.woodDark} strokeWidth="3" style={FADE} />
      <path className="flag" d="M400 86 L434 94 L400 104 Z" fill={S.flag} style={FADE} />

      {/* window */}
      <g
        className="hot"
        role="button"
        tabIndex={0}
        aria-label="Window lamp — click to switch the light on or off"
        aria-pressed={lamp}
        onClick={() => onLamp()}
        onKeyDown={onKey(onLamp)}
      >
        <rect x="316" y="222" width="68" height="62" fill="transparent" />
        <rect
          x="322"
          y="228"
          width="56"
          height="50"
          rx="3"
          fill={lamp ? S.glassOn : S.glassOff}
          style={{ transition: "fill .6s ease" }}
        />
        {lamp && (
          <g fill={S.woodDark} opacity="0.75">
            <path d="M334 278 L334 262 Q334 256 340 256 Q346 256 346 262 L346 278Z" />
            <path d="M338 258 Q330 246 334 240 Q342 246 340 258Z" />
            <path d="M342 258 Q352 248 350 240 Q342 244 341 258Z" />
            <path d="M360 232 L372 232 L368 246 L364 246Z" opacity="0.5" />
          </g>
        )}
        <rect
          x="322"
          y="228"
          width="56"
          height="50"
          rx="3"
          fill="none"
          stroke={S.woodDark}
          strokeWidth="5"
          style={FADE}
        />
        <line x1="350" y1="228" x2="350" y2="278" stroke={S.woodDark} strokeWidth="3" style={FADE} />
        <line x1="322" y1="253" x2="378" y2="253" stroke={S.woodDark} strokeWidth="3" style={FADE} />
        <rect x="316" y="278" width="68" height="6" rx="2" fill={S.woodDark} style={FADE} />
        <rect className="focus-ring" x="312" y="224" width="76" height="66" rx="6" fill="none" stroke="transparent" />
      </g>

      {/* door */}
      <g>
        <path
          d="M432 301 L432 252 Q432 232 452 232 Q472 232 472 252 L472 301 Z"
          fill={S.door}
          style={FADE}
        />
        <g stroke="#000" strokeWidth="1.5" opacity="0.2">
          <line x1="452" y1="236" x2="452" y2="300" />
        </g>
        <circle cx="466" cy="272" r="2.8" fill="#f3d27a" />
      </g>

      {/* bell */}
      <g
        className="hot"
        role="button"
        tabIndex={0}
        aria-label="Ring the bell"
        onClick={hitBell}
        onKeyDown={onKey(hitBell)}
      >
        <rect x="272" y="208" width="36" height="50" fill="transparent" />
        <g key={ring} className={ring > 0 ? "bell-ring" : ""}>
          <line x1="290" y1="212" x2="290" y2="226" stroke="#8d8471" strokeWidth="2" />
          <path d="M279 247 Q279 228 290 226 Q301 228 301 247 Z" fill="#e3b04b" />
          <path d="M283 240 Q284 232 290 230" stroke="#fff4c6" strokeWidth="2" fill="none" opacity="0.6" />
          <rect x="277" y="245" width="26" height="4" rx="2" fill="#c4902f" />
          <circle cx="290" cy="252" r="3.2" fill="#8a5a1a" />
        </g>
        <rect className="focus-ring" x="274" y="210" width="32" height="46" rx="8" fill="none" stroke="transparent" />
      </g>

      {/* railing + sign */}
      <g style={FADE}>
        <rect x="505" y="256" width="112" height="5" rx="2" fill={S.woodDark} style={FADE} />
        {[508, 560, 612].map((x) => (
          <rect key={x} x={x - 3} y="256" width="6" height="45" fill={S.woodDark} style={FADE} />
        ))}
        <line x1="534" y1="261" x2="534" y2="268" stroke="#8d8471" strokeWidth="1.6" />
        <line x1="592" y1="261" x2="592" y2="268" stroke="#8d8471" strokeWidth="1.6" />
        <rect x="522" y="267" width="80" height="29" rx="3" fill={S.wood} stroke={S.woodDark} strokeWidth="1.5" style={FADE} />
        <text
          x="562"
          y="283"
          textAnchor="middle"
          fontFamily="Caveat, cursive"
          fontWeight="700"
          fontSize="18"
          style={{ ...FADE, fill: "#f6ead2" }}
        >
          club
        </text>
        <text
          x="562"
          y="292"
          textAnchor="middle"
          fontFamily="DM Sans, sans-serif"
          fontSize="6.4"
          letterSpacing="0.6"
          style={{ ...FADE, fill: "#f6ead2" }}
          opacity="0.75"
        >
          MEMBERS: 2
        </text>
      </g>

      {/* string lights */}
      <path d="M205 322 Q410 382 615 322" stroke="#1d1d24" strokeWidth="1.6" fill="none" opacity="0.7" />
      <g style={{ ...FADE, opacity: lightsOn }}>
        {BULBS.map((b, i) => (
          <g key={i} className="bulb" style={{ animationDelay: `${b.d}s` }}>
            <circle cx={b.x} cy={b.y} r="11" fill={b.c} opacity="0.22" />
            <circle cx={b.x} cy={b.y} r="4.2" fill={b.c} />
          </g>
        ))}
      </g>
      <g style={{ ...FADE, opacity: 1 - lightsOn }}>
        {BULBS.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r="3.6" fill="#8a8f96" opacity="0.7" />
        ))}
      </g>

      {/* window glow spills over everything */}
      <circle
        cx="350"
        cy="256"
        r="150"
        fill="url(#winGlow)"
        pointerEvents="none"
        style={{ ...FADE, opacity: glow }}
      />

      {/* front leaves tucked around the cabin */}
      <Leafy cx={274} cy={214} r={32} seed={11} colors={S.leaves} delay={1} />
      <Leafy cx={528} cy={212} r={32} seed={12} colors={S.leaves} delay={2.4} />
      <Leafy cx={236} cy={262} r={22} seed={13} colors={S.leaves} delay={0.6} />

      {/* foreground */}
      <path d={GRASS} fill={S.grass} style={FADE} />
      <g>
        {FLOWERS.map((f, i) => (
          <g key={i} opacity={0.85} style={FADE}>
            <line x1={f.x} y1={f.y} x2={f.x} y2={f.y + 12} stroke={S.grass} strokeWidth="1.5" style={FADE} />
            <circle cx={f.x} cy={f.y} r="3" fill={f.c} />
            <circle cx={f.x} cy={f.y} r="1.1" fill="#f2b84b" />
          </g>
        ))}
      </g>

      {/* corner foliage frame */}
      <Leafy cx={28} cy={28} r={96} seed={21} colors={S.leaves} delay={0.5} />
      <Leafy cx={140} cy={-6} r={72} seed={22} colors={S.leaves} delay={2.3} />
      <Leafy cx={776} cy={36} r={102} seed={23} colors={S.leaves} delay={1.1} />
      <Leafy cx={672} cy={-8} r={72} seed={24} colors={S.leaves} delay={3.1} />
      <Leafy cx={30} cy={596} r={74} seed={25} colors={[S.leafDark, S.leaves[2], S.leafDark]} delay={1.7} />
      <Leafy cx={776} cy={600} r={86} seed={26} colors={[S.leafDark, S.leaves[2], S.leafDark]} delay={2.8} />
      <Leafy cx={118} cy={612} r={56} seed={27} colors={[S.leafDark, S.leaves[2], S.leafDark]} delay={0.9} />
    </svg>
  );
}
