import Link from "next/link";
import { SERVICE_AREA } from "@/lib/pricing";

export default function Hero() {
  return (
    <section className="bg-forest-dark text-bone">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="font-display text-sm font-600 uppercase tracking-[0.2em] text-gold">
          {SERVICE_AREA.cities.join(" · ")}
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-800 leading-tight md:text-6xl">
          Reliable lawn care &amp; house washing, done right every visit.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-bone/85">
          Weekly, bi-weekly, and monthly mowing plans plus full-service house
          washing. {SERVICE_AREA.blurb}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/request-service"
            className="rounded-md bg-gold px-6 py-3 font-display font-700 uppercase tracking-wide text-ink hover:bg-gold-light"
          >
            Request a Consultation
          </Link>
          <a
            href="#pricing"
            className="rounded-md border border-bone/30 px-6 py-3 font-display font-700 uppercase tracking-wide text-bone hover:bg-bone/10"
          >
            See Pricing
          </a>
        </div>
      </div>
    </section>
  );
}
