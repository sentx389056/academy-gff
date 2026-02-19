import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getSession } from "@/lib/auth";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать файл" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Недопустимый тип файла: ${file.type}. Разрешены: JPG, PNG, GIF, WEBP, SVG, MP4, WEBM, OGG, MOV, AVI` },
      { status: 400 }
    );
  }

  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    const limitMb = maxSize / 1024 / 1024;
    return NextResponse.json(
      { error: `Файл слишком большой. Максимум: ${limitMb} МБ` },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Folder by month: uploads/2025-01/
  const now = new Date();
  const folder = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // Safe filename: random prefix + sanitized original name
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const randomId = Math.random().toString(36).slice(2, 9);
  const filename = `${randomId}.${ext}`;

  const uploadDir = join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);

  const url = `/uploads/${folder}/${filename}`;

  return NextResponse.json({
    url,
    name: file.name,
    type: file.type,
    size: file.size,
    isVideo,
  });
}
