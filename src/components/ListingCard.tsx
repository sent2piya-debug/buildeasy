import Image from "next/image";

function toPhoto(src?: string, fallbackText = "Photo") {
  if (!src) return `https://placehold.co/800x600.jpg?text=${encodeURIComponent(fallbackText)}`;
  // if it's a local path make sure it starts with /
  if (src.startsWith("/")) return src;
  // otherwise assume it's remote and return as-is
  return src;
}

export default function ListingCard({ listing }: { listing: any }) {
  const cover = listing.photos?.[0] ?? "https://placehold.co/800x600.jpg?text=NO+photo";<Image src={cover} alt={listing.title} width={600} height={400} />

  return (
    <article className="rounded-xl border p-4">
      <div className="mb-3">
        <Image
          src={cover}
          alt={listing.title}
          width={800}
          height={600}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
      {/* …rest of card… */}
    </article>
  );
}
