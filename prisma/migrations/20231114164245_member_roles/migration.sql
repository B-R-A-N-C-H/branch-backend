-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEACHER', 'HEAD_TEACHER', 'PRINCIPAL', 'ADMIN');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "role" "Role",
ADD COLUMN     "teachingLevel" INTEGER;
