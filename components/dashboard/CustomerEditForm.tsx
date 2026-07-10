"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Customer } from "@/lib/db";

export default function CustomerEditForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: customer.name,
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    address: customer.address ?? "",
    city: customer.city ?? "",
    plan: customer.plan ?? "",
    agreed_price: customer.agreed_price?.toString() ?? "",
    notes: customer.notes ?? "",
    active: customer.active,
  });
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        agreed_price: form.agreed_price ? Number(form.agreed_price) : null,
      }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-forest-dark/10 bg-white p-6">
      <h2 className="font-display text-lg font-700 text-forest-dark">
        Customer info
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Name
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Email
          <input
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Phone
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          City
          <input
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Address
          <input
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Plan
          <select
            value={form.plan}
            onChange={(e) => update("plan", e.target.value)}
            className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2"
          >
            <option value="">—</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="one_time">One-Time</option>
          </select>
        </label>
        <label className="text-sm">
          Agreed price ($/visit)
          <input
            value={form.agreed_price}
            onChange={(e) => update("agreed_price", e.target.value)}
            type="number"
            className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Notes
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => update("active", e.target.checked)}
          />
          Active customer
        </label>
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-md bg-forest px-4 py-2 text-sm font-600 text-bone hover:bg-forest-dark disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}
