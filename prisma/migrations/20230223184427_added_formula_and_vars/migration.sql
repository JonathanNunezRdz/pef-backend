/*
  Warnings:

  - Added the required column `formula` to the `Algorithm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Algorithm" ADD COLUMN     "formula" TEXT NOT NULL,
ADD COLUMN     "variables" TEXT[];
