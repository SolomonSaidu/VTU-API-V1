-- AlterEnum
ALTER TYPE "TransactionStatus" ADD VALUE 'PROCESSING';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "PortedNumber" TEXT,
ADD COLUMN     "airtimeType" TEXT,
ADD COLUMN     "network" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
