import { cn } from "../utils/cn";
import Reveal from "./Reveal";

const RINGS = [
  {
    year: "early 2010s",
    title: "Bedroom recordings",
    text: "Alex Giannascoli from the Philadelphia area uploads home-recorded songs to the internet as (Sandy) Alex G. The intimate, whispering sound was born here.",
  },
  {
    year: "2014",
    title: "DSU",
    text: "A lo-fi record that brought his name to a much wider audience.",
  },
  {
    year: "2015",
    title: "Beach Music",
    text: "The songs get wider: more color, more strange turns — and the same close-up voice.",
  },
  {
    year: "2017",
    title: "Rocket",
    text: "First album on Domino — folk, noise, and pop in the same room.",
  },
  {
    year: "2019",
    title: "House of Sugar",
    text: "Released September 13 on Domino: 13 tracks, with a title nodding to both a fairytale gingerbread house and the SugarHouse Casino in Philly.",
  },
  {
    year: "2020",
    title: '"Treehouse" blows up',
    text: 'The early song unexpectedly goes viral on TikTok. Covers, edits, and thousands of "where can I find the original?" questions follow.',
    hot: true,
  },
  {
    year: "2022",
    title: "God Save the Animals",
    text: "Another album on Domino — the tree continues to grow new branches.",
  },
];

export default function Timeline() {
  return (
    <div className="relative">
      <div className="absolute top-2 bottom-2 left-[15px] w-px bg-gradient-to-b from-transparent via-edge to-transparent md:left-1/2" />
      <ol className="space-y-8 md:space-y-10">
        {RINGS.map((r, i) => (
          <li key={r.year} className={cn("relative pl-12 md:w-1/2 md:pl-0", i % 2 === 0 ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12")}>
            <span
              className={cn(
                "absolute top-5 left-[7px] size-4 rounded-full border-4 border-paper md:left-auto",
                i % 2 === 0 ? "md:-right-2" : "md:-left-2",
                r.hot ? "bg-accent ring-4 ring-accent/30" : "bg-mute",
              )}
            />
            <Reveal>
              <div
                className={cn(
                  "rounded-2xl border p-5 transition hover:-translate-y-0.5",
                  r.hot ? "border-accent/60 bg-accent/10" : "border-edge bg-card/70",
                )}
              >
                <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">{r.year}</p>
                <h3 className="font-display mt-1 text-2xl font-bold">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mute">{r.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
