import { listLeads } from "@/lib/db";
import LeadsTable from "@/components/dashboard/LeadsTable";

export default async function LeadsPage() {
  const leads = await listLeads();

  return (
    <div>
      <h1 className="font-display text-3xl font-800 text-forest-dark">
        Leads
      </h1>
      <p className="mt-1 text-ink/60">
        New consultation requests from the site. Add the quick calendar link
        to loneoakhico@yahoo.com, then convert once scheduled.
      </p>
      <div className="mt-6">
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
