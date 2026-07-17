'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Wordmark from './Wordmark';
import { composeBeRealBlob, formatClock, snapshotFrame } from '@/lib/sticker';
import { resolveCurrentAct } from '@/lib/currentAct';
import { savePhoto } from '@/lib/photos';
import { getOwnerId } from '@/lib/ownerId';
import { dayLabels } from '@/data/events';
import { hasUploadedToday, markUploadedToday, todayKey } from '@/lib/dailyLimit';

export default function CameraCapture() {
  const router = useRouter();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const frontShotRef = useRef(null); // frozen selfie frame (canvas)
  const [facing, setFacing] = useState('user'); // start on the front camera
  const [phase, setPhase] = useState('front'); // 'front' → 'back'
  const [frontPreview, setFrontPreview] = useState(null); // data URL for the inset
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);
  const [preview, setPreview] = useState(null); // { blob, url, act, actTime }
  const [saving, setSaving] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (hasUploadedToday()) setBlocked(true);
  }, []);

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
    if (blocked || preview) return;
    startStream(facing);
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [facing, startStream, blocked, preview]);

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

    // Step 1 — grab the selfie, then flip to the back camera.
    if (phase === 'front') {
      const shot = snapshotFrame(video);
      frontShotRef.current = shot;
      setFrontPreview(shot.toDataURL('image/jpeg', 0.7));
      setPhase('back');
      setFacing('environment');
      return;
    }

    // Step 2 — back camera as the main frame, compose the BeReal photo.
    const now = new Date();
    const act = resolveCurrentAct({ now, coords });
    const actTime = formatClock(now);
    const dayLabel = dayLabels[now.toISOString().slice(0, 10)] || null;
    const blob = await composeBeRealBlob({
      back: video,
      front: frontShotRef.current,
      actTitle: act?.title || 'Les Santes',
      actTime,
      dayLabel,
    });
    const url = URL.createObjectURL(blob);
    setPreview({ blob, url, act, actTime, coords });
  }, [coords, phase]);

  const restartCapture = useCallback(() => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
    frontShotRef.current = null;
    setFrontPreview(null);
    setPhase('front');
    setFacing('user');
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
        captureDay: todayKey(),
        coords: preview.coords,
        ownerId: getOwnerId(),
      });
      markUploadedToday();
      URL.revokeObjectURL(preview.url);
      router.push('/galeria');
    } catch (e) {
      if (e?.code === 'daily_limit') {
        markUploadedToday();
        setBlocked(true);
      } else {
        setError(e?.message || 'No hem pogut pujar la foto.');
      }
    } finally {
      setSaving(false);
    }
  }, [preview, router, saving]);

  if (blocked) {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center gap-4 bg-black p-6 text-center text-white">
        <i className="fa-regular fa-circle-check text-5xl text-[#fc4c02]" aria-hidden="true" />
        <p className="text-lg font-semibold">Ja tens la foto d’avui</p>
        <p className="max-w-xs text-sm text-neutral-400">
          Només pots pujar una foto al dia. Torna demà per capturar un nou moment de Les Santes.
        </p>
        <button
          onClick={() => router.push('/galeria')}
          className="mt-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950"
        >
          Veure la galeria
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center gap-4 bg-black p-6 text-center text-white">
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
              onClick={restartCapture}
              className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm text-white"
            >
              <i className="fa-solid fa-rotate-left" aria-hidden="true" />
              Repetir
            </button>
            <button
              onClick={savePreview}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 disabled:opacity-60"
            >
              {saving ? (
                'Desant…'
              ) : (
                <>
                  <i className="fa-solid fa-check" aria-hidden="true" />
                  Desar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFront = phase === 'front';

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div
          className="relative overflow-hidden"
          style={{
            width: 'min(100vw, calc(100dvh * 9 / 16))',
            aspectRatio: '9 / 16',
          }}
        >
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`h-full w-full object-cover ${isFront ? '-scale-x-100' : ''}`}
          />
          {/* Live selfie inset once we're on the back camera (WYSIWYG) */}
          {!isFront && frontPreview && (
            <div className="absolute left-[4%] top-[3.5%] w-[30%] overflow-hidden rounded-2xl border-2 border-white shadow-lg">
              <img
                src={frontPreview}
                alt="Selfie"
                className="aspect-[9/16] w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex items-start justify-between p-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <button
          onClick={() => router.push('/')}
          aria-label="Tancar"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
        <Wordmark size="md" className="drop-shadow" />
        <div className="h-10 w-10" aria-hidden="true" />
      </div>

      {/* Step hint */}
      <div className="pointer-events-none relative z-10 mx-auto mt-3 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur">
        <i
          className={`fa-solid ${isFront ? 'fa-user' : 'fa-mountain-sun'} text-[#fc4c02]`}
          aria-hidden="true"
        />
        {isFront ? '1 · Fes-te un selfie' : '2 · Ara la foto del davant'}
      </div>

      <div className="relative z-10 mt-auto pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <div className="flex items-center justify-center py-6">
          <button
            onClick={capture}
            aria-label={isFront ? 'Fer selfie' : 'Fer foto'}
            className="h-20 w-20 rounded-full bg-[#fc4c02] ring-4 ring-white/30 shadow-lg shadow-black/50 active:scale-95"
          />
        </div>
      </div>
    </div>
  );
}
