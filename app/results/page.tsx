import PublicPage from "@/components/public/ResultsPage";
export { metadata } from "@/components/public/ResultsPage";

// Public anonymous content only. Private forms and actions stay dynamic.
export const dynamic = "force-static";
export const revalidate = 30;

export default function Page() {
  return <PublicPage />;
}
