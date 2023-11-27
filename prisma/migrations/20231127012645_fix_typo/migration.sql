/*
  Warnings:

  - You are about to drop the column `secondaryEmergencyConctactNumber` on the `RegistrationEntry` table. All the data in the column will be lost.
  - Added the required column `secondaryEmergencyContactNumber` to the `RegistrationEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegistrationEntry" DROP COLUMN "secondaryEmergencyConctactNumber",
ADD COLUMN     "secondaryEmergencyContactNumber" TEXT NOT NULL;
