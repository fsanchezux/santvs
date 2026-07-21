'use client';

import { useEffect, useRef, useState } from 'react';

// Plays the branding showreel automatically on entering the page. Tries to
// start with sound (allowed when arriving via a user tap); if the browser
// blocks it, falls back to muted autoplay and offers a tap-to-unmute control.
export default function BrandingVideo() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [showUnmute, setShowUnmute] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play()
      .then(() => setShowUnmute(false))
      .catch(() => {
        // Autoplay with sound blocked — retry muted.
        v.muted = true;
        setMuted(true);
        setShowUnmute(true);
        v.play().catch(() => {});
      });
  }, []);

  const enableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    setShowUnmute(false);
    v.play().catch(() => {});
  };

  return (
    <div className="relative flex-1">
      <video
        ref={videoRef}
        src="/branding/carrusel1.mp4"
        className="absolute inset-0 h-full w-full object-contain"
        playsInline
        autoPlay
        loop
        controls
        preload="auto"
      />
      {showUnmute && (
        <button
          onClick={enableSound}
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg backdrop-blur"
        >
          <i className={`fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'}`} aria-hidden="true" />
          Activar so
        </button>
      )}
    </div>
  );
}
