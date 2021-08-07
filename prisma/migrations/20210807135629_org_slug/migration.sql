/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Organization.name_unique` ON `Organization`;

-- AlterTable
ALTER TABLE `Organization` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Organization.slug_unique` ON `Organization`(`slug`);
