/*
  Warnings:

  - Added the required column `mimeType` to the `RegistrationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegistrationDocument" ADD COLUMN     "mimeType" TEXT NOT NULL;
