/*
  Warnings:

  - You are about to drop the column `provinecSyn` on the `InternetServiceProvider` table. All the data in the column will be lost.
  - Added the required column `provinceSyn` to the `InternetServiceProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InternetServiceProvider" DROP COLUMN "provinecSyn",
ADD COLUMN     "provinceSyn" TEXT NOT NULL;
