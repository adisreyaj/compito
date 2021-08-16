/*
  Warnings:

  - You are about to drop the column `subTaskId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_ibfk_3`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_ibfk_2`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `subTaskId`,
    DROP COLUMN `taskId`;

-- CreateTable
CREATE TABLE `_assignees` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_assignees_AB_unique`(`A`, `B`),
    INDEX `_assignees_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_subTaskAssignees` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_subTaskAssignees_AB_unique`(`A`, `B`),
    INDEX `_subTaskAssignees_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_assignees` ADD FOREIGN KEY (`A`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_assignees` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_subTaskAssignees` ADD FOREIGN KEY (`A`) REFERENCES `SubTask`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_subTaskAssignees` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
