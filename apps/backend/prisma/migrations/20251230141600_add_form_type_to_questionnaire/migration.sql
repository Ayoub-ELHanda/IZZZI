-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('BASIC', 'TECHNICAL', 'SOFT_SKILLS', 'LOGICIEL');

-- AlterTable
ALTER TABLE "Questionnaire" ADD COLUMN "formType" "FormType" NOT NULL DEFAULT 'BASIC';
