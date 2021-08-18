/*
  Warnings:

  - You are about to drop the column `userId` on the `UserInvite` table. All the data in the column will be lost.
  - Added the required column `invitedById` to the `UserInvite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserInvite" DROP CONSTRAINT "UserInvite_userId_fkey";

-- AlterTable
ALTER TABLE "UserInvite" DROP COLUMN "userId",
ADD COLUMN     "invitedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserInvite" ADD FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
