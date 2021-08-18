/*
  Warnings:

  - Added the required column `email` to the `UserInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserInvite" ADD COLUMN     "email" TEXT NOT NULL;
