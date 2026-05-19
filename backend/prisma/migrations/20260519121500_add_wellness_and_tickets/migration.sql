-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('MENTAL_WELLNESS', 'ACADEMIC', 'HOSTEL', 'PLACEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "currentWellnessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Gender";

-- CreateTable
CREATE TABLE "WellnessAssessment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mentalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "academicScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hostelScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "placementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lifestyleScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalWellnessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wellnessStatus" TEXT NOT NULL DEFAULT 'Unknown',
    "m1_exhaustion" INTEGER NOT NULL,
    "m2_sleep" INTEGER NOT NULL,
    "m3_motivation" INTEGER NOT NULL,
    "m4_concentration" INTEGER NOT NULL,
    "m5_isolation" INTEGER NOT NULL,
    "a1_assignment" INTEGER NOT NULL,
    "a2_exam" INTEGER NOT NULL,
    "a3_backlog" INTEGER NOT NULL,
    "a4_time_mgmt" INTEGER NOT NULL,
    "a5_attendance" INTEGER NOT NULL,
    "h1_food" INTEGER NOT NULL,
    "h2_cleanliness" INTEGER NOT NULL,
    "h3_internet" INTEGER NOT NULL,
    "h4_noise" INTEGER NOT NULL,
    "h5_safety" INTEGER NOT NULL,
    "p1_anxiety" INTEGER NOT NULL,
    "p2_technical" INTEGER NOT NULL,
    "p3_resume" INTEGER NOT NULL,
    "p4_interview" INTEGER NOT NULL,
    "p5_unemployment" INTEGER NOT NULL,
    "l1_physical" INTEGER NOT NULL,
    "l2_social" INTEGER NOT NULL,
    "l3_screen_time" INTEGER NOT NULL,
    "l4_sleep_routine" INTEGER NOT NULL,
    "l5_campus_activity" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WellnessAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "TicketType" NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "message" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WellnessAssessment_studentId_createdAt_idx" ON "WellnessAssessment"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "WellnessAssessment_finalWellnessScore_idx" ON "WellnessAssessment"("finalWellnessScore");

-- CreateIndex
CREATE INDEX "SupportTicket_studentId_idx" ON "SupportTicket"("studentId");

-- CreateIndex
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- CreateIndex
CREATE INDEX "SupportTicket_priority_idx" ON "SupportTicket"("priority");

-- AddForeignKey
ALTER TABLE "WellnessAssessment" ADD CONSTRAINT "WellnessAssessment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
