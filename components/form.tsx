/**
 * Form primitives for the portal.
 *
 * Kept deliberately plain so they inherit the site's existing look: the navy
 * #003090 / gold #f0a800 pairing, the pill buttons and the 28px radius the
 * public pages already use. No new visual language is introduced here.
 *
 * Accessibility notes that matter and are easy to lose:
 *   * every input is label-associated by id, never placeholder-only
 *   * errors are tied to their input via aria-describedby and aria-invalid
 *   * the error summary takes focus on submit so a screen reader announces it
 */
"use client";

import { forwardRef } from "react";

const FIELD =
  "w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px] " +
  "outline-none transition placeholder:text-[#003090]/30 " +
  "focus:border-[#003090] focus:ring-2 focus:ring-[#003090]/20 " +
  "disabled:cursor-not-allowed disabled:bg-black/[0.03] " +
  "aria-[invalid=true]:border-[#f44423] aria-[invalid=true]:ring-[#f44423]/20";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

export function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  children,
}: FieldShellProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[13px] font-semibold text-[#003090]"
      >
        {label}
        {required ? (
          <span className="ml-1 text-[#f44423]" aria-hidden="true">
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[12px] text-[#003090]/50">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-[12px] font-semibold text-[#f44423]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, required, className, ...rest },
  ref,
) {
  const fieldId = id ?? rest.name ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
    >
      <input
        ref={ref}
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint && `${fieldId}-hint`, error && `${fieldId}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={`${FIELD} ${className ?? ""}`}
        {...rest}
      />
    </FieldShell>
  );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
};

export function Select({
  label,
  hint,
  error,
  options,
  placeholder,
  id,
  required,
  ...rest
}: SelectProps) {
  const fieldId = id ?? rest.name ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
    >
      <select
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint && `${fieldId}-hint`, error && `${fieldId}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={FIELD}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Textarea({
  label,
  hint,
  error,
  id,
  required,
  ...rest
}: TextareaProps) {
  const fieldId = id ?? rest.name ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
    >
      <textarea
        id={fieldId}
        required={required}
        rows={rest.rows ?? 3}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint && `${fieldId}-hint`, error && `${fieldId}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={FIELD}
        {...rest}
      />
    </FieldShell>
  );
}

export function Checkbox({
  label,
  hint,
  id,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
}) {
  const fieldId = id ?? rest.name ?? "checkbox";
  return (
    <div className="flex gap-3">
      <input
        type="checkbox"
        id={fieldId}
        className="mt-0.5 h-5 w-5 flex-none rounded border-black/25 accent-[#003090]"
        aria-describedby={hint ? `${fieldId}-hint` : undefined}
        {...rest}
      />
      <div>
        <label htmlFor={fieldId} className="text-[14px] font-semibold text-[#003090]">
          {label}
        </label>
        {hint ? (
          <p id={`${fieldId}-hint`} className="mt-0.5 text-[12px] leading-relaxed text-[#003090]/55">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function SubmitButton({
  children,
  pending,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending || rest.disabled}
      aria-busy={pending || undefined}
      className={
        "rounded-full bg-[#f0a800] px-7 py-3.5 text-[13px] font-bold text-[#003090] " +
        "transition hover:bg-[#003090] hover:text-white " +
        "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-[#f0a800] " +
        "disabled:hover:text-[#003090] " +
        className
      }
      {...rest}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

/** Error banner. role="alert" so it is announced when it appears. */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-2xl border border-[#f44423]/30 bg-[#f44423]/5 px-4 py-3 text-[13px] font-semibold text-[#c1300f]"
    >
      {message}
    </div>
  );
}

export function FormNotice({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="rounded-2xl border border-[#2dc653]/30 bg-[#2dc653]/8 px-4 py-3 text-[13px] font-semibold text-[#155d27]"
    >
      {message}
    </div>
  );
}
