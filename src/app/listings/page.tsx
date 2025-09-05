// Simple buyer feed that shows APPROVED listings
import ListingCard from "@/components/ListingCard";

async function getListings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/listings`, { cache: "no-store" });
  return res.json();
}

export default async function ListingsPage() {
  const listings = await getListings();
  return (
    <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.length === 0 && (
        <p className="col-span-full text-center opacity-70">No approved listings yet.</p>
      )}
      {listings.map((l: any) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </main>
  );
}


