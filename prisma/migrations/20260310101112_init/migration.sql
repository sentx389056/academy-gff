/*
  Warnings:

  - You are about to drop the column `format` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `programType` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Practice` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `Practice` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `isManagement` on the `Staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "format",
DROP COLUMN "level",
DROP COLUMN "programType",
ADD COLUMN     "advantages" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "formatId" INTEGER,
ADD COLUMN     "levelId" INTEGER,
ADD COLUMN     "programTypeId" INTEGER,
ADD COLUMN     "requirements" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Practice" DROP COLUMN "category",
DROP COLUMN "format",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "formatId" INTEGER;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "isManagement",
ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "hidePhone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "staffTypeId" INTEGER;

-- CreateTable
CREATE TABLE "StaffType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StaffType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProgramType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningLevel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LearningLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningFormat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LearningFormat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PracticeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseTeachers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CourseTeachers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffType_name_key" ON "StaffType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramType_name_key" ON "ProgramType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LearningLevel_name_key" ON "LearningLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LearningFormat_name_key" ON "LearningFormat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeCategory_name_key" ON "PracticeCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCategory_name_key" ON "ProjectCategory"("name");

-- CreateIndex
CREATE INDEX "_CourseTeachers_B_index" ON "_CourseTeachers"("B");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_programTypeId_fkey" FOREIGN KEY ("programTypeId") REFERENCES "ProgramType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "LearningLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "LearningFormat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_staffTypeId_fkey" FOREIGN KEY ("staffTypeId") REFERENCES "StaffType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PracticeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "LearningFormat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProjectCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseTeachers" ADD CONSTRAINT "_CourseTeachers_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseTeachers" ADD CONSTRAINT "_CourseTeachers_B_fkey" FOREIGN KEY ("B") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
