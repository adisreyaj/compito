/*
  Warnings:

  - Added the required column `image` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `blocked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false;
