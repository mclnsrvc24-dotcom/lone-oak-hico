"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/db";
import { buildGoogleCalendarLink } from "@/lib/calendar";

const STATUSES: Lead["status"][] = [
  "new",
  "contacted",
  "scheduled",
  "converted",
  "declined",
];

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function setStatus(id: number, status: Lead["status"]) {
    setBusyId(id);
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function convert(id: number) {
    setBusyId(id);
    const res = await fetch(`/api/leads/${id}/convert`, { method: "POST" });
    setBusyId(null);
    if (res.ok) router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-forest-dark/10 bg-white">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="border-b border-forest-dark/10 bg-forest/5 text-left font-display uppercase tracking-wide text-ink/60">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Preferred</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-forest-dark/10">
          {leads.map((l) => {
            const calendarLink = buildGoogleCalendarLink({
              title: `Consultation: ${l.name} — ${l.service_type}`,
              details: [
                `Service: ${l.service_type}`,
                l.frequency ? `Frequency: ${l.frequency}` : null,
                `Phone: ${l.phone ?? "n/a"}`,
                `Email: ${l.email}`,
                l.notes ? `Notes: ${l.notes}` : null,
              ]
                .filter(Boolean)
                .join("\n"),
              location: [l.address, l.city].filter(Boolean).join(", "),
              date: l.preferred_date,
            });

            return (
              <tr key={l.id}>
                <td className="px-4 py-3 font-600">{l.name}</td>
                <td className="px-4 py-3 text-ink/70">
                  <div>{l.email}</div>
                  <div>{l.phone}</div>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  <div>{l.service_type}</div>
                  <div className="text-xs text-ink/50">{l.frequency}</div>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  <div>{l.preferred_date ?? "—"}</div>
                  <div className="text-xs text-ink/50">
                    {l.preferred_time_window}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={l.status}
                    disabled={busyId === l.id}
                    onChange={(e) =>
                      setStatus(l.id, e.target.value as Lead["status"])
                    }
                    className="rounded-md border border-forest-dark/20 bg-white px-2 py-1"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={calendarLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border border-forest-dark/20 px-2 py-1 text-xs hover:bg-forest/5"
                    >
                      + Calendar
                    </a>
                    {l.status !== "converted" && (
                      <button
                        disabled={busyId === l.id}
                        onClick={() => convert(l.id)}
                        className="rounded-md bg-forest px-2 py-1 text-xs text-bone hover:bg-forest-dark disabled:opacity-60"
                      >
                        Convert to customer
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {leads.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                No leads yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
