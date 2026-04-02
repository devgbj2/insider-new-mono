-- AlterTable
ALTER TABLE "InternetServiceProvider" ADD COLUMN     "coverageListProvince" TEXT,
ADD COLUMN     "latitude" DECIMAL(9,6),
ADD COLUMN     "longitude" DECIMAL(9,6),
ADD COLUMN     "quality" TEXT,
ADD COLUMN     "size" TEXT;
