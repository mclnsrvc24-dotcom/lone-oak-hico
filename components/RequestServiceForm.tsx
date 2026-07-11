"use client";

import { useMemo, useState } from "react";
import {
  LAWN_SERVICES,
  HOUSE_WASH_SERVICES,
  HOUSE_WASH_ADDONS,
  FREQUENCY_INFO,
  estimateLawnPrice,
  formatRange,
  type Frequency,
} from "@/lib/pricing";

type Category = "lawn" | "house_wash";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; leadId: number }
  | { status: "error"; message: string };

export default function RequestServiceForm() {
  const [category, setCategory] = useState<Category>("lawn");
  const [lawnService, setLawnService] =
    useState<keyof typeof LAWN_SERVICES>("mow_edge_blow");
  const [frequency, setFrequency] = useState<Frequency>("biweekly");
  const [houseService, setHouseService] =
    useState<keyof typeof HOUSE_WASH_SERVICES>("avg_2000_sqft");
  const [addons, setAddons] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredWindow, setPreferredWindow] = useState("");
  const [notes, setNotes] = useState("");

  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });

  const estimate = useMemo(() => {
    if (category === "lawn") {
      return estimateLawnPrice(lawnService, frequency);
    }
    return HOUSE_WASH_SERVICES[houseService].range;
  }, [category, lawnService, frequency, houseService]);

  function toggleAddon(key: string) {
    setAddons((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setSubmit({ status: "error", message: "Please enter your name." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setSubmit({
        status: "error",
        message: "Please enter a valid email address (e.g. name@example.com).",
      });
      return;
    }

    setSubmit({ status: "submitting" });

    const addonNote =
      addons.length > 0
        ? `Add-ons requested: ${addons
            .map((a) => HOUSE_WASH_ADDONS[a].label)
            .join(", ")}`
        : "";

    const body = {
      name: trimmedName,
      email: trimmedEmail,
      phone,
      address,
      city,
      service_category: category,
      service_type: category === "lawn" ? lawnService : houseService,
      frequency: category === "lawn" ? frequency : undefined,
      preferred_date: preferredDate || undefined,
      preferred_time_window: preferredWindow || undefined,
      notes: [notes, addonNote].filter(Boolean).join("\n"),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setSubmit({ status: "success", leadId: data.leadId });
    } catch (err) {
      setSubmit({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }

  if (submit.status === "success") {
    return (
      <div className="rounded-xl border border-forest/30 bg-forest/5 p-8 text-center">
        <h3 className="font-display text-2xl font-700 text-forest-dark">
          Request received!
        </h3>
        <p className="mt-2 text-ink/70">
          We&apos;ll reach out to confirm your consultation time. Want to
          upload a few photos of your property in the meantime?
        </p>
        <a
          href={`/upload-photos?lead=${submit.leadId}`}
          className="mt-6 inline-block rounded-md bg-forest px-6 py-3 font-display font-700 uppercase tracking-wide text-bone hover:bg-forest-dark"
        >
          Upload Photos
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div>
        <p className="font-display text-sm font-700 uppercase tracking-wide text-forest-dark">
          1. Service category
        </p>
        <div className="mt-3 flex gap-3">
          {(["lawn", "house_wash"] as Category[]).map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-md border px-4 py-2 font-600 ${
                category === c
                  ? "border-forest bg-forest text-bone"
                  : "border-forest-dark/20 bg-white text-ink"
              }`}
            >
              {c === "lawn" ? "Lawn Care" : "House Washing"}
            </button>
          ))}
        </div>
      </div>

      {category === "lawn" ? (
        <>
          <div>
            <p className="font-display text-sm font-700 uppercase tracking-wide text-forest-dark">
              2. Lawn service
            </p>
            <select
              value={lawnService}
              onChange={(e) =>
                setLawnService(e.target.value as keyof typeof LAWN_SERVICES)
              }
              className="mt-3 w-full rounded-md border border-forest-dark/20 bg-white px-4 py-3"
            >
              {Object.entries(LAWN_SERVICES).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="font-display text-sm font-700 uppercase tracking-wide text-forest-dark">
              3. How often?
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(Object.keys(FREQUENCY_INFO) as Frequency[]).map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`rounded-md border px-4 py-3 text-left ${
                    frequency === f
                      ? "border-forest bg-forest text-bone"
                      : "border-forest-dark/20 bg-white text-ink"
                  }`}
                >
                  <p className="font-600">{FREQUENCY_INFO[f].label}</p>
                  <p
                    className={`text-xs ${
                      frequency === f ? "text-bone/80" : "text-ink/60"
                    }`}
                  >
                    {FREQUENCY_INFO[f].note}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <p className="font-display text-sm font-700 uppercase tracking-wide text-forest-dark">
              2. Home size
            </p>
            <select
              value={houseService}
              onChange={(e) =>
                setHouseService(
                  e.target.value as keyof typeof HOUSE_WASH_SERVICES
                )
              }
              className="mt-3 w-full rounded-md border border-forest-dark/20 bg-white px-4 py-3"
            >
              {Object.entries(HOUSE_WASH_SERVICES).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="font-display text-sm font-700 uppercase tracking-wide text-forest-dark">
              3. Add-ons (optional)
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {Object.entries(HOUSE_WASH_ADDONS).map(([key, a]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 rounded-md border border-forest-dark/20 bg-white px-4 py-3"
                >
                  <input
                    type="checkbox"
                    checked={addons.includes(key)}
                    onChange={() => toggleAddon(key)}
                  />
                  <span className="text-sm">
                    {a.label}{" "}
                    <span className="text-ink/50">
                      (+{formatRange(a.range)})
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="rounded-lg bg-gold/10 p-4">
        <p className="text-sm text-ink/70">Estimated price</p>
        <p className="font-display text-2xl font-800 text-oak">
          {formatRange(estimate)}
        </p>
        <p className="text-xs text-ink/50">
          Exact price confirmed at your free consultation.
        </p>
      </div>

      <div>
        <p className="font-display text-sm font-700 uppercase tracking-wide text-forest-dark">
          Your info
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-forest-dark/20 bg-white px-4 py-3 sm:col-span-2"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-forest-dark/20 bg-white px-4 py-3"
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-md border border-forest-dark/20 bg-white px-4 py-3"
          />
          <input
            placeholder="Property address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-md border border-forest-dark/20 bg-white px-4 py-3 sm:col-span-2"
          />
          <input
            placeholder="City (Killeen, Pflugerville, Temple, ...)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-md border border-forest-dark/20 bg-white px-4 py-3 sm:col-span-2"
          />
        </div>
      </div>

      <div>
        <p className="font-display text-sm font-700 uppercase tracking-wide text-forest-dark">
          Preferred consultation time
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="rounded-md border border-forest-dark/20 bg-white px-4 py-3"
          />
          <input
            placeholder="Time window (e.g. weekday afternoons)"
            value={preferredWindow}
            onChange={(e) => setPreferredWindow(e.target.value)}
            className="rounded-md border border-forest-dark/20 bg-white px-4 py-3"
          />
        </div>
      </div>

      <textarea
        placeholder="Anything else we should know? (gate codes, dogs, lot size, etc.)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-forest-dark/20 bg-white px-4 py-3"
      />

      {submit.status === "error" && (
        <p className="text-sm text-red-600">{submit.message}</p>
      )}

      <button
        type="submit"
        disabled={submit.status === "submitting"}
        className="w-full rounded-md bg-forest px-6 py-4 font-display text-lg font-700 uppercase tracking-wide text-bone hover:bg-forest-dark disabled:opacity-60"
      >
        {submit.status === "submitting"
          ? "Sending..."
          : "Request Consultation"}
      </button>
    </form>
  );
}
