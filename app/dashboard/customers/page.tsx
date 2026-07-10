import Link from "next/link";
import { listCustomers } from "@/lib/db";

export default async function CustomersPage() {
  const customers = await listCustomers();

  return (
    <div>
      <h1 className="font-display text-3xl font-800 text-forest-dark">
        Customers
      </h1>
      <p className="mt-1 text-ink/60">
        Every converted lead lands here with service history and photos.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-forest-dark/10 bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="border-b border-forest-dark/10 bg-forest/5 text-left font-display uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Agreed Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-dark/10">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-forest/5">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/customers/${c.id}`}
                    className="font-600 text-forest-dark hover:underline"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  <div>{c.email}</div>
                  <div>{c.phone}</div>
                </td>
                <td className="px-4 py-3 text-ink/70">{c.plan ?? "—"}</td>
                <td className="px-4 py-3 text-ink/70">
                  {c.agreed_price ? `$${c.agreed_price}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      c.active
                        ? "bg-forest/10 text-forest-dark"
                        : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {c.active ? "active" : "inactive"}
                  </span>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
                  No customers yet — convert a lead to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
