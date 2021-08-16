/*
  Warnings:

  - You are about to drop the column `roleId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.
  - Added the required column `permissions` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Role.roleId_unique` ON `Role`;

-- AlterTable
ALTER TABLE `Role` DROP COLUMN `roleId`,
    ADD COLUMN `permissions` JSON NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `roles`;

-- CreateTable
CREATE TABLE `UserRoleOrg` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRoleOrg` ADD FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoleOrg` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoleOrg` ADD FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
