
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const projects = await prisma.project.findMany({
    select: { id: true, title: true, status: true }
  });
  console.log(JSON.stringify(projects, null, 2));
}
main().finally(() => prisma.$disconnect());
