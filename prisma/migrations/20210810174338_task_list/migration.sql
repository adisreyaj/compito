/*
  Warnings:

  - Added the required column `list` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` ADD COLUMN `list` VARCHAR(191) NOT NULL;
