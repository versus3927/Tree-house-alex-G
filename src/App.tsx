import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAudio } from "./audio/useAudio";
import Guestbook from "./components/Guestbook";
import HiddenPlayer, { type HiddenPlayerHandle } from "./components/HiddenPlayer";
import Reveal from "./components/Reveal";
import SongsPage from "./components/SongsPage";
import Timeline from "./components/Timeline";
import TreehouseScene from "./components/TreehouseScene";
import { ArrowUpRight, LeafIcon, PauseIcon, PlayIcon } from "./components/icons";
import { DISCOGRAPHY, GALLERY, QUOTES, SONGS, YT_WATCH } from "./theme";

const SEARCH = "alex g treehouse";
const LISTEN = [
  { name: "YouTube", note: "Official Topic Channel upload", href: YT_WATCH },
  { name: "Spotify", note: "Search for song and albums", href: `https://open.spotify.com/search/${encodeURIComponent(SEARCH)}` },
  { name: "Bandcamp", note: "Where the early lo-fi magic lives", href: `https://bandcamp.com/search?q=${encodeURIComponent(SEARCH)}` },
  { name: "Apple Music", note: "Stream or buy the albums", href: `https://music.apple.com/us/search?term=${encodeURIComponent(SEARCH)}` },
];

type View = "home" | "songs";

function SectionHead({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-accent uppercase">
        <LeafIcon width={14} height={14} />
        {kicker}
      </p>
      <h2 className="font-display mt-3 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">{title}</h2>
      {children && <p className="mt-4 text-lg leading-relaxed text-mute">{children}</p>}
    </Reveal>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [lamp, setLamp] = useState(true);
  const [currentSongId, setCurrentSongId] = useState(SONGS[0].id);
  const [ytPlaying, setYtPlaying] = useState(false);
  const [ytVolume, setYtVolume] = useState(0.85);
  const audio = useAudio();
  const playerRef = useRef<HiddenPlayerHandle | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [view]);
  useEffect(() => { playerRef.current?.setVolume(ytVolume); }, [ytVolume]);

  const toggleLamp = () => { audio.click(); setLamp((l) => !l); };

  const selectSong = (songId: string) => {
    audio.stop();
    const cur = playerRef.current?.getCurrentSongId();
    if (cur === songId) {
      if (ytPlaying) { playerRef.current?.pause(); setYtPlaying(false); }
      else { playerRef.current?.resume(); setYtPlaying(true); }
      setCurrentSongId(songId);
      return;
    }
    setCurrentSongId(songId);
    setYtPlaying(true);
    playerRef.current?.playSong(songId);
  };

  const toggleTreehouse = () => selectSong(SONGS[0].id);
  const isTreehousePlaying = ytPlaying && currentSongId === SONGS[0].id;

  if (view === "songs") {
    return (
      <>
        <HiddenPlayer ref={playerRef} onPlayingChange={setYtPlaying} />
        <SongsPage currentSongId={currentSongId} playing={ytPlaying} onBack={() => setView("home")} onSelectSong={selectSong} />
      </>
    );
  }

  return (
    <div className="themed grain min-h-screen bg-paper font-sans text-ink theme-pine">
      <HiddenPlayer ref={playerRef} onPlayingChange={setYtPlaying} />
      <div className="dust-layer hidden lg:block" aria-hidden="true" />

      {/* ===== HEADER ===== */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-edge/40 bg-paper/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden className="text-accent">
              <path d="M16 3 4 12h4v6h16v-6h4z" fill="currentColor" />
              <rect x="13" y="19" width="6" height="11" rx="1" fill="currentColor" opacity="0.55" />
              <circle cx="16" cy="13.5" r="2" style={{ fill: "var(--paper)" }} />
            </svg>
            <span className="font-hand text-2xl leading-none font-bold">treehouse</span>
            <span className="hidden font-mono text-[11px] tracking-widest text-mute uppercase sm:inline">alex g</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-mute lg:flex">
            <a className="transition hover:text-ink" href="#song">About</a>
            <a className="transition hover:text-ink" href="#gallery">Gallery</a>
            <a className="transition hover:text-ink" href="#atmosphere">Atmosphere</a>
            <button onClick={() => setView("songs")} className="cursor-pointer transition hover:text-ink">Songs</button>
            <a className="transition hover:text-ink" href="#lyrics">Lyrics</a>
            <a className="transition hover:text-ink" href="#disco">Discography</a>
            <a className="transition hover:text-ink" href="#listen">Listen</a>
            <a className="transition hover:text-ink" href="#rings">Timeline</a>
            <a className="transition hover:text-ink" href="#guestbook">Wall</a>
          </nav>
          <button onClick={toggleTreehouse} className="flex cursor-pointer items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-accent-ink shadow-lg shadow-accent/20 transition hover:brightness-110 active:scale-95">
            {isTreehousePlaying ? <PauseIcon width={14} height={14} /> : <PlayIcon width={14} height={14} />}
            {isTreehousePlaying ? "Pause" : "Play"}
          </button>
        </div>
      </header>

      <main>
        {/* ===== HERO ===== */}
        <section id="top" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black opacity-90" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(8,20,10,0.6),transparent)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-28 pb-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:pt-32 lg:pb-24">
            <div>
              <p className="font-mono text-[11px] tracking-[0.25em] text-mute uppercase">(Sandy) Alex G &middot; unofficial tribute</p>
              <h1 className="font-display mt-4 text-[clamp(4.2rem,12vw,8.5rem)] leading-[0.82] font-bold tracking-tight">
                Tree<span className="text-accent italic">house</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-mute">
                A tiny room in the branches for a tiny lo-fi song that became huge. Climb the ladder, light the window, and stay a while.
              </p>
              <button onClick={toggleTreehouse} className="card3d group mt-8 flex w-full max-w-xs cursor-pointer items-center gap-4 rounded-2xl border border-accent/30 bg-accent/10 px-6 py-5 shadow-xl shadow-accent/10 backdrop-blur-md transition hover:border-accent/60 hover:shadow-accent/20 active:scale-[0.98]">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lg shadow-accent/40 transition group-hover:scale-105">
                  {isTreehousePlaying ? <PauseIcon width={24} height={24} /> : <PlayIcon width={24} height={24} className="ml-1" />}
                </span>
                <div className="text-left">
                  <span className="text-lg font-bold">{isTreehousePlaying ? "Pause Treehouse" : "Play Treehouse"}</span>
                  <span className="mt-0.5 block font-mono text-[11px] tracking-widest text-mute uppercase">{isTreehousePlaying ? "Now playing" : "Stream via YouTube"}</span>
                </div>
              </button>
              {ytPlaying && (
                <div className="mt-4 flex max-w-xs items-center gap-3 px-2 text-mute">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M11 5 6 9H3v6h3l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /></svg>
                  <input type="range" min={0} max={1} step={0.01} value={ytVolume} onChange={(e) => setYtVolume(parseFloat(e.target.value))} className="h-1 w-full cursor-pointer accent-accent" aria-label="Volume" />
                </div>
              )}
            </div>
            <div className="perspective-[1200px]">
              <div className="card3d relative overflow-hidden rounded-[2rem] border border-edge/60 shadow-2xl shadow-black/80">
                <div className="aspect-[4/3.4] sm:aspect-[4/3]">
                  <TreehouseScene lamp={lamp} onLamp={toggleLamp} onBell={audio.chime} onRung={audio.pluck} />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-3">
                  <p className="font-hand rounded-full bg-black/70 px-4 py-1 text-center text-lg leading-tight text-white backdrop-blur-sm sm:text-xl">click the window, ring the bell, play the ladder</p>
                </div>
              </div>
              <p className="mt-3 text-center font-mono text-[11px] tracking-[0.2em] text-mute/50 uppercase">fig. 1 &mdash; a treehouse, not to scale</p>
            </div>
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section id="song" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24">
          <SectionHead kicker="the song" title={<>Small song, <span className="text-accent italic">big</span> treehouse.</>}>
            "Treehouse" is one of those tracks you find by accident and keep forever.
          </SectionHead>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Origins", p: "An early home-recorded song by (Sandy) Alex G from the self-made era, long before the Domino records hit. Probably written around 2011, in a bedroom in Havertown, PA." },
              { n: "02", t: "Discovery", p: "Circulated for years as a fan-curated rarity on the compilation HIGH. Eventually blew up on TikTok in 2020. The covers never stopped." },
              { n: "03", t: "The Vibe", p: "It sounds like whispering from the other side of a dark room. Tiny, shy, and somehow monumental. That's the mood of everything here." },
            ].map((c, i) => (
              <Reveal key={c.n} delay={i * 120}>
                <article className="card3d h-full rounded-3xl border border-edge bg-card/80 p-7 shadow-xl shadow-black/40 backdrop-blur transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-accent/10">
                  <span className="font-display text-5xl font-bold text-accent/60 italic">{c.n}</span>
                  <h3 className="font-display mt-4 text-2xl font-bold">{c.t}</h3>
                  <p className="mt-3 leading-relaxed text-mute">{c.p}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-edge bg-edge/40 shadow-xl shadow-black/40 sm:grid-cols-4">
            {[
              { big: "2:38", small: "length on the fan comp HIGH" },
              { big: "2020", small: "went viral on TikTok" },
              { big: "1 ladder", small: "0 adults, 2 members" },
              { big: "~2011", small: "probably recorded" },
            ].map((f) => (
              <div key={f.big} className="bg-card p-6">
                <p className="font-display text-4xl font-bold">{f.big}</p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.15em] text-mute uppercase">{f.small}</p>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ===== GALLERY — 3 columns masonry ===== */}
        <section id="gallery" className="scroll-mt-16 py-24">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead kicker="gallery" title={<>The world around the <span className="text-accent italic">song.</span></>}>
              Lo-fi shows, dark forests, bedroom studios, and cassette hiss. The aesthetic Treehouse lives in.
            </SectionHead>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {GALLERY.map((img, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="card3d group overflow-hidden rounded-2xl border border-edge/20 bg-card shadow-xl shadow-black/60 transition hover:border-accent/30 hover:shadow-accent/10">
                    <div className="overflow-hidden">
                      <img src={img.src} alt={img.alt} loading="lazy" className="w-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <div className="px-5 py-4">
                      <p className="font-hand text-xl text-ink">{img.caption}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== ATMOSPHERE — treehouse photo ===== */}
        <section id="atmosphere" className="relative scroll-mt-16 section-glow">
          <div className="relative h-[85vh] min-h-[550px] overflow-hidden lg:h-[90vh]">
            <img src="/images/sections/atmosphere-treehouse.jpg" alt="Wooden treehouse among trees" className="absolute inset-0 size-full object-cover grayscale-[0.2] contrast-[1.1] scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-paper/90 via-paper/40 to-transparent" />
            <div className="absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent lg:block" />
            <div className="relative flex h-full items-center px-5 pb-16 lg:px-20">
              <Reveal className="max-w-2xl lg:translate-x-10">
                <p className="font-mono text-[11px] tracking-[0.3em] text-accent uppercase lg:text-xs">atmosphere</p>
                <h2 className="font-display mt-4 text-6xl leading-[0.95] font-bold sm:text-7xl lg:text-8xl">
                  Except you. <br /><span className="text-accent italic">You</span> can stay.
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute lg:text-xl lg:leading-loose">
                  Havertown, PA. A quiet bedroom. A vintage laptop microphone capturing a moment that felt like it would never leave that four-walled room.
                  <span className="mt-4 block border-l border-accent/30 pl-6 italic text-mute/80">"Do Not Enter's written on the doorway..."</span>
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===== LYRICS / QUOTES ===== */}
        <section id="lyrics" className="relative scroll-mt-16 overflow-hidden py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(74,222,128,0.06),transparent)]" />
          <div className="relative mx-auto max-w-4xl px-5">
            <SectionHead kicker="fragments" title={<>Words that <span className="text-accent italic">stay.</span></>}>
              We're not reproducing the full lyrics here. Go listen. But these two lines are the whole song.
            </SectionHead>
            <div className="space-y-10">
              {QUOTES.map((q, i) => (
                <Reveal key={i} delay={i * 200}>
                  <blockquote className="card3d rounded-3xl border border-edge bg-card/70 p-8 shadow-2xl shadow-black/50 backdrop-blur sm:p-10">
                    <p className="font-display text-2xl leading-snug font-bold italic sm:text-3xl">"{q.text}"</p>
                    <p className="mt-5 text-sm leading-relaxed text-mute">{q.note}</p>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PHOTO BREAK — Philly ===== */}
        <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
          <img src="https://images.pexels.com/photos/11531602/pexels-photo-11531602.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=2000" alt="Philadelphia skyline at night" className="absolute inset-0 size-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-paper/20" />
          <div className="relative flex h-full items-center justify-center px-5">
            <Reveal><p className="font-hand text-center text-4xl leading-tight text-white sm:text-5xl">Philadelphia at night.<br />Where Alex G built all of this.</p></Reveal>
          </div>
        </section>

        {/* ===== DISCOGRAPHY ===== */}
        <section id="disco" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24">
          <SectionHead kicker="discography" title={<>Every room in the <span className="text-accent italic">tree.</span></>}>
            Eight studio albums and counting. Treehouse was born somewhere around the first few branches.
          </SectionHead>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DISCOGRAPHY.map((d, i) => (
              <Reveal key={d.name} delay={i * 70}>
                <div className="card3d group flex items-center gap-4 rounded-2xl border border-edge bg-card/70 p-5 shadow-lg shadow-black/30 transition hover:border-accent/40 hover:shadow-accent/10">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 font-mono text-sm font-bold text-accent">{d.year}</span>
                  <div>
                    <p className="font-display text-lg font-bold leading-tight">{d.name}</p>
                    <p className="font-mono text-[10px] tracking-widest text-mute uppercase">studio album</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===== LISTEN ===== */}
        <section id="listen" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24">
          <SectionHead kicker="listen" title={<>Go hear the <span className="text-accent italic">real</span> thing.</>}>
            Support the artist. Buy the records. The treehouse is free, but the music deserves your money.
          </SectionHead>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LISTEN.map((l, i) => (
              <Reveal key={l.name} delay={i * 100}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="card3d group flex h-full flex-col justify-between rounded-3xl border border-edge bg-card/80 p-6 shadow-xl shadow-black/40 backdrop-blur transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-accent/10">
                  <div>
                    <p className="font-display text-3xl font-bold">{l.name}</p>
                    <p className="mt-1 text-sm text-mute">{l.note}</p>
                  </div>
                  <span className="mt-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lg shadow-accent/30 transition group-hover:rotate-12 group-hover:scale-110">
                    <ArrowUpRight width={18} height={18} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===== PHOTO BREAK — lone tree ===== */}
        <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <img src="/images/sections/fog-tree-break.jpg" alt="A single tree in fog at night" className="absolute inset-0 size-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/50 to-transparent" />
          <div className="relative flex h-full items-end justify-start px-5 pb-14">
            <Reveal><p className="max-w-lg font-hand text-3xl leading-tight text-white sm:text-4xl">I don't think I'm ever gonna let you leave.</p></Reveal>
          </div>
        </section>

        {/* ===== TIMELINE ===== */}
        <section id="rings" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24">
          <SectionHead kicker="tree rings" title={<>A short, <span className="text-accent italic">rough</span> timeline.</>}>
            How a bedroom project grew into a very big tree.
          </SectionHead>
          <Timeline />
        </section>

        {/* ===== GUESTBOOK ===== */}
        <section id="guestbook" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24">
          <SectionHead kicker="guestbook" title={<>Leave your mark on the <span className="text-accent italic">wall.</span></>}>
            Every treehouse has initials carved into the wood. Leave a note, a memory, or a hello.
          </SectionHead>
          <Reveal><Guestbook onNail={audio.click} /></Reveal>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-edge/30">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 text-sm text-mute md:flex-row md:items-center">
          <div>
            <p className="font-hand text-3xl text-ink">thanks for climbing up.</p>
            <p className="mt-2 text-mute/70">The ladder is always down. Come back whenever.</p>
          </div>
          <p className="max-w-md leading-relaxed md:text-right">
            Unofficial fan page. All ambient sounds are browser-synthesized; songs stream via YouTube. Not affiliated with Alex G or Domino.
          </p>
        </div>
        <div className="border-t border-edge/20 py-4 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] text-mute/40 uppercase">made by versus</p>
        </div>
      </footer>
    </div>
  );
}
