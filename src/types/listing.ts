export type ListingDTO = {
  id: string;
  title: string;
  province?: string | null;
  district?: string | null;
  widthM?: number | null;
  lengthM?: number | null;
  landSizeSqm?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
  photos?: string[] | null;
};
