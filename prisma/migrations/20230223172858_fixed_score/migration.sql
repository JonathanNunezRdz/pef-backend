/*
  Warnings:

  - You are about to drop the column `dificulty` on the `Algorithm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Algorithm" DROP COLUMN "dificulty";

-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "dificulty" TEXT;
