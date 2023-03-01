/*
  Warnings:

  - You are about to drop the column `dificulty` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `max` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `min` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Score` table. All the data in the column will be lost.
  - Added the required column `max` to the `Algorithm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min` to the `Algorithm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Algorithm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Algorithm" ADD COLUMN     "dificulty" TEXT,
ADD COLUMN     "max" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "min" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "dificulty",
DROP COLUMN "max",
DROP COLUMN "min",
DROP COLUMN "unit";
