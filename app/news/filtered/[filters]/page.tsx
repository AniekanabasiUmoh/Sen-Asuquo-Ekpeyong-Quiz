import { redirect } from "next/navigation";

export const dynamic = "force-static";
export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

export default function Page() {
  redirect("/news");
}
