"use client";

import { useState } from "react";

type Item = {
  id: string;
  title: string;
  province: string;
  district: string;
  createdAt: string;
};

export default function AdminPendingList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";

  async function act(id: string, action: "approve" | "reject") {
    const url = `${base}/api/admin/${action}/${id}`;
    const res = await fetch(url, { method: "POST" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.id} className="border rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">{i.title}</div>
            <div className="text-sm opacity-70">
              {i.province} · {i.district} · {new Date(i.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => act(i.id, "approve")} className="px-3 py-1 rounded bg-green-600 text-white">
              Approve
            </button>
            <button onClick={() => act(i.id, "reject")} className="px-3 py-1 rounded bg-red-600 text-white">
              Reject
            </button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p>No pending items.</p>}
    </div>
  );
}




