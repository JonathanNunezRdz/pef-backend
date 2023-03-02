/*
  Warnings:

  - You are about to drop the column `variables` on the `Algorithm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Algorithm" DROP COLUMN "variables";

-- CreateTable
CREATE TABLE "Variable" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Variable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlgorithmVariable" (
    "algorithmId" TEXT NOT NULL,
    "variableId" TEXT NOT NULL,

    CONSTRAINT "AlgorithmVariable_pkey" PRIMARY KEY ("algorithmId","variableId")
);

-- AddForeignKey
ALTER TABLE "AlgorithmVariable" ADD CONSTRAINT "AlgorithmVariable_algorithmId_fkey" FOREIGN KEY ("algorithmId") REFERENCES "Algorithm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlgorithmVariable" ADD CONSTRAINT "AlgorithmVariable_variableId_fkey" FOREIGN KEY ("variableId") REFERENCES "Variable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
