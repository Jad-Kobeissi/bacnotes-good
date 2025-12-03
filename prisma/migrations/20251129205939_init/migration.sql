/*
  Warnings:

  - You are about to drop the column `imagesUrl` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imagesUrl",
ADD COLUMN     "filesUrl" TEXT[];
