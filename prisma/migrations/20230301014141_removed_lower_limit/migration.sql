/*
  Warnings:

  - You are about to drop the column `lowerLimit` on the `AlgorithmScale` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AlgorithmScale_level_key";

-- AlterTable
ALTER TABLE "AlgorithmScale" DROP COLUMN "lowerLimit";
