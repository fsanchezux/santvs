'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Wordmark from './Wordmark';
import { composeStickerBlob, formatClock } from '@/lib/sticker';
import { resolveCurrentAct } from '@/lib/currentAct';
import { savePhoto } from '@/lib/photos';

export default function CameraCapture() {
  const router = useRouter();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facing, setFacing] = useState('environment');
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);
  const [preview, setPreview] = useState(null); // { blob, url, act, actTime }
  const [saving, setSaving] = useState(false);

  const startStream = useCallback(async facingMode => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1440 }, height: { ideal: 1920 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (e) {
      setError(e?.message || 'No hem pogut obrir la càmera.');
    }
  }, []);

  useEffect(() => {
    startStream(facing);
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [facing, startStream]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const capture = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const now = new Date();
    const act = resolveCurrentAct({ now, coords });
    const actTime = formatClock(now);
    const blob = await composeStickerBlob({
      source: video,
      actTitle: act?.title || 'Les Santes',
      actTime,
    });
    const url = URL.createObjectURL(blob);
    setPreview({ blob, url, act, actTime, coords });
  }, [coords]);

  const discardPreview = useCallback(() => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  }, [preview]);

  const savePreview = useCallback(async () => {
    if (!preview || saving) return;
    setSaving(true);
    try {
      await savePhoto({
        blob: preview.blob,
        actId: preview.act?.id || null,
        actTitle: preview.act?.title || null,
        actTime: preview.actTime,
        coords: preview.coords,
      });
      URL.revokeObjectURL(preview.url);
      router.push('/galeria');
    } finally {
      setSaving(false);
    }
  }, [preview, router, saving]);

  if (error) {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center gap-4 bg-black p-6 text-center">
        <p className="text-lg">{error}</p>
        <p className="text-sm text-neutral-400">
          Comprova els permisos de càmera del navegador.
        </p>
        <button onClick={() => router.push('/')} className="rounded-full bg-white px-5 py-2 text-neutral-950">
          Tornar
        </button>
      </div>
    );
  }

  if (preview) {
    return (
      <div className="fixed inset-0 flex flex-col bg-black">
        <img src={preview.url} alt="Previsualització" className="flex-1 object-contain" />
        <div className="pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around gap-4 border-t border-white/10 bg-neutral-950 px-6 py-4">
            <button
              onClick={discardPreview}
              className="rounded-full border border-white/20 px-5 py-2 text-sm"
            >
              Repetir
            </button>
            <button
              onClick={savePreview}
              disabled={saving}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 disabled:opacity-60"
            >
              {saving ? 'Desant…' : 'Desar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative flex items-start justify-between p-4">
        <button
          onClick={() => router.push('/')}
          aria-label="Tancar"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white"
        >
          ✕
        </button>
        <Wordmark size="md" className="text-white drop-shadow" />
        <button
          onClick={() => setFacing(f => (f === 'environment' ? 'user' : 'environment'))}
          aria-label="Canviar càmera"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white"
        >
          ⇋
        </button>
      </div>

      <div className="mt-auto pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-center py-6">
          <button
            onClick={capture}
            aria-label="Fer foto"
            className="h-20 w-20 rounded-full bg-white ring-4 ring-white/40 active:scale-95"
          />
        </div>
      </div>
    </div>
  );
}
