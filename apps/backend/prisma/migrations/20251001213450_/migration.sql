/*
  Warnings:

  - A unique constraint covering the columns `[marketSku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[internalSku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryOfOrigin` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `internalSku` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketSku` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "ageRestriction" INTEGER DEFAULT 0,
ADD COLUMN     "attributes" JSONB,
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "countryOfOrigin" TEXT NOT NULL,
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "internalSku" TEXT NOT NULL,
ADD COLUMN     "isAdult" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "marketSku" TEXT NOT NULL,
ADD COLUMN     "oldPrice" DOUBLE PRECISION,
ADD COLUMN     "shelfLifeComment" TEXT,
ADD COLUMN     "shelfLifeMonths" INTEGER,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "weight" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_marketSku_key" ON "Product"("marketSku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_internalSku_key" ON "Product"("internalSku");
