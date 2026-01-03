-- DropForeignKey
ALTER TABLE "PostReport" DROP CONSTRAINT "PostReport_postId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyReport" DROP CONSTRAINT "ReplyReport_replyId_fkey";

-- DropForeignKey
ALTER TABLE "RequestReport" DROP CONSTRAINT "RequestReport_requestId_fkey";

-- AddForeignKey
ALTER TABLE "PostReport" ADD CONSTRAINT "PostReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestReport" ADD CONSTRAINT "RequestReport_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyReport" ADD CONSTRAINT "ReplyReport_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE CASCADE ON UPDATE CASCADE;
