-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "fulfillmentLeadTimeDays" INTEGER,
ADD COLUMN     "holidayDates" TIMESTAMP(3)[],
ADD COLUMN     "orderCutoffTime" TEXT,
ADD COLUMN     "workingDays" INTEGER[];

-- CreateTable
CREATE TABLE "StoreSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "shipmentVolume" INTEGER NOT NULL DEFAULT 10,
    "fulfillmentLeadTimeDays" INTEGER NOT NULL DEFAULT 1,
    "orderCutoffTime" TEXT NOT NULL DEFAULT '09:00',
    "workingDays" INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5]::INTEGER[],
    "holidayDates" TIMESTAMP(3)[],

    CONSTRAINT "StoreSetting_pkey" PRIMARY KEY ("id")
);
