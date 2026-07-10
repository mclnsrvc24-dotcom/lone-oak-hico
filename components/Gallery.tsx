const CATEGORIES = ["Mowing", "House Washing", "Yard Cleanup", "Mulch"];

export default function Gallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="font-display text-3xl font-800 text-forest-dark md:text-4xl">
        Recent Work
      </h2>
      <p className="mt-2 max-w-2xl text-ink/70">
        Photos coming soon — check back for before/after shots from around
        Killeen, Pflugerville, and Temple.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {CATEGORIES.map((c) => (
          <div
            key={c}
            className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-forest-dark/20 bg-forest/5 p-4 text-center"
          >
            <span className="font-display text-sm font-600 uppercase tracking-wide text-forest-dark/60">
              {c}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
