/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `pbiLinks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nik]` on the table `whitelistLdap` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pbiLinks_link_key" ON "pbiLinks"("link");

-- CreateIndex
CREATE UNIQUE INDEX "whitelistLdap_nik_key" ON "whitelistLdap"("nik");
