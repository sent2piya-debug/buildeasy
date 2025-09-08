import ListingCard from "@/components/ListingCard";

export type Listing = {
  id: string;
  title: string;
  type: "LAND" | "HOUSE" | "SERVICE";
  priceMin: number;
  priceMax: number;
  province: string;
  district: string;
  landSizeSqm: number | null;
  photos: string[];
};

export default async function ListingsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listings`, {
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to fetch listings");

  const listings: Listing[] = await res.json();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
