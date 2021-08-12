/*
  Warnings:

  - You are about to drop the column `stateDate` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `stateDate`,
    ADD COLUMN `startDate` DATETIME(3);
