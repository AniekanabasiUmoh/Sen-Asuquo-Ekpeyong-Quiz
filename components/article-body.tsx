import Image from "next/image";
import { YouTubeEmbed } from "@/components/video";

/** Render text and explicitly bounded, local editorial media without interpreting HTML. */
export function ArticleBody({ body }: { body: string }) {
  return <div className="space-y-6 text-[16px] leading-[1.8] text-primary/80">{body.split(/\n\s*\n/).map((block, index) => {
    const youtube = block.trim().match(/^\[\[youtube:([A-Za-z0-9_-]{11})\|([^\]\n]{1,180})\]\]$/);
    if (youtube) return <figure key={index}><YouTubeEmbed id={youtube[1]} title={youtube[2]} poster="/img/students-exam.jpg" /><figcaption className="mt-2 text-sm text-primary/65">{youtube[2]}</figcaption></figure>;
    const media = block.trim().match(/^\[\[(image|video):((?:\/news-media\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp|mp4)|\/api\/news-media\/[0-9a-f-]{36}\.webp))\|([^\]\n]{1,180})\]\]$/i);
    if (media) {
      const [, type, src, caption] = media;
      if (type.toLowerCase() === "image" && !src.toLowerCase().endsWith(".mp4")) return <figure key={index}><a href={src} target="_blank" rel="noreferrer"><Image src={src} unoptimized={src.startsWith("/api/news-media/")} width={1200} height={1400} alt={caption} className="h-auto max-h-[85vh] w-full rounded-2xl object-contain" /></a><figcaption className="mt-2 text-sm text-primary/65">{caption} · Select the image to view it in full.</figcaption></figure>;
      if (type.toLowerCase() === "video" && src.toLowerCase().endsWith(".mp4")) {
        const captioned = ["/news-media/saeac-launch.mp4", "/news-media/education-endorsement.mp4", "/news-media/be-the-next-standard.mp4"].includes(src);
        return <figure key={index}><video controls preload="none" className="aspect-video w-full rounded-2xl bg-primary object-contain" aria-label={caption}><source src={src} type="video/mp4" />{captioned ? <track kind="captions" src={src.replace(/\.mp4$/, ".en.vtt")} srcLang="en" label="English (automatic, unreviewed)" /> : null}Your browser does not support video playback.</video><figcaption className="mt-2 text-sm text-primary/65">{caption}{captioned ? " · Automatic English captions may contain errors." : ""}</figcaption></figure>;
      }
    }
    return <p key={index} className="whitespace-pre-wrap">{block}</p>;
  })}</div>;
}
