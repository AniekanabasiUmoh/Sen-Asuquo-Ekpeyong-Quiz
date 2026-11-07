import { revalidatePath, updateTag } from "next/cache";

/** Called only after authorized public-content writes in server actions. */
export function revalidatePublicContent(path: string) {
  updateTag("saeac-public");
  revalidatePath(path, "layout");
}
