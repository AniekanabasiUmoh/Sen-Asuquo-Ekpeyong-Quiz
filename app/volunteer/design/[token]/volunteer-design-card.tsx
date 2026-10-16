"use client";

import { useEffect, useRef, useState } from "react";

const WIDTH = 1080;
const HEIGHT = 1920;

export function VolunteerDesignCard({
  fullName,
  photoUrl,
}: {
  fullName: string;
  photoUrl: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    const image = new Image();

    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) {
        setError(true);
        return;
      }

      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      drawCover(context, image, WIDTH, HEIGHT);
      drawBranding(context, fullName);

      canvas.toBlob(
        (blob) => {
          if (cancelled) return;
          if (!blob) {
            setError(true);
            return;
          }
          objectUrl = URL.createObjectURL(blob);
          setPreviewUrl(objectUrl);
        },
        "image/jpeg",
        0.9,
      );
    };

    image.onerror = () => setError(true);
    image.src = photoUrl;

    return () => {
      cancelled = true;
      image.src = "";
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fullName, photoUrl]);

  const fileName =
    "SAEAC-Change-Maker-" +
    fullName.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") +
    ".jpg";

  return (
    <section className="mx-auto w-full max-w-[360px]">
      <div className="overflow-hidden rounded-[26px] border border-black/10 bg-white p-2 shadow-[0_18px_55px_rgba(0,25,75,0.14)]">
        {previewUrl ? (
          // A browser-generated Blob URL is already optimized and cannot be
          // passed through the Next image optimizer.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={"Shareable SAEAC Change Maker graphic for " + fullName}
            className="block h-auto w-full rounded-[20px]"
          />
        ) : (
          <div className="flex aspect-[9/16] items-center justify-center rounded-[20px] bg-primary/5 px-6 text-center">
            <p className="text-[13px] leading-relaxed text-primary/60">
              {error ? "We could not prepare this image. Please open your link again or ask the Committee for a fresh one." : "Preparing your graphic…"}
            </p>
          </div>
        )}
      </div>

      <a
        href={previewUrl ?? undefined}
        download={fileName}
        aria-disabled={!previewUrl}
        tabIndex={previewUrl ? 0 : -1}
        className={
          "mt-5 flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-center text-[13px] font-bold transition " +
          (previewUrl
            ? "bg-gold text-primary hover:bg-primary hover:text-white"
            : "pointer-events-none bg-primary/10 text-primary/35")
        }
      >
        Download your WhatsApp graphic
      </a>
      <p className="mt-3 text-center text-[12px] leading-relaxed text-primary/50">
        On a phone, you can also press and hold the preview image to save it.
      </p>
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </section>
  );
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const cropWidth = width / scale;
  const cropHeight = height / scale;
  const cropX = (image.naturalWidth - cropWidth) / 2;
  const cropY = (image.naturalHeight - cropHeight) / 2;

  context.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    width,
    height,
  );

  const topShade = context.createLinearGradient(0, 0, 0, 620);
  topShade.addColorStop(0, "rgba(0, 10, 37, 0.82)");
  topShade.addColorStop(1, "rgba(0, 10, 37, 0)");
  context.fillStyle = topShade;
  context.fillRect(0, 0, width, 620);

  const bottomShade = context.createLinearGradient(0, 980, 0, height);
  bottomShade.addColorStop(0, "rgba(0, 10, 37, 0)");
  bottomShade.addColorStop(0.36, "rgba(0, 10, 37, 0.78)");
  bottomShade.addColorStop(1, "rgba(0, 10, 37, 0.98)");
  context.fillStyle = bottomShade;
  context.fillRect(0, 980, width, height - 980);
}

function drawBranding(context: CanvasRenderingContext2D, fullName: string) {
  context.textAlign = "left";
  context.textBaseline = "alphabetic";

  context.fillStyle = "#f0a800";
  context.fillRect(72, 92, 170, 14);

  context.fillStyle = "#ffffff";
  context.font = "900 92px Arial, sans-serif";
  context.fillText("SAEAC", 72, 228);
  context.font = "700 28px Arial, sans-serif";
  context.fillText("SENATOR ASUQUO EKPENYONG", 75, 278);
  context.font = "600 25px Arial, sans-serif";
  context.fillText("ACADEMIC CHAMPIONSHIP", 75, 318);

  context.fillStyle = "#f0a800";
  context.font = "800 37px Arial, sans-serif";
  context.fillText("2026  /  CHANGE MAKER", 72, 1390);

  context.fillStyle = "#ffffff";
  context.font = "900 88px Arial, sans-serif";
  context.fillText("PROUD TO SERVE", 72, 1510);

  context.fillStyle = "#ffffff";
  context.font = "700 65px Arial, sans-serif";
  const lines = wrapName(context, fullName, 900);
  lines.forEach((line, index) => {
    context.fillText(line, 75, 1625 + index * 78);
  });

  context.fillStyle = "#f0a800";
  context.fillRect(72, 1782, 936, 4);
  context.fillStyle = "rgba(255, 255, 255, 0.92)";
  context.font = "500 29px Arial, sans-serif";
  context.fillText("Helping shape a brighter future for our students.", 72, 1844);
}

function wrapName(
  context: CanvasRenderingContext2D,
  fullName: string,
  maxWidth: number,
) {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    if (current && context.measureText(candidate).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  if (lines.length <= 2) return lines;

  const second = lines.slice(1).join(" ");
  let shortened = second;
  while (shortened && context.measureText(shortened + "…").width > maxWidth) {
    shortened = shortened.slice(0, -1).trimEnd();
  }
  return [lines[0], shortened + "…"];
}
