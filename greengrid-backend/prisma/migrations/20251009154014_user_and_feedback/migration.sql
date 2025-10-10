/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `joinedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nic]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nic` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_reportedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_updatedById_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "avatarUrl",
DROP COLUMN "isActive",
DROP COLUMN "joinedAt",
DROP COLUMN "lastLogin",
DROP COLUMN "phoneNumber",
DROP COLUMN "role",
ADD COLUMN     "nic" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Report";

-- DropEnum
DROP TYPE "public"."Priority";

-- DropEnum
DROP TYPE "public"."ReportType";

-- DropEnum
DROP TYPE "public"."Role";

-- DropEnum
DROP TYPE "public"."Status";

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nic_key" ON "User"("nic");
