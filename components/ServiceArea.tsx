import { SERVICE_AREA } from "@/lib/pricing";

export default function ServiceArea() {
  return (
    <section id="area" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="font-display text-3xl font-800 text-forest-dark md:text-4xl">
        Service Area
      </h2>
      <p className="mt-4 max-w-2xl text-ink/70">
        {SERVICE_AREA.blurb} If you&apos;re near Killeen, Pflugerville, or
        Temple, we&apos;ve likely already got a route nearby.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {SERVICE_AREA.cities.map((city) => (
          <span
            key={city}
            className="rounded-full border border-forest/30 bg-forest/5 px-4 py-2 font-display text-sm font-600 text-forest-dark"
          >
            {city}
          </span>
        ))}
      </div>
    </section>
  );
}
