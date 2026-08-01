"use client";

import { useState } from "react";

/** Single-open accordion, matching the reference's FAQ block. */
export function Accordion({
  items,
  className = "",
  itemClass = "",
  questionClass = "",
  answerClass = "",
}: {
  items: ReadonlyArray<{ q: string; a: string }>;
  className?: string;
  itemClass?: string;
  questionClass?: string;
  answerClass?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={className}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={itemClass}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between gap-6 text-left ${questionClass}`}
            >
              <span>{item.q}</span>
              <span
                className="relative h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                <span
                  className={`absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
                    isOpen ? "scale-y-0" : "scale-y-100"
                  }`}
                />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className={answerClass}>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
