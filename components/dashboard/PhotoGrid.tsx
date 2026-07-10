import Image from "next/image";
import type { PropertyPhoto } from "@/lib/db";

export default function PhotoGrid({ photos }: { photos: PropertyPhoto[] }) {
  if (photos.length === 0) {
    return <p className="text-sm text-ink/50">No photos uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((p) => (
        <a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className="group relative block aspect-square overflow-hidden rounded-lg border border-forest-dark/10"
        >
          <Image
            src={p.url}
            alt={p.caption ?? "Property photo"}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="200px"
          />
        </a>
      ))}
    </div>
  );
}
