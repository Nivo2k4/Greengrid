-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('general', 'emergency', 'feedback', 'complaint', 'hazardous_waste', 'illegal_dumping', 'maintenance');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ReportType" NOT NULL DEFAULT 'general',
    "description" TEXT,
    "location" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "status" "Status" NOT NULL DEFAULT 'open',
    "images" JSONB,
    "contactInfo" JSONB,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "adminNotes" TEXT,
    "responseTeam" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "reportedById" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
