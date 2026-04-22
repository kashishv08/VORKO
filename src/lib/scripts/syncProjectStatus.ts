
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const completedContracts = await prisma.contract.findMany({
    where: { status: 'COMPLETED' },
    select: { projectId: true }
  });

  const projectIds = completedContracts.map(c => c.projectId);

  const result = await prisma.project.updateMany({
    where: {
      id: { in: projectIds },
      status: 'HIRED'
    },
    data: { status: 'CLOSED' }
  });

  console.log(`Updated ${result.count} projects to CLOSED status.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
