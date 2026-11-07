import PublicPage from "@/components/public/GalleryPage";
export { metadata } from "@/components/public/GalleryPage";

// Public anonymous content only. Private forms and actions stay dynamic.
export const dynamic = "force-static";
export const revalidate = 300;

export default function Page() {
  return <PublicPage />;
}
