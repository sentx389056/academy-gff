import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// POST /api/admin/seed - creates initial admin user (only works if no users exist)
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Неверный секрет" }, { status: 403 });
  }

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    return NextResponse.json({ error: "Пользователи уже существуют" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@academy-gff.ru",
      password: hashedPassword,
      name: "Администратор",
      role: "ADMIN",
    },
  });

  return NextResponse.json({
    message: "Администратор создан",
    email: admin.email,
    password: "admin123 (смените пароль!)",
  });
}
