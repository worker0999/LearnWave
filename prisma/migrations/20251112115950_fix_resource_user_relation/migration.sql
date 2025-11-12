/*
  Warnings:

  - You are about to drop the column `file_size` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `file_type` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `file_url` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `resources` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `resources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resources" DROP COLUMN "file_size",
DROP COLUMN "file_type",
DROP COLUMN "file_url",
DROP COLUMN "updated_at",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "semester" INTEGER NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "unit" TEXT;
