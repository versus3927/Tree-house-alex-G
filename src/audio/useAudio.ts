import { useCallback, useEffect, useRef, useState } from "react";
import { createEngine, type Engine } from "./engine";

export function useAudio() {
  const engineRef = useRef<Engine | null>(null);
  const volumeRef = useRef(0.6);
  const playingRef = useRef(false);
  const rainRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [rain, setRainState] = useState(false);
  const [volume, setVolumeState] = useState(0.6);

  // Created lazily, always inside a user gesture.
  const ensure = useCallback((): Engine | null => {
    if (!engineRef.current) {
      try {
        const e = createEngine();
        e.setVolume(volumeRef.current);
        engineRef.current = e;
      } catch {
        return null;
      }
    }
    engineRef.current.resume();
    return engineRef.current;
  }, []);

  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    const e = ensure();
    if (!e || playingRef.current) return;
    playingRef.current = true;
    e.start();
    setPlaying(true);
  }, [ensure]);

  const stop = useCallback(() => {
    const e = engineRef.current;
    if (!e || !playingRef.current) return;
    playingRef.current = false;
    e.stop();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playingRef.current) stop();
    else start();
  }, [start, stop]);

  const toggleRain = useCallback(() => {
    const e = ensure();
    if (!e) return;
    const next = !rainRef.current;
    rainRef.current = next;
    e.setRain(next);
    setRainState(next);
  }, [ensure]);

  const setVolume = useCallback((v: number) => {
    volumeRef.current = v;
    setVolumeState(v);
    engineRef.current?.setVolume(v);
  }, []);

  const pluck = useCallback((midi: number) => ensure()?.pluck(midi), [ensure]);
  const chime = useCallback(() => ensure()?.chime(), [ensure]);
  const click = useCallback(() => ensure()?.click(), [ensure]);

  return { playing, rain, volume, toggle, start, stop, toggleRain, setVolume, pluck, chime, click };
}
