-- CreateTable
CREATE TABLE "FeedbackSummary" (
    "id" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "strengths" TEXT[],
    "improvements" TEXT[],
    "pedagogicalAlerts" TEXT[],
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackSummary_questionnaireId_key" ON "FeedbackSummary"("questionnaireId");

-- CreateIndex
CREATE INDEX "FeedbackSummary_questionnaireId_idx" ON "FeedbackSummary"("questionnaireId");

-- CreateIndex
CREATE INDEX "FeedbackSummary_generatedAt_idx" ON "FeedbackSummary"("generatedAt");

-- AddForeignKey
ALTER TABLE "FeedbackSummary" ADD CONSTRAINT "FeedbackSummary_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;
