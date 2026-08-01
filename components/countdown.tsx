"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

/**
 * Live countdown. Renders a stable placeholder on the server and starts
 * ticking after mount, so SSR and client markup never disagree.
 */
export function Countdown({
  targetIso,
  className = "",
  boxClass = "",
  labelClass = "",
  valueClass = "",
}: {
  targetIso: string;
  className?: string;
  boxClass?: string;
  labelClass?: string;
  valueClass?: string;
}) {
  const target = new Date(targetIso).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: Array<[string, number | null]> = [
    ["Days", parts?.days ?? null],
    ["Hours", parts?.hours ?? null],
    ["Minutes", parts?.minutes ?? null],
    ["Seconds", parts?.seconds ?? null],
  ];

  return (
    <div className={`flex gap-3 sm:gap-4 ${className}`}>
      {units.map(([label, value]) => (
        <div key={label} className={`min-w-16 flex-1 text-center sm:min-w-20 ${boxClass}`}>
          <div className={`tabular-nums ${valueClass}`}>
            {value === null ? "––" : String(value).padStart(2, "0")}
          </div>
          <div className={labelClass}>{label}</div>
        </div>
      ))}
    </div>
  );
}
