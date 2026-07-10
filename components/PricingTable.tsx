import {
  LAWN_SERVICES,
  HOUSE_WASH_SERVICES,
  HOUSE_WASH_ADDONS,
  FREQUENCY_INFO,
  formatRange,
} from "@/lib/pricing";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-forest-dark/10 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

export default function PricingTable() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="font-display text-3xl font-800 text-forest-dark md:text-4xl">
        Pricing
      </h2>
      <p className="mt-2 max-w-2xl text-ink/70">
        Middle-market rates for the Killeen–Pflugerville–Temple area. Final
        price is confirmed at your free consultation based on lot size and
        property condition.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-xl font-700 text-forest-dark">
            Lawn Care
          </h3>
          <ul className="mt-4 divide-y divide-forest-dark/10">
            {Object.entries(LAWN_SERVICES).map(([key, s]) => (
              <li key={key} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="font-600">{s.label}</p>
                  {s.note && (
                    <p className="text-sm text-ink/60">{s.note}</p>
                  )}
                </div>
                <p className="whitespace-nowrap font-display font-700 text-oak">
                  {formatRange(s.range, s.unit)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-lg bg-forest/5 p-4">
            <p className="font-display text-sm font-700 uppercase tracking-wide text-forest-dark">
              Recurring plans
            </p>
            <ul className="mt-2 space-y-1 text-sm text-ink/75">
              {Object.entries(FREQUENCY_INFO).map(([key, f]) => (
                <li key={key}>
                  <span className="font-600">{f.label}:</span> {f.note}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-xl font-700 text-forest-dark">
            House Washing
          </h3>
          <ul className="mt-4 divide-y divide-forest-dark/10">
            {Object.entries(HOUSE_WASH_SERVICES).map(([key, s]) => (
              <li key={key} className="flex items-center justify-between gap-4 py-3">
                <p className="font-600">{s.label}</p>
                <p className="whitespace-nowrap font-display font-700 text-oak">
                  {formatRange(s.range)}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-6 font-display text-sm font-700 uppercase tracking-wide text-forest-dark">
            Add-ons
          </p>
          <ul className="mt-2 divide-y divide-forest-dark/10">
            {Object.entries(HOUSE_WASH_ADDONS).map(([key, s]) => (
              <li key={key} className="flex items-center justify-between gap-4 py-2">
                <p className="text-sm">{s.label}</p>
                <p className="whitespace-nowrap font-display font-700 text-oak">
                  +{formatRange(s.range)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
