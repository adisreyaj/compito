import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: 'compito-org' },
    update: {},
    create: {
      name: 'Compito',
      slug: 'compito-org',
    },
  });
  const admin = await prisma.user.upsert({
    where: { email: 'adi.sreyaj@gmail.com' },
    update: {},
    create: {
      email: 'adi.sreyaj@gmail.com',
      firstName: 'Adithya',
      lastName: 'Sreyaj',
      password: '$2a$12$0.g5pAEI55Fl57yd8zpxne61oxPEkL79z5Uwu7zKRKeIWphfV//NW',
      org: {
        connect: { id: org.id },
      },
    },
  });
  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
