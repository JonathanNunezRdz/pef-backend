-- CreateTable
CREATE TABLE "AlgorithmScale" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upperLimit" DOUBLE PRECISION NOT NULL,
    "lowerLimit" DOUBLE PRECISION NOT NULL,
    "level" TEXT NOT NULL,
    "extra" JSONB,
    "algorithmId" TEXT NOT NULL,

    CONSTRAINT "AlgorithmScale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlgorithmScale_level_key" ON "AlgorithmScale"("level");

-- AddForeignKey
ALTER TABLE "AlgorithmScale" ADD CONSTRAINT "AlgorithmScale_algorithmId_fkey" FOREIGN KEY ("algorithmId") REFERENCES "Algorithm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
