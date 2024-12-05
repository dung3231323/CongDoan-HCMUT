-- DropIndex
DROP INDEX "Participant_email_key";

-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "email" SET DEFAULT 'vanA@gmail.com';
