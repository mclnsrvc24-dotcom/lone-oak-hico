"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

type Props = {
  leadId?: string;
  customerId?: string;
};

type UploadItem = {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

export default function PhotoUploadForm({ leadId, customerId }: Props) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [caption, setCaption] = useState("");
  const [done, setDone] = useState(false);

  function onSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setItems(files.map((file) => ({ file, status: "pending" })));
  }

  async function handleUploadAll() {
    if (items.length === 0) return;

    for (let i = 0; i < items.length; i++) {
      setItems((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: "uploading" } : it))
      );

      try {
        const blob = await upload(items[i].file.name, items[i].file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });

        await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: blob.url,
            caption,
            lead_id: leadId,
            customer_id: customerId,
          }),
        });

        setItems((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, status: "done" } : it))
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? {
                  ...it,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : it
          )
        );
      }
    }

    setDone(true);
  }

  if (!leadId && !customerId) {
    return (
      <p className="text-ink/70">
        This link is missing a reference to your consultation request. Use
        the upload link from your confirmation screen or email.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onSelectFiles}
        className="block w-full rounded-md border border-forest-dark/20 bg-white px-4 py-3"
      />

      <input
        placeholder="Caption (optional) — e.g. 'front yard' or 'back gutters'"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full rounded-md border border-forest-dark/20 bg-white px-4 py-3"
      />

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-center justify-between text-sm">
              <span>{it.file.name}</span>
              <span
                className={
                  it.status === "error"
                    ? "text-red-600"
                    : it.status === "done"
                    ? "text-forest"
                    : "text-ink/50"
                }
              >
                {it.status === "pending" && "Ready"}
                {it.status === "uploading" && "Uploading..."}
                {it.status === "done" && "Uploaded"}
                {it.status === "error" && (it.error ?? "Failed")}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleUploadAll}
        disabled={items.length === 0 || done}
        className="w-full rounded-md bg-forest px-6 py-4 font-display text-lg font-700 uppercase tracking-wide text-bone hover:bg-forest-dark disabled:opacity-60"
      >
        {done ? "Uploaded" : `Upload ${items.length || ""} Photo(s)`}
      </button>

      {done && (
        <p className="text-center text-forest">
          Thanks! Your photos have been added to your file.
        </p>
      )}
    </div>
  );
}
