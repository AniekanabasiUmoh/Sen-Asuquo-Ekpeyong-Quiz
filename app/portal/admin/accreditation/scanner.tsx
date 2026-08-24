"use client";

import jsQR from "jsqr";
import { useActionState, useEffect, useRef, useState } from "react";

import { checkInCode, type CheckInState } from "./actions";

const EMPTY: CheckInState = {};

/**
 * In-browser QR scanner, Phase 4 sprint 4.3.
 *
 * Scanner is "staff phone camera, in-browser" per the agreed scope — no
 * dedicated hardware, no app install. getUserMedia() plus jsQR reading frames
 * off a hidden canvas is the whole mechanism; every modern phone browser
 * supports both. HTTPS is required for camera access, which the deployed site
 * already is.
 *
 * Camera access needs a user gesture to start on iOS Safari, so this opens on
 * a button press rather than on mount.
 */
export function AccreditationScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [state, action, pending] = useActionState(checkInCode, EMPTY);
  const [lastCode, setLastCode] = useState<string | null>(null);

  async function start() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
    } catch {
      setCameraError(
        "Could not access the camera. Check that this site has camera permission, and that you are on HTTPS.",
      );
    }
  }

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }

  useEffect(() => {
    if (!scanning) return;
    let raf: number;

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const found = jsQR(frame.data, frame.width, frame.height);
          if (found?.data && found.data !== lastCode && !pending) {
            setLastCode(found.data);
            const fd = new FormData();
            fd.set("code", found.data);
            // navigator.vibrate is unavailable on iOS Safari; a no-op there
            // is fine, this is a courtesy, not the confirmation mechanism.
            navigator.vibrate?.(80);
            void action(fd);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- action from useActionState is stable across renders and deliberately left out of the deps; scanning/lastCode/pending are the only values tick() actually needs to stay fresh on
  }, [scanning, lastCode, pending]);

  useEffect(() => stop, []);

  // Allow scanning the same code again after a short pause, so a badge
  // waved back in front of the camera by mistake does not lock up silently.
  useEffect(() => {
    if (!lastCode) return;
    const t = setTimeout(() => setLastCode(null), 2500);
    return () => clearTimeout(t);
  }, [lastCode, state]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-[28px] bg-black">
        <div className="relative aspect-square w-full sm:aspect-video">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`h-full w-full object-cover ${scanning ? "" : "opacity-0"}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {!scanning ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="text-[13px] text-white/70">
                Point the camera at an accreditation QR code to check someone in.
              </p>
              <button
                type="button"
                onClick={() => void start()}
                className="rounded-full bg-gold px-7 py-3.5 text-[13px] font-bold text-primary transition hover:bg-white"
              >
                Start scanning
              </button>
            </div>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-8 rounded-3xl border-2 border-white/50"
              />
              <button
                type="button"
                onClick={stop}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-5 py-2.5 text-[12px] font-semibold text-white backdrop-blur transition hover:bg-black/80"
              >
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      {cameraError ? (
        <p className="mt-4 text-[13px] font-semibold text-red-ink">{cameraError}</p>
      ) : null}

      {state.result ? (
        <div
          role="status"
          className={
            "mt-5 rounded-[24px] p-6 " +
            (state.result.ok
              ? "bg-grass/12 text-forest"
              : "bg-red/10 text-red-ink")
          }
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-70">
            {state.result.ok ? "Checked in" : "Not checked in"}
          </p>
          <p className="mt-2 font-display text-xl font-bold">
            {state.result.holderName ?? "Unknown"}
          </p>
          <p className="mt-1 text-[13px]">
            {state.result.detail}
            {state.result.detail ? " · " : ""}
            {state.result.message}
          </p>
        </div>
      ) : state.error ? (
        <p className="mt-5 rounded-[24px] bg-red/10 p-6 text-[13px] font-semibold text-red-ink">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
