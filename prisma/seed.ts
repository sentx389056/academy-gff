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

    // ── Courses ──────────────────────────────────────────────
    const ptPovyshenie = await prisma.programType.findUnique({
        where: { name: "Программа повышения квалификации" },
    });
    const ptPereподготовка = await prisma.programType.findUnique({
        where: { name: "Программа профессиональной переподготовки" },
    });
    const lvlSredny = await prisma.learningLevel.findUnique({
        where: { name: "Средний" },
    });
    const lvlProdvinu = await prisma.learningLevel.findUnique({
        where: { name: "Продвинутый" },
    });
    const fmtOchny = await prisma.learningFormat.findUnique({
        where: { name: "Очный" },
    });
    const fmtSmesh = await prisma.learningFormat.findUnique({
        where: { name: "Смешанный" },
    });

    const coursesData = [
        {
            slug: "istoriya-otechestvennogo-kino",
            title: "История отечественного кино",
            description:
                "Углублённый курс по истории советского и российского кинематографа — от немого кино до современных блокбастеров. Изучение ключевых режиссёров, школ и направлений.",
            programTypeId: ptPovyshenie?.id ?? null,
            levelId: lvlSredny?.id ?? null,
            formatId: fmtOchny?.id ?? null,
            duration: "72 ак.ч",
            price: "25 000 ₽",
            published: true,
            startDate: new Date("2026-06-01"),
            endDate: new Date("2026-07-24"),
            modules: [],
        },
        {
            slug: "restavratsiya-i-tsifrovizatsiya-kinoplenki",
            title: "Реставрация и оцифровка киноплёнки",
            description:
                "Практический курс по методам реставрации архивных киноматериалов и современным технологиям цифрового восстановления. Работа с реальными архивными фондами Госфильмофонда.",
            programTypeId: ptPereподготовка?.id ?? null,
            levelId: lvlProdvinu?.id ?? null,
            formatId: fmtSmesh?.id ?? null,
            duration: "144 ак.ч",
            price: "45 000 ₽",
            published: true,
            startDate: new Date("2026-09-01"),
            endDate: new Date("2026-12-31"),
            modules: [],
        },
    ];

    for (const c of coursesData) {
        await prisma.course.upsert({
            where: { slug: c.slug },
            update: {
                title: c.title,
                description: c.description,
                programTypeId: c.programTypeId,
                levelId: c.levelId,
                formatId: c.formatId,
                duration: c.duration,
                price: c.price,
                published: c.published,
                startDate: c.startDate,
                endDate: c.endDate,
            },
            create: c,
        });
        console.log(`✓ Course seeded: ${c.title}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
