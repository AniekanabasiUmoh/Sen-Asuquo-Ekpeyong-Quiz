import PublicPage from "@/components/public/SchedulePage";
import { notFound } from "next/navigation";
import { parseFilterKey } from "@/lib/public-filters";
export { metadata } from "@/components/public/SchedulePage";

export const dynamic = "force-static";
export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

export default async function Page({
  params,
}: {
  params: Promise<{ filters: string }>;
}) {
  const { filters: key } = await params;
  const filters = parseFilterKey(key, ["stage", "group", "lga", "view"]);
  if (!filters) notFound();
  return <PublicPage filters={filters} />;
}
