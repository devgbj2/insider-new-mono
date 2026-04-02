/*
  Warnings:

  - You are about to drop the `PbiLinks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PbiLinks";

-- CreateTable
CREATE TABLE "PbiLink" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "rowstatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PbiLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PbiLink_name_key" ON "PbiLink"("name");
