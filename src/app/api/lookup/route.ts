import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [
    staffTypes,
    programTypes,
    learningLevels,
    learningFormats,
    practiceCategories,
    projectCategories,
  ] = await Promise.all([
    prisma.staffType.findMany({ orderBy: { order: "asc" } }),
    prisma.programType.findMany({ orderBy: { order: "asc" } }),
    prisma.learningLevel.findMany({ orderBy: { order: "asc" } }),
    prisma.learningFormat.findMany({ orderBy: { order: "asc" } }),
    prisma.practiceCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.projectCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  return NextResponse.json({
    staffTypes,
    programTypes,
    learningLevels,
    learningFormats,
    practiceCategories,
    projectCategories,
  });
}
