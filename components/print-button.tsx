"use client";

export function PrintButton({ label = "Print results" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-black/15 px-6 py-3.5 text-[13px] font-semibold transition hover:bg-white print:hidden"
    >
      {label}
    </button>
  );
}
