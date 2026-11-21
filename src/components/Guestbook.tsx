import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "../utils/cn";
import { HammerIcon, XIcon } from "./icons";

interface Plank {
  id: string;
  name: string;
  text: string;
  tone: number;
}

const TONES = [
  { bg: "#2a2732", fg: "#e9e2f2", label: "charcoal" },
  { bg: "#37302b", fg: "#f3e6d6", label: "bark" },
  { bg: "#22302c", fg: "#d8ece2", label: "moss" },
  { bg: "#22242f", fg: "#dde3f2", label: "night" },
  { bg: "#33232a", fg: "#f4dfe4", label: "berry" },
];

function tilt(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((Math.abs(h) % 50) - 25) / 10;
}

export default function Guestbook({ onNail }: { onNail: () => void }) {
  const [planks, setPlanks] = useState<Plank[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [tone, setTone] = useState(0);
  const [sending, setSending] = useState(false);

  // track which plank IDs this visitor created (session only)
  const ownIds = useRef<Set<string>>(new Set());

  const fetchPlanks = useCallback(async () => {
    try {
      const res = await fetch("/api/planks");
      if (res.ok) {
        const data: Plank[] = await res.json();
        setPlanks(data);
      }
    } catch {
      /* offline / no backend — silent fail */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanks();
    // poll every 15s so new planks from other visitors show up
    const id = setInterval(fetchPlanks, 15000);
    return () => clearInterval(id);
  }, [fetchPlanks]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);

    const plank: Plank = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
      name: name.trim() || "a visitor",
      text: t,
      tone,
    };

    try {
      const res = await fetch("/api/planks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plank),
      });
      if (res.ok) {
        ownIds.current.add(plank.id);
        setText("");
        onNail();
        await fetchPlanks();
      }
    } catch {
      /* silent */
    } finally {
      setSending(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await fetch(`/api/planks/${id}`, { method: "DELETE" });
      ownIds.current.delete(id);
      await fetchPlanks();
    } catch {
      /* silent */
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
      <form onSubmit={submit} className="card3d h-fit rounded-3xl border border-edge bg-card/80 p-5 shadow-xl shadow-black/30 backdrop-blur transition hover:border-accent/40 hover:shadow-accent/10">
        <h3 className="font-display text-2xl font-bold">Nail a plank</h3>
        <p className="mt-1 text-sm text-mute">Leave a line for the next visitor.</p>

        <label className="mt-5 block">
          <span className="font-mono text-[11px] tracking-[0.2em] text-mute uppercase">your name (optional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="moss, june, kit..."
            className="mt-1.5 w-full rounded-xl border border-edge bg-paper/60 px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-mute/50 focus:border-accent"
          />
        </label>

        <label className="mt-4 block">
          <span className="flex justify-between font-mono text-[11px] tracking-[0.2em] text-mute uppercase">
            <span>your message</span>
            <span>{text.length}/90</span>
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={90}
            rows={3}
            placeholder="the first time I heard it..."
            className="mt-1.5 w-full resize-none rounded-xl border border-edge bg-paper/60 px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-mute/50 focus:border-accent"
          />
        </label>

        <div className="mt-4">
          <span className="font-mono text-[11px] tracking-[0.2em] text-mute uppercase">wood tone</span>
          <div className="mt-2 flex gap-2.5" role="radiogroup" aria-label="Plank color">
            {TONES.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="radio"
                aria-checked={tone === i}
                aria-label={t.label}
                onClick={() => setTone(i)}
                className={cn(
                  "size-8 cursor-pointer rounded-full border-2 transition hover:scale-110",
                  tone === i ? "scale-110 border-ink" : "border-transparent",
                )}
                style={{ background: t.bg }}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-ink shadow-lg transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <HammerIcon width={16} height={16} />
          {sending ? "Nailing..." : "Nail it to the wall"}
        </button>
      </form>

      <div>
        {loading ? (
          <div className="flex h-full min-h-48 items-center justify-center rounded-3xl border border-dashed border-edge p-8 text-center text-mute">
            Loading the wall...
          </div>
        ) : planks.length === 0 ? (
          <div className="flex h-full min-h-48 items-center justify-center rounded-3xl border border-dashed border-edge p-8 text-center text-mute">
            The wall is bare. Be the first to nail something up.
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {planks.map((p) => {
              const t = TONES[p.tone % TONES.length];
              const isOwn = ownIds.current.has(p.id);
              return (
                <li
                  key={p.id}
                  className="plank group relative rounded-md px-5 pt-6 pb-4 transition hover:z-10 hover:scale-[1.03]"
                  style={{ background: t.bg, color: t.fg, transform: `rotate(${tilt(p.id)}deg)` }}
                >
                  <span className="absolute top-2.5 left-3 size-1.5 rounded-full bg-white/25" />
                  <span className="absolute top-2.5 right-3 size-1.5 rounded-full bg-white/25" />
                  <p className="font-hand text-[1.6rem] leading-[1.05] font-bold break-words">{p.text}</p>
                  <p className="mt-3 font-mono text-[11px] tracking-widest uppercase opacity-60">&mdash; {p.name}</p>
                  {isOwn && (
                    <button
                      onClick={() => remove(p.id)}
                      aria-label="Remove your plank"
                      className="absolute -top-2 -right-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-white/85 text-black opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      <XIcon width={12} height={12} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
