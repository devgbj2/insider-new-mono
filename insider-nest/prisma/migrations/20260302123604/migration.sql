/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `InternetServiceProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InternetServiceProvider_name_key" ON "InternetServiceProvider"("name");
