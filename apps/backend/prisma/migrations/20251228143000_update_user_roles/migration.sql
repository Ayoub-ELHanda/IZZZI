-- AlterEnum: Update UserRole enum to new values
-- PostgreSQL requires recreating the enum type to change values

-- Step 1: Create new enum type with correct values
CREATE TYPE "UserRole_new" AS ENUM ('VISITEUR', 'RESPONSABLE_PEDAGOGIQUE', 'ADMIN');

-- Step 2: Update existing records before changing column type
-- TEACHER -> RESPONSABLE_PEDAGOGIQUE (temporary conversion to text)
UPDATE "User" SET "role" = 'RESPONSABLE_PEDAGOGIQUE'::text WHERE "role"::text = 'TEACHER';

-- STUDENT -> VISITEUR (students are not users, they just receive emails)
UPDATE "User" SET "role" = 'VISITEUR'::text WHERE "role"::text = 'STUDENT';

-- Step 3: Change column type to text temporarily
ALTER TABLE "User" ALTER COLUMN "role" TYPE text USING "role"::text;

-- Step 4: Update column to use new enum
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING "role"::"UserRole_new";

-- Step 5: Drop old enum
DROP TYPE "UserRole";

-- Step 6: Rename new enum to old name
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

-- Step 7: Set default value
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'VISITEUR';

