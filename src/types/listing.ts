export type ListingDTO = {
  id: string;
  title: string;
  type?: "LAND" | "HOUSE" | "SERVICE";
  widthM?: number | null;
  lengthM?: number | null;
  landSizeSqm?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
  province?: string | null;
  district?: string | null;
  photos?: string[] | null;
  description?: string | null;
  createdAt?: string;
};
