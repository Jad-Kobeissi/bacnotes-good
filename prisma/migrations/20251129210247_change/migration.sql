/*
  Warnings:

  - You are about to drop the column `filesUrl` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "filesUrl",
ADD COLUMN     "imagesUrl" TEXT[];
