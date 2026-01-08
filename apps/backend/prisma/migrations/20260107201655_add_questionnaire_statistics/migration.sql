-- CreateTable
CREATE TABLE "QuestionnaireStatistics" (
    "id" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "temporalRatingData" JSONB,
    "temporalSatisfactionData" JSONB,
    "overallRatingDistribution" JSONB,
    "theoryPracticeRatio" JSONB,
    "courseAtmosphere" JSONB,
    "courseHours" JSONB,
    "contentRelevance" JSONB,
    "clarityDistribution" JSONB,
    "teachingSpeed" JSONB,
    "strongPoints" JSONB,
    "weakPoints" JSONB,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionnaireStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionnaireStatistics_questionnaireId_key" ON "QuestionnaireStatistics"("questionnaireId");

-- CreateIndex
CREATE INDEX "QuestionnaireStatistics_questionnaireId_idx" ON "QuestionnaireStatistics"("questionnaireId");

-- CreateIndex
CREATE INDEX "QuestionnaireStatistics_generatedAt_idx" ON "QuestionnaireStatistics"("generatedAt");

-- AddForeignKey
ALTER TABLE "QuestionnaireStatistics" ADD CONSTRAINT "QuestionnaireStatistics_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;
