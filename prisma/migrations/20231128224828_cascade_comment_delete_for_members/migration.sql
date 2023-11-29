-- DropForeignKey
ALTER TABLE "AnnouncementComment" DROP CONSTRAINT "AnnouncementComment_commenterId_fkey";

-- AddForeignKey
ALTER TABLE "AnnouncementComment" ADD CONSTRAINT "AnnouncementComment_commenterId_fkey" FOREIGN KEY ("commenterId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
