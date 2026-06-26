-- Rollback migration for competition schema extension
-- This reverses the changes made in 0001_bright_jigsaw.sql

-- Add back version column (if needed for rollback)
ALTER TABLE "competitions" ADD COLUMN "version" serial DEFAULT 1 NOT NULL;

-- Remove new columns
ALTER TABLE "competitions" DROP COLUMN "notes";
ALTER TABLE "competitions" DROP COLUMN "location";
ALTER TABLE "competitions" DROP COLUMN "actual_end";
ALTER TABLE "competitions" DROP COLUMN "actual_start";
ALTER TABLE "competitions" DROP COLUMN "scheduled_start";