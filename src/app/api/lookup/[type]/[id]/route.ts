import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type LookupType =
  | "staffTypes"
  | "programTypes"
  | "learningLevels"
  | "learningFormats"
  | "practiceCategories"
  | "projectCategories";

const modelMap: Record<LookupType, string> = {
  staffTypes:         "staffType",
  programTypes:       "programType",
  learningLevels:     "learningLevel",
  learningFormats:    "learningFormat",
  practiceCategories: "practiceCategory",
  projectCategories:  "projectCategory",
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { type, id } = await params;
  const model = modelMap[type as LookupType];
  if (!model) return NextResponse.json({ error: "Неизвестный тип" }, { status: 400 });

  const { name, order } = await request.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const repo = (prisma as any)[model];
  const item = await repo.update({
    where: { id: parseInt(id) },
    data: { ...(name !== undefined && { name }), ...(order !== undefined && { order }) },
  });
  return NextResponse.json(item);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { type, id } = await params;
  const model = modelMap[type as LookupType];
  if (!model) return NextResponse.json({ error: "Неизвестный тип" }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any)[model].delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
