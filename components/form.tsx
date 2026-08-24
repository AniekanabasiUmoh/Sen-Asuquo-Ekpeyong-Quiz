/**
 * Form primitives for the portal.
 *
 * Kept deliberately plain so they inherit the site's existing look: the
 * primary/gold pairing, the pill buttons and the 28px radius the public
 * pages already use. No new visual language is introduced here.
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
  "outline-none transition placeholder:text-primary/30 " +
  "focus:border-primary focus:ring-2 focus:ring-primary/20 " +
  "disabled:cursor-not-allowed disabled:bg-black/[0.03] " +
  "aria-[invalid=true]:border-red aria-[invalid=true]:ring-red/20";

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
        className="block text-[13px] font-semibold text-primary"
      >
        {label}
        {required ? (
          <span className="ml-1 text-red" aria-hidden="true">
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[12px] text-primary/50">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-[12px] font-semibold text-red"
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
        className="mt-0.5 h-5 w-5 flex-none rounded border-black/25 accent-primary"
        aria-describedby={hint ? `${fieldId}-hint` : undefined}
        {...rest}
      />
      <div>
        <label htmlFor={fieldId} className="text-[14px] font-semibold text-primary">
          {label}
        </label>
        {hint ? (
          <p id={`${fieldId}-hint`} className="mt-0.5 text-[12px] leading-relaxed text-primary/55">
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
        "rounded-full bg-gold px-7 py-3.5 text-[13px] font-bold text-primary " +
        "transition hover:bg-primary hover:text-white " +
        "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-gold " +
        "disabled:hover:text-primary " +
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
      className="rounded-2xl border border-red/30 bg-red/5 px-4 py-3 text-[13px] font-semibold text-red-ink"
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
      className="rounded-2xl border border-grass/30 bg-grass/8 px-4 py-3 text-[13px] font-semibold text-forest"
    >
      {message}
    </div>
  );
}
