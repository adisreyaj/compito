/*
  Warnings:

  - You are about to drop the column `projectId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[createdById]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_ibfk_4`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `projectId`;

-- CreateTable
CREATE TABLE `_members` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_members_AB_unique`(`A`, `B`),
    INDEX `_members_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Project_createdById_unique` ON `Project`(`createdById`);

-- AddForeignKey
ALTER TABLE `_members` ADD FOREIGN KEY (`A`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_members` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
