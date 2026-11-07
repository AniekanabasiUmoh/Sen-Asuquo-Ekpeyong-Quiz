import PublicPage from "@/components/public/SchedulePage";
export { metadata } from "@/components/public/SchedulePage";

// Public anonymous content only. Private forms and actions stay dynamic.
export const dynamic = "force-static";
export const revalidate = 300;

export default function Page() {
  return <PublicPage />;
}
