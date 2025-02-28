/*
  Warnings:

  - The values [INITATED] on the enum `TransferStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `sales` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransferStatus_new" AS ENUM ('INITIATED', 'DONE');
ALTER TABLE "transfers" ALTER COLUMN "status" TYPE "TransferStatus_new" USING ("status"::text::"TransferStatus_new");
ALTER TYPE "TransferStatus" RENAME TO "TransferStatus_old";
ALTER TYPE "TransferStatus_new" RENAME TO "TransferStatus";
DROP TYPE "TransferStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "transactionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sales_transactionId_key" ON "sales"("transactionId");
