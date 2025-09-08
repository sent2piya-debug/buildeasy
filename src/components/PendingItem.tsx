"use client";

import React from "react";

export type PendingItemData = {
  id: string;
  title: string;
  province: string;
  district: string;
  widthM?: number | null;
  lengthM?: number | null;
  landSizeSqm?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
};

export default function PendingItem({
  item,
  onApprove,
  onReject,
}: {
  item: PendingItemData;
  onApprove: (id: string) => void | Promise<void>;
  onReject: (id: string) => void | Promise<void>;
}) {
  const hasDims = Boolean(item.widthM && item.lengthM);
  const sqm = hasDims
    ? Math.round((item.widthM as number) * (item.lengthM as number))
    : item.landSizeSqm ?? null;

  return (
    <div className="border rounded-lg p-4 flex items-center justify-between bg-white shadow-sm">
      <div>
        <h3 className="font-bold">{item.title}</h3>
        <p className="text-sm text-gray-600">
          {item.province}, {item.district}
        </p>
        {hasDims && (
          <p className="text-sm">
            {item.widthM}m × {item.lengthM}m = {sqm} sqm
          </p>
        )}
        {!hasDims && sqm != null && (
          <p className="text-sm">{sqm} sqm</p>
        )}
        <p className="text-green-700">
          ฿{item.priceMin?.toLocaleString()} – ฿{item.priceMax?.toLocaleString()}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onReject(item.id)}
          className="px-3 py-1 rounded-lg border border-red-500 text-red-500 hover:bg-red-50"
        >
          Reject
        </button>
        <button
          onClick={() => onApprove(item.id)}
          className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Approve
        </button>
      </div>
    </div>
  );
}








