"use client";

import { useEffect, useState } from "react";
import PendingItem from "@/components/PendingItem";

type Pending = {
  id: string;
  title: string;
  province: string;
  district: string;
  widthM?: number | null;
  lengthM?: number | null;
  landSizeSqm?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
  createdAt: string;
};

export default function AdminPage() {
  const [items, setItems] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/pending", { cache: "no-store" });
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function act(id: string, action: "approve" | "reject") {
    await fetch(`/api/admin/${action}/${id}`, { method: "POST" });
    await load();
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Pending Listings</h1>
      {loading && <p>Loading…</p>}
      {!loading && items.length === 0 && <p>Nothing pending 🎉</p>}
      <div className="space-y-3">
        {items.map((l) => (
          <PendingItem key={l.id} item={l} onApprove={(id) => act(id, "approve")} onReject={(id) => act(id, "reject")} />
        ))}
      </div>
    </main>
  );
}


