-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_likedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_likedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_likedUsers_B_index" ON "_likedUsers"("B");

-- AddForeignKey
ALTER TABLE "_likedUsers" ADD CONSTRAINT "_likedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedUsers" ADD CONSTRAINT "_likedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
