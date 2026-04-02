/*
  Warnings:

  - You are about to drop the column `registeredName` on the `InternetServiceProvider` table. All the data in the column will be lost.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/

-- 1. Jika kamu menggunakan ENUM, pastikan tipe enum-nya dibuat dulu (cek apakah sudah ada di file sql)
-- CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- 2. Ubah kolom dengan casting manual
ALTER TABLE "User" 
ALTER COLUMN "role" TYPE "Role" USING ("role"::"Role");

-- AlterTable
ALTER TABLE "InternetServiceProvider" DROP COLUMN "registeredName",
ADD COLUMN     "phone" VARCHAR(50),
ADD COLUMN     "risk" TEXT,
ADD COLUMN     "scale" TEXT,
ALTER COLUMN "legalName" DROP NOT NULL,
ALTER COLUMN "bpNumber" DROP NOT NULL,
ALTER COLUMN "asnNumber" DROP NOT NULL,
ALTER COLUMN "caNumber" DROP NOT NULL,
ALTER COLUMN "tifBpNumber" DROP NOT NULL,
ALTER COLUMN "isKominfo" DROP NOT NULL,
ALTER COLUMN "isAsn" DROP NOT NULL,
ALTER COLUMN "isCustomer" DROP NOT NULL,
ALTER COLUMN "isJartup" DROP NOT NULL,
ALTER COLUMN "isJartaplok" DROP NOT NULL,
ALTER COLUMN "internalRiskProfile" DROP NOT NULL,
ALTER COLUMN "collectionRate" DROP NOT NULL,
ALTER COLUMN "customerCoverage" DROP NOT NULL,
ALTER COLUMN "headquarter" DROP NOT NULL,
ALTER COLUMN "province" DROP NOT NULL,
ALTER COLUMN "coverageList" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "provinceSyn" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Role";
