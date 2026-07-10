const SERVICES = [
  {
    title: "Lawn Mowing Plans",
    body: "Weekly, bi-weekly, or monthly mow + edge + blow, sized to your yard and picked at signup.",
  },
  {
    title: "House Washing",
    body: "Soft-wash exterior cleaning for single-story, two-story, and heavily stained or mold-covered homes.",
  },
  {
    title: "Yard Cleanup",
    body: "Overgrown first cuts, leaf cleanup, weed eating, and bush trimming to get a property back in shape.",
  },
  {
    title: "Mulch Installation",
    body: "Fresh mulch installed by the cubic yard for beds and borders.",
  },
  {
    title: "Driveways, Sidewalks & Patios",
    body: "Add-on pressure washing for driveways, sidewalks, and patios alongside a house wash.",
  },
  {
    title: "Gutter Whitening",
    body: "Brightens streaked gutters as an add-on to any house wash.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-forest/5 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl font-800 text-forest-dark md:text-4xl">
          What We Do
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-xl border border-forest-dark/10 bg-white p-6"
            >
              <h3 className="font-display text-lg font-700 text-forest-dark">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-ink/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
