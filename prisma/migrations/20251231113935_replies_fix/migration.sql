/*
  Warnings:

  - You are about to drop the `_ReplyToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Reply` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ReplyToUser" DROP CONSTRAINT "_ReplyToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReplyToUser" DROP CONSTRAINT "_ReplyToUser_B_fkey";

-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "authorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ReplyToUser";

-- CreateTable
CREATE TABLE "_likesReply" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_likesReply_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_likesReply_B_index" ON "_likesReply"("B");

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likesReply" ADD CONSTRAINT "_likesReply_A_fkey" FOREIGN KEY ("A") REFERENCES "Reply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likesReply" ADD CONSTRAINT "_likesReply_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
