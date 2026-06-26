-- Add new columns to competitions table
ALTER TABLE "competitions" ADD COLUMN "scheduled_start" timestamp NOT NULL DEFAULT now();
ALTER TABLE "competitions" ADD COLUMN "actual_start" timestamp;
ALTER TABLE "competitions" ADD COLUMN "actual_end" timestamp;
ALTER TABLE "competitions" ADD COLUMN "location" text;
ALTER TABLE "competitions" ADD COLUMN "notes" text;

-- Drop version column (not needed for MVP)
ALTER TABLE "competitions" DROP COLUMN "version";