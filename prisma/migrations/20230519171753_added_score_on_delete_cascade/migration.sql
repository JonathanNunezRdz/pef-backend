-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_analysisResultId_fkey";

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_analysisResultId_fkey" FOREIGN KEY ("analysisResultId") REFERENCES "AnalysisResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
