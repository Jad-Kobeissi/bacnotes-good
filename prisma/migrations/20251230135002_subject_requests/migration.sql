/*
  Warnings:

  - Added the required column `subject` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('ENGLISH', 'ARABIC', 'MATH', 'FRENCH', 'BIOLOGY', 'PHYSICS', 'CHEMISTRY', 'GEOGRAPHY', 'CIVICS', 'HISTORY');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "subject" "Subject" NOT NULL;

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subject" "Subject" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);
