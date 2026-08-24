"use client";

import Link from "next/link";
import { useActionState } from "react";

import { FormError, FormNotice, Input, SubmitButton } from "@/components/form";

import { requestPasswordReset, signIn, signUp, type AuthState } from "./actions";

const EMPTY: AuthState = {};

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, EMPTY);

  return (
    <form action={action} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <FormError message={state.error} />

      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@school.edu.ng"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
        <SubmitButton pending={pending}>Sign in</SubmitButton>
        <Link
          href="/forgot-password"
          className="text-[13px] font-semibold text-primary/60 underline-offset-4 hover:underline"
        >
          Forgotten your password?
        </Link>
      </div>

      <p className="pt-2 text-[14px] text-primary/60">
        Registering a school for the first time?{" "}
        <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, EMPTY);

  return (
    <form action={action} className="space-y-5">
      <FormError message={state.error} />
      <FormNotice message={state.notice} />

      <Input
        label="Your full name"
        name="full_name"
        autoComplete="name"
        required
        hint="The person who will coordinate the school's participation."
      />
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        hint="Confirmations and official communications go to this address."
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="At least 8 characters."
      />
      <Input
        label="Confirm password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
      />

      <div className="pt-1">
        <SubmitButton pending={pending}>Create account</SubmitButton>
      </div>

      <p className="pt-2 text-[14px] text-primary/60">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, EMPTY);

  return (
    <form action={action} className="space-y-5">
      <FormError message={state.error} />
      <FormNotice message={state.notice} />

      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
      />

      <div className="pt-1">
        <SubmitButton pending={pending}>Send reset link</SubmitButton>
      </div>

      <p className="pt-2 text-[14px] text-primary/60">
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
