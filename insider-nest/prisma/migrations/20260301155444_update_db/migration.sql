/*
  Warnings:

  - You are about to drop the column `action` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `ActivityLog` table. All the data in the column will be lost.
  - Added the required column `ip` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "action",
DROP COLUMN "ipAddress",
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "meta" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rowstatus" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "InternetServiceProvider" (
    "id" SERIAL NOT NULL,
    "registeredName" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bpNumber" TEXT NOT NULL,
    "asnNumber" TEXT NOT NULL,
    "caNumber" TEXT NOT NULL,
    "tifBpNumber" TEXT NOT NULL,
    "isKominfo" BOOLEAN NOT NULL,
    "isAsn" BOOLEAN NOT NULL,
    "isCustomer" BOOLEAN NOT NULL,
    "isJartup" BOOLEAN NOT NULL,
    "isJartaplok" BOOLEAN NOT NULL,
    "internalRiskProfile" TEXT NOT NULL,
    "collectionRate" TEXT NOT NULL,
    "customerCoverage" TEXT NOT NULL,
    "headquarter" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "provinecSyn" TEXT NOT NULL,
    "coverageList" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternetServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whitelistLdap" (
    "id" SERIAL NOT NULL,
    "nik" TEXT NOT NULL,
    "rowstatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whitelistLdap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pbiLinks" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "rowstatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pbiLinks_pkey" PRIMARY KEY ("id")
);
