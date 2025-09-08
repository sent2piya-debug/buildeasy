"use client";

import { useState } from "react";

export default function SubmitListingPage() {
  const [form, setForm] = useState({
    title: "",
    type: "LAND",
    widthM: "",
    lengthM: "",
    priceMin: "",
    priceMax: "",
    province: "",
    district: "",
    photosCsv: "https://placehold.co/800x600/jpg?text=Photo",
    description: "",
    ownerEmail: "seller@buildeasy.dev",
  });
  const [status, setStatus] = useState<null | string>(null);
  const widthNum = form.widthM ? Number(form.widthM) : NaN;
  const lengthNum = form.lengthM ? Number(form.lengthM) : NaN;
  const liveSqm = Number.isFinite(widthNum) && Number.isFinite(lengthNum)
    ? Math.round(widthNum * lengthNum)
    : null;
  const priceMinNum = form.priceMin ? Number(form.priceMin) : NaN;
  const priceMaxNum = form.priceMax ? Number(form.priceMax) : NaN;
  const priceRangeValid =
    (!form.priceMin && !form.priceMax) ||
    (Number.isFinite(priceMinNum) && Number.isFinite(priceMaxNum) && priceMinNum <= priceMaxNum);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // basic validation
    if (!form.title.trim()) {
      setStatus("❌ Title is required");
      return;
    }
    if (!form.province.trim() || !form.district.trim()) {
      setStatus("❌ Province and District are required");
      return;
    }
    if (form.widthM && !Number.isFinite(widthNum)) {
      setStatus("❌ Width must be a number");
      return;
    }
    if (form.lengthM && !Number.isFinite(lengthNum)) {
      setStatus("❌ Length must be a number");
      return;
    }
    if (!priceRangeValid) {
      setStatus("❌ Price range invalid (min ≤ max)");
      return;
    }
    setStatus("Submitting...");
    const payload = {
      title: form.title,
      type: form.type,
      widthM: form.widthM ? Number(form.widthM) : null,
      lengthM: form.lengthM ? Number(form.lengthM) : null,
      priceMin: form.priceMin ? Number(form.priceMin) : null,
      priceMax: form.priceMax ? Number(form.priceMax) : null,
      province: form.province,
      district: form.district,
      photos: form.photosCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description: form.description,
      ownerEmail: form.ownerEmail,
    };
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": "SELLER" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus("✅ Submitted! Waiting for admin approval.");
      setForm({ ...form, title: "" });
    } else {
      const err = await res.json().catch(() => ({}));
      setStatus(`❌ Failed: ${err.error ?? res.statusText}`);
    }
  }

  function f<K extends keyof typeof form>(key: K, v: string) {
    setForm((prev) => ({ ...prev, [key]: v }));
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Submit a Listing</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Title"
          value={form.title} onChange={(e) => f("title", e.target.value)} required />
        <select className="w-full border p-2 rounded" value={form.type}
          onChange={(e) => f("type", e.target.value)}>
          <option value="LAND">LAND</option>
          <option value="HOUSE">HOUSE</option>
          <option value="SERVICE">SERVICE</option>
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Width (m.)"
            value={form.widthM}
            onChange={(e) => f("widthM", e.target.value)}
            inputMode="decimal"
            pattern="^\\d*(?:\\.\\d+)?$"
          />
          <input
            className="border p-2 rounded"
            placeholder="Length (m.)"
            value={form.lengthM}
            onChange={(e) => f("lengthM", e.target.value)}
            inputMode="decimal"
            pattern="^\\d*(?:\\.\\d+)?$"
          />
          <input className="border p-2 rounded" placeholder="Province"
            value={form.province} onChange={(e) => f("province", e.target.value)} required />
          <input className="border p-2 rounded" placeholder="District"
            value={form.district} onChange={(e) => f("district", e.target.value)} required />
          <input className="border p-2 rounded" placeholder="Price Min"
            value={form.priceMin} onChange={(e) => f("priceMin", e.target.value)} inputMode="numeric" pattern="^\\d+$" />
          <input className="border p-2 rounded" placeholder="Price Max"
            value={form.priceMax} onChange={(e) => f("priceMax", e.target.value)} inputMode="numeric" pattern="^\\d+$" />
        </div>
        <textarea className="w-full border p-2 rounded" rows={3} placeholder="Photos (comma-separated URLs)"
          value={form.photosCsv} onChange={(e) => f("photosCsv", e.target.value)} />
        <textarea className="w-full border p-2 rounded" rows={3} placeholder="Description"
          value={form.description} onChange={(e) => f("description", e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Owner email"
          value={form.ownerEmail} onChange={(e) => f("ownerEmail", e.target.value)} />
        {liveSqm != null && (
          <p className="text-sm opacity-70">Calculated: {widthNum}m × {lengthNum}m = <b>{liveSqm} sqm</b></p>
        )}
        {!priceRangeValid && (
          <p className="text-sm text-red-600">Price range invalid: min should be ≤ max</p>
        )}
        <button className="px-4 py-2 rounded bg-black text-white">Submit</button>
      </form>
      {status && <p className="mt-4">{status}</p>}
      <p className="mt-6 text-sm opacity-70">
        After submit, open <code>/admin</code> and click <b>Approve</b>.
        Then the listing appears in <code>/listings</code>.
      </p>
    </main>
  );
}


