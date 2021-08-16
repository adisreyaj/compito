/*
  Warnings:

  - Made the column `taskId` on table `SubTask` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `SubTask` DROP FOREIGN KEY `SubTask_ibfk_3`;

-- AlterTable
ALTER TABLE `SubTask` MODIFY `taskId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `SubTask` ADD FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
