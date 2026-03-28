/*
  Warnings:

  - You are about to drop the column `brokerage_pref` on the `user_search_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `flatmate_age_max` on the `user_search_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `flatmate_age_min` on the `user_search_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `location_range_km` on the `user_search_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `price_max` on the `user_search_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `price_min` on the `user_search_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `security_deposit_max` on the `user_search_preferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "master_companies" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "master_degrees" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "master_institutions" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "master_positions" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_search_preferences" DROP COLUMN "brokerage_pref",
DROP COLUMN "flatmate_age_max",
DROP COLUMN "flatmate_age_min",
DROP COLUMN "location_range_km",
DROP COLUMN "price_max",
DROP COLUMN "price_min",
DROP COLUMN "security_deposit_max",
ADD COLUMN     "age_max" INTEGER DEFAULT 60,
ADD COLUMN     "age_min" INTEGER DEFAULT 18,
ADD COLUMN     "brokerage" VARCHAR(20),
ADD COLUMN     "common_amenities" TEXT[],
ADD COLUMN     "companies" TEXT[],
ADD COLUMN     "habits" TEXT[],
ADD COLUMN     "latitude" DECIMAL(10,7),
ADD COLUMN     "longitude" DECIMAL(10,7),
ADD COLUMN     "max_rent" DECIMAL(10,2) DEFAULT 100000,
ADD COLUMN     "min_rent" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "radius_km" INTEGER DEFAULT 5,
ADD COLUMN     "room_amenities" TEXT[],
ADD COLUMN     "schools" TEXT[],
ADD COLUMN     "security_deposit" VARCHAR(50);
