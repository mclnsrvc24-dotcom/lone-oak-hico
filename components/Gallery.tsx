import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

// The homepage renders statically at build time, so this fs read happens
// once during `next build` (on Vercel's build machine, which has the full
// project checkout) — not per-request, where public/ wouldn't be available.
const CATEGORIES = [
  { key: "lawns", label: "Lawns" },
  { key: "mulch-beds", label: "Mulch Beds" },
];

function listImages(categoryKey: string): string[] {
  const dir = path.join(process.cwd(), "public", "gallery", categoryKey);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort();
  } catch {
    return [];
  }
}

export default function Gallery() {
  const sections = CATEGORIES.map((c) => ({ ...c, images: listImages(c.key) }));
  const hasAnyImages = sections.some((s) => s.images.length > 0);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="font-display text-3xl font-800 text-forest-dark md:text-4xl">
        Recent Work
      </h2>

      {!hasAnyImages && (
        <p className="mt-2 max-w-2xl text-ink/70">
          Photos coming soon — check back for before/after shots from around
          Killeen, Pflugerville, and Temple.
        </p>
      )}

      {sections.map(
        (s) =>
          s.images.length > 0 && (
            <div key={s.key} className="mt-10 first:mt-8">
              <h3 className="font-display text-lg font-700 text-forest-dark">
                {s.label}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {s.images.map((img) => (
                  <div
                    key={img}
                    className="relative aspect-square overflow-hidden rounded-xl border border-forest-dark/10"
                  >
                    <Image
                      src={`/gallery/${s.key}/${img}`}
                      alt={`${s.label} — Lone Oak Home Improvement Co.`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 25vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </section>
  );
}
