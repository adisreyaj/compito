/*
  Warnings:

  - You are about to drop the column `orgId` on the `User` table. All the data in the column will be lost.
  - Added the required column `lists` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_ibfk_1`;

-- AlterTable
ALTER TABLE `Board` ADD COLUMN `lists` JSON NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `orgId`;

-- CreateTable
CREATE TABLE `_OrganizationToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_OrganizationToUser_AB_unique`(`A`, `B`),
    INDEX `_OrganizationToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_OrganizationToUser` ADD FOREIGN KEY (`A`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrganizationToUser` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
