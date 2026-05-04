import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function esc(val: string | null | undefined): string {
  if (!val) return "";
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cdata(val: unknown): string {
  const str = typeof val === "string" ? val : JSON.stringify(val ?? []);
  // Escape any ]]> sequences inside the content
  return `<![CDATA[${str.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  const where = idsParam
    ? { id: { in: idsParam.split(",").map(Number).filter(Boolean) } }
    : {};

  const courses = await prisma.course.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: {
      lessons: { orderBy: { order: "asc" } },
      programType: { select: { name: true } },
      level:       { select: { name: true } },
      format:      { select: { name: true } },
      teachers:    { select: { name: true } },
      groups:      { select: { name: true } },
    },
  });

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<export version="1.0" exportedAt="${new Date().toISOString()}" count="${courses.length}">`,
    "  <courses>",
  ];

  for (const c of courses) {
    const advantages  = Array.isArray(c.advantages)  ? (c.advantages  as string[]) : [];
    const requirements = Array.isArray(c.requirements) ? (c.requirements as string[]) : [];

    lines.push("    <course>");
    lines.push(`      <title>${esc(c.title)}</title>`);
    lines.push(`      <slug>${esc(c.slug)}</slug>`);
    lines.push(`      <description>${esc(c.description)}</description>`);
    lines.push(`      <image>${esc(c.image)}</image>`);
    lines.push(`      <published>${c.published}</published>`);
    lines.push(`      <duration>${esc(c.duration)}</duration>`);
    lines.push(`      <price>${esc(c.price)}</price>`);
    lines.push(`      <startDate>${c.startDate?.toISOString() ?? ""}</startDate>`);
    lines.push(`      <endDate>${c.endDate?.toISOString() ?? ""}</endDate>`);
    lines.push(`      <accessLevel>${c.accessLevel}</accessLevel>`);
    lines.push(`      <programType>${esc(c.programType?.name)}</programType>`);
    lines.push(`      <level>${esc(c.level?.name)}</level>`);
    lines.push(`      <format>${esc(c.format?.name)}</format>`);

    // Teachers
    lines.push("      <teachers>");
    for (const t of c.teachers) {
      lines.push(`        <teacher>${esc(t.name)}</teacher>`);
    }
    lines.push("      </teachers>");

    // Groups
    lines.push("      <groups>");
    for (const g of c.groups) {
      lines.push(`        <group>${esc(g.name)}</group>`);
    }
    lines.push("      </groups>");

    // Advantages
    lines.push("      <advantages>");
    for (const item of advantages) {
      lines.push(`        <item>${esc(item)}</item>`);
    }
    lines.push("      </advantages>");

    // Requirements
    lines.push("      <requirements>");
    for (const item of requirements) {
      lines.push(`        <item>${esc(item)}</item>`);
    }
    lines.push("      </requirements>");

    // Course modules (JSON in CDATA)
    lines.push(`      <modules>${cdata(c.modules)}</modules>`);

    // Lessons
    lines.push("      <lessons>");
    for (const lesson of c.lessons) {
      lines.push("        <lesson>");
      lines.push(`          <title>${esc(lesson.title)}</title>`);
      lines.push(`          <slug>${esc(lesson.slug)}</slug>`);
      lines.push(`          <order>${lesson.order}</order>`);
      lines.push(`          <modules>${cdata(lesson.modules)}</modules>`);
      lines.push("        </lesson>");
    }
    lines.push("      </lessons>");

    lines.push("    </course>");
  }

  lines.push("  </courses>");
  lines.push("</export>");

  const xml = lines.join("\n");
  const ts = new Date().toISOString().slice(0, 10);
  const filename = idsParam
    ? `course-${idsParam.replace(/,/g, "-")}.xml`
    : `courses-export-${ts}.xml`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
