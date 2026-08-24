import Link from "next/link";

/**
 * Shell for the signed-out auth pages.
 *
 * Deliberately narrower and quieter than the public pages: one column, no
 * hero, no navigation to wander off into. The only way out is back to the
 * site or forward through the form.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-5 py-16 sm:py-20">
      {children}
      <p className="mt-10 text-center text-[13px] text-primary/45">
        <Link href="/" className="underline-offset-4 hover:underline">
          Back to the championship site
        </Link>
      </p>
    </main>
  );
}
