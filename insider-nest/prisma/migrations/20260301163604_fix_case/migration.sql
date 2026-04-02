/*
  Warnings:

  - You are about to drop the `pbiLinks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `whitelistLdap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "pbiLinks";

-- DropTable
DROP TABLE "whitelistLdap";

-- CreateTable
CREATE TABLE "WhitelistLdap" (
    "id" SERIAL NOT NULL,
    "nik" TEXT NOT NULL,
    "rowstatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhitelistLdap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PbiLinks" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "rowstatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PbiLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistLdap_nik_key" ON "WhitelistLdap"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "PbiLinks_link_key" ON "PbiLinks"("link");
