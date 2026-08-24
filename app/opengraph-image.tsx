import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The card every shared SAEAC link renders as — WhatsApp, Facebook, X, and
 * anywhere else that reads Open Graph. Without this the site shares as a bare
 * grey box, which matters more than usual here: the primary audience reaches
 * this site through links forwarded between principals, teachers and parents
 * on mobile, so the share card is the first impression far more often than
 * the homepage is.
 *
 * Drawn rather than photographed, for two reasons. A JPEG of students would
 * need a crop that survives every platform's aspect handling, and the type
 * would be baked in at one size. Drawing it keeps the four-colour ribbon and
 * the brand palette exact, and keeps the file a few KB.
 *
 * Lama Sans is loaded from ttf copies in app/_og-fonts/. Satori (which renders
 * this) reads ttf/woff but not the woff2 the browser build ships, so the two
 * weights used here are converted at build-prep time rather than at runtime.
 * They are the same licensed files, in a second container.
 */
export const alt =
  "SAEAC — Senator Asuquo Ekpenyong Academic Championship. Igniting Minds. Inspiring Excellence. Building Leaders.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Kept in step with the tokens in globals.css by hand — Satori resolves no CSS
// variables, so these must be literals.
const PRIMARY = "#003090";
const INK = "#06122f";
const CREAM = "#faf6ee";
const RED = "#f03018";
const GOLD = "#f0a800";
const ORANGE = "#fe6c03";

export default async function Image() {
  const [extraBold, semiBold] = await Promise.all([
    readFile(join(process.cwd(), "app/_og-fonts/LamaSans-ExtraBold.ttf")),
    readFile(join(process.cwd(), "app/_og-fonts/LamaSans-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          fontFamily: "Lama Sans",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Deep-blue wash, echoing the hero treatment. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            display: "flex",
            background: `linear-gradient(135deg, ${INK} 0%, ${PRIMARY} 100%)`,
          }}
        />

        {/* The four-colour ribbon, top edge. */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", height: 12 }}>
          <div style={{ flex: 1, background: RED }} />
          <div style={{ flex: 1, background: ORANGE }} />
          <div style={{ flex: 1, background: PRIMARY }} />
          <div style={{ flex: 1, background: GOLD }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: GOLD,
              textTransform: "uppercase",
            }}
          >
            Cross River South
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 104,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              color: CREAM,
            }}
          >
            SÆAC
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 38,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "rgba(250,246,238,0.82)",
              maxWidth: 900,
            }}
          >
            Senator Asuquo Ekpenyong Academic Championship
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 27,
              fontWeight: 600,
              color: "rgba(250,246,238,0.62)",
            }}
          >
            Igniting Minds. Inspiring Excellence. Building Leaders.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: GOLD,
              color: PRIMARY,
              fontSize: 25,
              fontWeight: 800,
              padding: "16px 34px",
              borderRadius: 999,
            }}
          >
            saeac.org
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Lama Sans", data: extraBold, weight: 800, style: "normal" },
        { name: "Lama Sans", data: semiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
