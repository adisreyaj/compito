/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Made the column `label` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "label" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role.label_unique" ON "Role"("label");
