/*
  Warnings:

  - You are about to drop the column `lat` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Listing" DROP COLUMN "lat",
DROP COLUMN "lng",
ADD COLUMN     "lengthM" DOUBLE PRECISION,
ADD COLUMN     "widthM" DOUBLE PRECISION;
