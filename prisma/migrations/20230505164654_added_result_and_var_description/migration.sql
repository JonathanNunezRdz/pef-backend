/*
  Warnings:

  - Added the required column `description` to the `AnalysisResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Variable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readableName` to the `Variable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnalysisResult" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Variable" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "readableName" TEXT NOT NULL;
