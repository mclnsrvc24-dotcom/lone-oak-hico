"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TikTokPost } from "@/lib/db";

const STATUSES: TikTokPost["status"][] = ["idea", "planned", "filmed", "posted"];

const STARTER_IDEAS = [
  "Before/after of today's mow",
  "Quick tip: why edging matters",
  "House wash transformation reveal",
  "Team intro / day-in-the-life",
  "Customer property walkthrough (with permission)",
  "Overgrown lot rescue timelapse",
  "Behind the scenes: gear check",
  "Answer a common lawn care question",
];

export default function TikTokTracker({ posts }: { posts: TikTokPost[] }) {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  async function addPost(ideaText: string) {
    if (!ideaText.trim()) return;
    setAdding(true);
    await fetch("/api/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: ideaText, planned_date: plannedDate || undefined }),
    });
    setIdea("");
    setPlannedDate("");
    setAdding(false);
    router.refresh();
  }

  async function setStatus(id: number, status: TikTokPost["status"]) {
    setBusyId(id);
    await fetch(`/api/tiktok/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(id: number) {
    setBusyId(id);
    await fetch(`/api/tiktok/${id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-forest-dark/10 bg-white p-6">
        <h2 className="font-display text-lg font-700 text-forest-dark">
          Add a new idea
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <input
            placeholder="Post idea or hook"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={plannedDate}
            onChange={(e) => setPlannedDate(e.target.value)}
            className="rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
          />
          <button
            onClick={() => addPost(idea)}
            disabled={adding || !idea.trim()}
            className="rounded-md bg-forest px-4 py-2 text-sm font-600 text-bone hover:bg-forest-dark disabled:opacity-60"
          >
            Add
          </button>
        </div>

        <p className="mt-4 text-xs font-600 uppercase tracking-wide text-ink/40">
          Need a fresh idea? Tap one to add it:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STARTER_IDEAS.map((s) => (
            <button
              key={s}
              onClick={() => addPost(s)}
              className="rounded-full border border-forest-dark/20 px-3 py-1 text-xs text-ink/70 hover:bg-forest/5"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATUSES.map((status) => (
          <div key={status} className="rounded-xl border border-forest-dark/10 bg-white p-4">
            <h3 className="font-display text-sm font-700 uppercase tracking-wide text-forest-dark">
              {status} ({posts.filter((p) => p.status === status).length})
            </h3>
            <ul className="mt-3 space-y-3">
              {posts
                .filter((p) => p.status === status)
                .map((p) => (
                  <li key={p.id} className="rounded-lg border border-forest-dark/10 p-3 text-sm">
                    <p className="font-600">{p.idea}</p>
                    {p.planned_date && (
                      <p className="text-xs text-ink/50">{p.planned_date}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      <select
                        value={p.status}
                        disabled={busyId === p.id}
                        onChange={(e) =>
                          setStatus(p.id, e.target.value as TikTokPost["status"])
                        }
                        className="rounded-md border border-forest-dark/20 px-1 py-0.5 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        disabled={busyId === p.id}
                        onClick={() => remove(p.id)}
                        className="rounded-md px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
