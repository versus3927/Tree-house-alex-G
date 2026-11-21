import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export interface HiddenPlayerHandle {
  playSong: (songId: string) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  getCurrentSongId: () => string | null;
}

interface Props {
  onPlayingChange: (playing: boolean) => void;
}

const HiddenPlayer = forwardRef<HiddenPlayerHandle, Props>(function HiddenPlayer(
  { onPlayingChange },
  ref,
) {
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const pendingSongRef = useRef<string | null>(null);
  const pendingPlayRef = useRef(false);
  const volumeRef = useRef(85);

  useEffect(() => {
    function init() {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player("hidden-yt-player", {
        height: "0",
        width: "0",
        videoId: "I_5lEJjGgto",
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event: any) => {
            setReady(true);
            event.target.setVolume(volumeRef.current);
            if (pendingSongRef.current) {
              event.target.cueVideoById(pendingSongRef.current);
              if (pendingPlayRef.current) {
                event.target.playVideo();
              }
            }
          },
          onStateChange: (event: any) => {
            if (event.data === 1) onPlayingChange(true);
            if (event.data === 2 || event.data === 0) onPlayingChange(false);
          },
        },
      });
    }

    if (window.YT?.Player) {
      init();
      return;
    }

    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      init();
    };
  }, [onPlayingChange]);

  useImperativeHandle(ref, () => ({
    playSong(songId: string) {
      pendingSongRef.current = songId;
      pendingPlayRef.current = true;
      if (!playerRef.current) return;
      const currentId = playerRef.current.getVideoData?.()?.video_id;
      if (currentId && currentId !== songId) {
        playerRef.current.loadVideoById(songId);
      } else if (currentId === songId) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.loadVideoById(songId);
      }
    },
    pause() {
      pendingPlayRef.current = false;
      playerRef.current?.pauseVideo();
    },
    resume() {
      pendingPlayRef.current = true;
      playerRef.current?.playVideo();
    },
    setVolume(volume: number) {
      volumeRef.current = Math.round(volume * 100);
      playerRef.current?.setVolume(volumeRef.current);
    },
    getCurrentSongId() {
      return playerRef.current?.getVideoData?.()?.video_id ?? pendingSongRef.current;
    },
  }), [ready]);

  return (
    <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden>
      <div id="hidden-yt-player" />
    </div>
  );
});

export default HiddenPlayer;
