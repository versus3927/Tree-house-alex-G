import Reveal from "./Reveal";
import { ArrowLeftIcon, PauseIcon, PlayIcon } from "./icons";
import { SONGS } from "../theme";
import { cn } from "../utils/cn";

interface Props {
  currentSongId: string;
  playing: boolean;
  onBack: () => void;
  onSelectSong: (songId: string) => void;
}

export default function SongsPage({ currentSongId, playing, onBack, onSelectSong }: Props) {
  return (
    <div className="themed grain min-h-screen bg-paper font-sans text-ink theme-pine">
      <div className="dust-layer hidden lg:block" aria-hidden="true" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-edge/20 bg-paper/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          <button onClick={onBack} className="group flex cursor-pointer items-center gap-2 text-xs font-medium text-mute/40 transition hover:text-ink">
            <ArrowLeftIcon width={16} height={16} className="transition group-hover:-translate-x-1" />
            Back
          </button>
          <span className="font-hand text-xl font-bold opacity-40">songs</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pt-28 pb-24">
        <header className="mb-16 text-center">
          <p className="font-mono text-[10px] tracking-[0.4em] text-accent uppercase opacity-40">Alex G Catalogue</p>
          <h1 className="font-display mt-4 text-5xl font-bold tracking-tight text-white/90 sm:text-6xl">
            More songs in the <span className="text-accent italic opacity-80">tree.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-mute/60">
            One button per song. Click once to start. Click again to pause. No embeds, no visible YouTube player.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SONGS.map((song, i) => {
            const isPlaying = playing && currentSongId === song.id;
            return (
              <Reveal key={song.id} delay={(i % 8) * 50}>
                <button
                  onClick={() => onSelectSong(song.id)}
                  className={cn(
                    "card3d group flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-xl",
                    isPlaying
                      ? "border-accent/40 bg-accent/5 shadow-lg shadow-accent/10"
                      : "border-edge/50 bg-card/80 shadow-lg shadow-black/40 hover:border-accent/20",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-xl transition-all",
                      isPlaying ? "bg-accent text-accent-ink" : "bg-paper text-mute group-hover:bg-accent/15 group-hover:text-accent",
                    )}
                  >
                    {isPlaying ? <PauseIcon width={18} height={18} /> : <PlayIcon width={18} height={18} className="ml-0.5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("font-display truncate text-lg font-bold leading-tight", isPlaying ? "text-accent" : "text-ink")}>
                      {song.title}
                    </p>
                    <p className="truncate font-mono text-[10px] tracking-widest text-mute uppercase">
                      {song.album}
                    </p>
                  </div>
                  {isPlaying && (
                    <div className="eq flex h-4 items-end gap-[3px] pr-1 text-accent" aria-hidden>
                      <span className="h-full" />
                      <span className="h-full" />
                      <span className="h-full" />
                    </div>
                  )}
                </button>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-20 flex justify-center">
          <button onClick={onBack} className="group flex cursor-pointer items-center gap-3 rounded-full bg-white/5 px-10 py-5 text-sm font-bold text-mute/30 transition hover:bg-white/10 hover:text-mute/80 active:scale-95">
            <ArrowLeftIcon width={18} height={18} className="transition group-hover:-translate-x-1" />
            Back to Treehouse
          </button>
        </div>
      </main>

      <footer className="border-t border-edge/20 py-8 text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] text-mute/40 uppercase">made by versus</p>
      </footer>
    </div>
  );
}
