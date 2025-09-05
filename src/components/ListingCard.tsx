"use client";

import React from "react";

type Listing = {
  id: string;
  title: string;
  province: string;
  district: string;
  widthM?: number | null;
  lengthM?: number | null;
  landSizeSqm?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
  photos?: string[] | null;
};

export function ListingCard({ listing }: { listing: Listing }) {
  const hasDims = Boolean(listing.widthM && listing.lengthM);
  const sqm = hasDims
    ? Math.round((listing.widthM as number) * (listing.lengthM as number))
    : listing.landSizeSqm ?? null;

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {listing.photos?.[0] && (
        <img
          src={listing.photos[0]}
          alt={listing.title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{listing.title}</h3>
        <p className="text-sm text-gray-600">
          {listing.province}, {listing.district}
        </p>
        {hasDims && (
          <p className="mt-1 text-sm">
            Land: {listing.widthM}m × {listing.lengthM}m = <b>{sqm} sqm</b>
          </p>
        )}
        {!hasDims && sqm != null && (
          <p className="mt-1 text-sm">Land: <b>{sqm} sqm</b></p>
        )}
        <p className="mt-1 text-green-600 font-medium">
          ฿{listing.priceMin?.toLocaleString()} – ฿{listing.priceMax?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default ListingCard;






