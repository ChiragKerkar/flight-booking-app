/*
  Warnings:

  - Added the required column `scheduled_flight_date` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "scheduled_flight_date" TIMESTAMP(3) NOT NULL;
