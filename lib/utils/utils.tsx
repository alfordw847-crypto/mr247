"use client";

import { useEffect, useRef } from "react";

interface YouTubePlayerProps {
  videoId: string;
  onEnd: () => void;
}

declare global {
  interface Window {
    YT: any;
  }
}

export default function YouTubePlayer({ videoId, onEnd }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube API only once
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    const interval = setInterval(() => {
      if (window.YT && window.YT.Player && containerRef.current) {
        clearInterval(interval);
        if (!playerRef.current) {
          playerRef.current = new window.YT.Player(containerRef.current, {
            videoId,
            width: "100%",
            height: "360",
            playerVars: {
              autoplay: 1,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              disablekb: 1,
            },
            events: {
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  onEnd();
                }
              },
            },
          });
        } else {
          playerRef.current.loadVideoById(videoId);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      // Destroy player safely
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, onEnd]);

  return <div ref={containerRef} />;
}

export function getYouTubeId(url: string) {
  const regExp = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/;
  const match = url.match(regExp);
  return match ? match[1] : "";
}
