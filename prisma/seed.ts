import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Prisma, PrismaClient } from "../src/generated/prisma";
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
    for (const u of usersData) {
        const hashedPassword = await bcrypt.hash(u.password, 12);
        const data: Prisma.UserCreateInput = {
            name: u.name,
            email: u.email,
            password: hashedPassword,
            role: u.role,
        };
        await prisma.user.upsert({
            where: { email: u.email },
            update: { password: hashedPassword },
            create: data,
        });
        console.log(`✓ User seeded: ${u.email}`);
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
