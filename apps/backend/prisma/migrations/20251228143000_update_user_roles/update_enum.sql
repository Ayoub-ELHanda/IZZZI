-- Create new enum type
CREATE TYPE "UserRole_new" AS ENUM ('VISITEUR', 'RESPONSABLE_PEDAGOGIQUE', 'ADMIN');

-- Change column to text temporarily
ALTER TABLE "User" ALTER COLUMN "role" TYPE text USING "role"::text;

-- Update values
UPDATE "User" SET "role" = 'RESPONSABLE_PEDAGOGIQUE' WHERE "role" = 'TEACHER';
UPDATE "User" SET "role" = 'VISITEUR' WHERE "role" = 'STUDENT';

-- Change to new enum
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING "role"::"UserRole_new";

-- Drop old enum
DROP TYPE "UserRole";

-- Rename new enum
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

-- Set default
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'VISITEUR';

