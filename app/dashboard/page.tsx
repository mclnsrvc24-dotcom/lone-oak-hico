import Link from "next/link";
import { listLeads, listCustomers, listTikTokPosts } from "@/lib/db";

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string | number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-forest-dark/10 bg-white p-6 hover:border-forest/40"
    >
      <p className="font-display text-sm font-600 uppercase tracking-wide text-ink/50">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl font-800 text-forest-dark">
        {value}
      </p>
    </Link>
  );
}

export default async function DashboardOverview() {
  const [leads, customers, tiktokPosts] = await Promise.all([
    listLeads(),
    listCustomers(),
    listTikTokPosts(),
  ]);

  const newLeads = leads.filter((l) => l.status === "new").length;
  const activeCustomers = customers.filter((c) => c.active).length;
  const ideasBacklog = tiktokPosts.filter((p) => p.status === "idea").length;
  const plannedPosts = tiktokPosts.filter(
    (p) => p.status === "planned" || p.status === "filmed"
  ).length;

  return (
    <div>
      <h1 className="font-display text-3xl font-800 text-forest-dark">
        Overview
      </h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New Leads" value={newLeads} href="/dashboard/leads" />
        <StatCard
          label="Active Customers"
          value={activeCustomers}
          href="/dashboard/customers"
        />
        <StatCard
          label="TikTok Idea Backlog"
          value={ideasBacklog}
          href="/dashboard/tiktok"
        />
        <StatCard
          label="TikTok Planned / Filmed"
          value={plannedPosts}
          href="/dashboard/tiktok"
        />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-forest-dark/10 bg-white p-6">
          <h2 className="font-display text-lg font-700 text-forest-dark">
            Latest leads
          </h2>
          <ul className="mt-4 space-y-3">
            {leads.slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-center justify-between text-sm">
                <span>{l.name}</span>
                <span className="text-ink/50">{l.status}</span>
              </li>
            ))}
            {leads.length === 0 && (
              <p className="text-sm text-ink/50">No leads yet.</p>
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-forest-dark/10 bg-white p-6">
          <h2 className="font-display text-lg font-700 text-forest-dark">
            Next up on TikTok
          </h2>
          <ul className="mt-4 space-y-3">
            {tiktokPosts.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span>{p.idea}</span>
                <span className="text-ink/50">{p.status}</span>
              </li>
            ))}
            {tiktokPosts.length === 0 && (
              <p className="text-sm text-ink/50">No content planned yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
