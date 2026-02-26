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

const modelMap: Record<LookupType, keyof typeof prisma> = {
  staffTypes:         "staffType",
  programTypes:       "programType",
  learningLevels:     "learningLevel",
  learningFormats:    "learningFormat",
  practiceCategories: "practiceCategory",
  projectCategories:  "projectCategory",
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { type } = await params;
  const model = modelMap[type as LookupType];
  if (!model) {
    return NextResponse.json({ error: "Неизвестный тип" }, { status: 400 });
  }

  const { name } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Название обязательно" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const repo = (prisma as any)[model as string];
  const maxOrder = await repo.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? 0) + 1;

  const item = await repo.create({ data: { name: name.trim(), order: nextOrder } });
  return NextResponse.json(item, { status: 201 });
}
