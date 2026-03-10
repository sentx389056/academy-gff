import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: adapter as any,
});

const usersData = [
    {
        name: "d_admin",
        email: "erebakan.d@gff-rf.ru",
        password: "Obohze85",
        role: "ADMIN" as const,
    },
    {
        name: "m_admin",
        email: "jurtsev.m@gff-rf.ru",
        password: "Kpiomb28",
        role: "ADMIN" as const,
    },
    {
        name: "a_admin",
        email: "hehtel.as@gff-rf.ru",
        password: "Keypah124",
        role: "ADMIN" as const,
    },
];

async function main() {
    // ── Users ────────────────────────────────────────────────
    for (const u of usersData) {
        const hashedPassword = await bcrypt.hash(u.password, 12);
        await prisma.user.upsert({
            where: { email: u.email },
            update: { password: hashedPassword },
            create: {
                name: u.name,
                email: u.email,
                password: hashedPassword,
                role: u.role,
            },
        });
        console.log(`✓ User seeded: ${u.email}`);
    }

    // ── StaffType ────────────────────────────────────────────
    const staffTypes = [
        { name: "Руководство",          order: 1 },
        { name: "Педагогический состав", order: 2 },
    ];
    for (const t of staffTypes) {
        await prisma.staffType.upsert({
            where: { name: t.name },
            update: { order: t.order },
            create: t,
        });
    }
    console.log("✓ StaffTypes seeded");

    // ── ProgramType ──────────────────────────────────────────
    const programTypes = [
        { name: "Программа повышения квалификации",         order: 1 },
        { name: "Программа профессиональной переподготовки", order: 2 },
        { name: "Дополнительная образовательная программа", order: 3 },
    ];
    for (const t of programTypes) {
        await prisma.programType.upsert({
            where: { name: t.name },
            update: { order: t.order },
            create: t,
        });
    }
    console.log("✓ ProgramTypes seeded");

    // ── LearningLevel ────────────────────────────────────────
    const learningLevels = [
        { name: "Начальный",    order: 1 },
        { name: "Средний",      order: 2 },
        { name: "Продвинутый",  order: 3 },
    ];
    for (const t of learningLevels) {
        await prisma.learningLevel.upsert({
            where: { name: t.name },
            update: { order: t.order },
            create: t,
        });
    }
    console.log("✓ LearningLevels seeded");

    // ── LearningFormat ───────────────────────────────────────
    const learningFormats = [
        { name: "Очный",      order: 1 },
        { name: "Онлайн",     order: 2 },
        { name: "Смешанный",  order: 3 },
        { name: "Заочный",    order: 4 },
    ];
    for (const t of learningFormats) {
        await prisma.learningFormat.upsert({
            where: { name: t.name },
            update: { order: t.order },
            create: t,
        });
    }
    console.log("✓ LearningFormats seeded");

    // ── PracticeCategory ─────────────────────────────────────
    const practiceCategories = [
        { name: "Практика",    order: 1 },
        { name: "Стажировка",  order: 2 },
    ];
    for (const t of practiceCategories) {
        await prisma.practiceCategory.upsert({
            where: { name: t.name },
            update: { order: t.order },
            create: t,
        });
    }
    console.log("✓ PracticeCategories seeded");

    // ── ProjectCategory ──────────────────────────────────────
    const projectCategories = [
        { name: "Исследовательский", order: 1 },
        { name: "Прикладной",        order: 2 },
        { name: "Студенческий",      order: 3 },
    ];
    for (const t of projectCategories) {
        await prisma.projectCategory.upsert({
            where: { name: t.name },
            update: { order: t.order },
            create: t,
        });
    }
    console.log("✓ ProjectCategories seeded");

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
