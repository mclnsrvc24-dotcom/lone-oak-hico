import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-forest-dark/10 bg-bone/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-800 tracking-tight text-forest-dark">
          LONE OAK <span className="text-oak">HOME IMPROVEMENT CO.</span>
        </Link>
        <nav className="hidden items-center gap-8 font-display text-sm font-600 uppercase tracking-wide text-forest-dark md:flex">
          <a href="/#services" className="hover:text-oak">Services</a>
          <a href="/#pricing" className="hover:text-oak">Pricing</a>
          <a href="/#area" className="hover:text-oak">Service Area</a>
          <Link
            href="/request-service"
            className="rounded-md bg-forest px-4 py-2 text-bone hover:bg-forest-dark"
          >
            Get a Quote
          </Link>
        </nav>
        <Link
          href="/request-service"
          className="rounded-md bg-forest px-3 py-2 text-sm text-bone md:hidden"
        >
          Get a Quote
        </Link>
      </div>
    </header>
  );
}
