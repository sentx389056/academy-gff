import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { AccessLevel } from "@/generated/prisma";

// Extract string from CDATA wrapper or plain text value
function textOf(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    // fast-xml-parser stores CDATA under cdataPropName key
    const o = val as Record<string, unknown>;
    if ("__cdata" in o) return String(o.__cdata ?? "");
  }
  return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJson(val: unknown): any[] {
  const str = textOf(val);
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toArray<T>(val: T | T[] | undefined): T[] {
  if (val === undefined || val === null) return [];
  return Array.isArray(val) ? val : [val];
}

const VALID_ACCESS: Set<string> = new Set(["PUBLIC", "AUTH_REQUIRED", "GROUP_ONLY"]);

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
  }

  const xmlText = await file.text();
  if (!xmlText.trim()) {
    return NextResponse.json({ error: "Файл пустой" }, { status: 400 });
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: "__cdata",
    isArray: (tagName) => ["course", "lesson", "item", "teacher", "group"].includes(tagName),
    parseTagValue: false,
    trimValues: true,
  });

  let parsed: Record<string, unknown>;
  try {
    parsed = parser.parse(xmlText);
  } catch {
    return NextResponse.json({ error: "Ошибка разбора XML — проверьте формат файла" }, { status: 400 });
  }

  const root = parsed?.export as Record<string, unknown> | undefined;
  if (!root) {
    return NextResponse.json({ error: "Неверная структура XML: ожидается корневой элемент <export>" }, { status: 400 });
  }

  const coursesWrapper = root.courses as Record<string, unknown> | undefined;
  const courseList = toArray(coursesWrapper?.course as unknown) as Record<string, unknown>[];

  if (courseList.length === 0) {
    return NextResponse.json({ error: "В файле не найдено ни одного курса" }, { status: 400 });
  }

  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const courseData of courseList) {
    const slug = textOf(courseData.slug);
    const title = textOf(courseData.title);

    if (!slug || !title) {
      errors.push(`Пропущен курс без slug или названия`);
      continue;
    }

    try {
      const accessLevelRaw = textOf(courseData.accessLevel).toUpperCase();
      const accessLevel: AccessLevel = VALID_ACCESS.has(accessLevelRaw)
        ? (accessLevelRaw as AccessLevel)
        : "PUBLIC";

      const startDateStr = textOf(courseData.startDate);
      const endDateStr   = textOf(courseData.endDate);

      const advantages  = toArray(
        (courseData.advantages as Record<string, unknown> | undefined)?.item
      ).map(textOf).filter(Boolean);

      const requirements = toArray(
        (courseData.requirements as Record<string, unknown> | undefined)?.item
      ).map(textOf).filter(Boolean);

      const courseModules = parseJson(courseData.modules);

      const payload = {
        title,
        description:  textOf(courseData.description)  || null,
        image:        textOf(courseData.image)         || null,
        published:    textOf(courseData.published) === "true",
        duration:     textOf(courseData.duration)      || null,
        price:        textOf(courseData.price)         || null,
        startDate:    startDateStr ? new Date(startDateStr) : null,
        endDate:      endDateStr   ? new Date(endDateStr)   : null,
        accessLevel,
        modules:      courseModules,
        advantages,
        requirements,
      };

      // Validate dates
      if (payload.startDate && isNaN(payload.startDate.getTime())) payload.startDate = null;
      if (payload.endDate   && isNaN(payload.endDate.getTime()))   payload.endDate   = null;

      // Parse lessons
      const lessonsWrapper = courseData.lessons as Record<string, unknown> | undefined;
      const lessonList = toArray(lessonsWrapper?.lesson as unknown) as Record<string, unknown>[];

      const lessonsPayload = lessonList
        .map((l) => ({
          title:   textOf(l.title),
          slug:    textOf(l.slug),
          order:   parseInt(textOf(l.order), 10) || 0,
          modules: parseJson(l.modules),
        }))
        .filter((l) => l.slug && l.title);

      // Create or update
      const existing = await prisma.course.findUnique({ where: { slug } });

      if (existing) {
        await prisma.course.update({ where: { slug }, data: payload });
        // Recreate lessons: delete old, insert new
        await prisma.lesson.deleteMany({ where: { courseId: existing.id } });
        for (const lesson of lessonsPayload) {
          await prisma.lesson.create({ data: { courseId: existing.id, ...lesson } });
        }
        updated++;
      } else {
        const newCourse = await prisma.course.create({ data: { ...payload, slug } });
        for (const lesson of lessonsPayload) {
          await prisma.lesson.create({ data: { courseId: newCourse.id, ...lesson } });
        }
        created++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "неизвестная ошибка";
      errors.push(`«${title}» (${slug}): ${msg}`);
    }
  }

  return NextResponse.json({
    created,
    updated,
    errors,
    total: created + updated,
  });
}
