"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceHistoryEntry } from "@/lib/db";

export default function ServiceHistoryPanel({
  customerId,
  history,
}: {
  customerId: number;
  history: ServiceHistoryEntry[];
}) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function addEntry() {
    if (!date || !serviceType) return;
    setSaving(true);
    await fetch(`/api/customers/${customerId}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_date: date,
        service_type: serviceType,
        price_charged: price || undefined,
        notes,
      }),
    });
    setDate("");
    setServiceType("");
    setPrice("");
    setNotes("");
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-forest-dark/10 bg-white p-6">
      <h2 className="font-display text-lg font-700 text-forest-dark">
        Service history
      </h2>

      <ul className="mt-4 divide-y divide-forest-dark/10">
        {history.map((h) => (
          <li key={h.id} className="py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-600">{h.service_date}</span>
              <span className="text-oak">
                {h.price_charged ? `$${h.price_charged}` : ""}
              </span>
            </div>
            <div className="text-ink/70">{h.service_type}</div>
            {h.notes && <div className="text-xs text-ink/50">{h.notes}</div>}
          </li>
        ))}
        {history.length === 0 && (
          <p className="py-3 text-sm text-ink/50">No visits logged yet.</p>
        )}
      </ul>

      <div className="mt-4 grid gap-2 border-t border-forest-dark/10 pt-4 sm:grid-cols-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
        />
        <input
          placeholder="Service type"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
        />
        <input
          placeholder="Price charged"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
        />
        <input
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
        />
        <button
          onClick={addEntry}
          disabled={saving || !date || !serviceType}
          className="rounded-md bg-forest px-4 py-2 text-sm font-600 text-bone hover:bg-forest-dark disabled:opacity-60 sm:col-span-2"
        >
          {saving ? "Adding..." : "Add visit"}
        </button>
      </div>
    </div>
  );
}
