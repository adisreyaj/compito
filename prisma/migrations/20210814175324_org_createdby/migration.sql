/*
  Warnings:

  - Added the required column `createdById` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Organization` ADD COLUMN `createdById` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Organization` ADD FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
