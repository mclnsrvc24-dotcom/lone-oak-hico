import Link from "next/link";

const LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/tiktok", label: "TikTok" },
  { href: "/dashboard/pricing", label: "Pricing Sheet" },
];

export default function DashboardNav() {
  return (
    <header className="border-b border-forest-dark/10 bg-forest-dark text-bone">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/dashboard" className="font-display text-lg font-800">
          LONE OAK <span className="text-gold">DASHBOARD</span>
        </Link>
        <nav className="flex flex-wrap gap-1 font-display text-sm font-600 uppercase tracking-wide">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 hover:bg-bone/10"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/" className="rounded-md px-3 py-2 text-bone/60 hover:bg-bone/10">
            View Site ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}
