import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ROLES_PERMISSIONS = [
  {
    name: 'super-admin',
    permissions: [
      'role:create',
      'role:read',
      'role:update',
      'role:delete',
      'user:create',
      'user:read',
      'user:update',
      'user:delete',
      'org:create',
      'org:read',
      'org:update',
      'org:delete',
      'project:create',
      'project:read',
      'project:update',
      'project:delete',
      'board:create',
      'board:read',
      'board:update',
      'board:delete',
      'task:create',
      'task:read',
      'task:update',
      'task:delete',
    ],
  },
  {
    name: 'admin',
    permissions: [
      'role:read',
      'user:create',
      'user:read',
      'user:update',
      'user:delete',
      'org:create',
      'org:read',
      'org:update',
      'org:delete',
      'project:create',
      'project:read',
      'project:update',
      'project:delete',
      'board:create',
      'board:read',
      'board:update',
      'board:delete',
      'task:create',
      'task:read',
      'task:update',
      'task:delete',
    ],
  },
  {
    name: 'org-admin',
    permissions: [
      'role:read',
      'user:read',
      'org:create',
      'org:read',
      'org:update',
      'org:delete',
      'project:create',
      'project:read',
      'project:update',
      'project:delete',
      'board:create',
      'board:read',
      'board:update',
      'board:delete',
      'task:create',
      'task:read',
      'task:update',
      'task:delete',
    ],
  },
  {
    name: 'project-admin',
    permissions: [
      'user:read',
      'org:create',
      'org:read',
      'org:update',
      'org:delete',
      'project:read',
      'project:update',
      'board:create',
      'board:read',
      'board:update',
      'board:delete',
      'task:create',
      'task:read',
      'task:update',
      'task:delete',
    ],
  },
  {
    name: 'user',
    permissions: [
      'user:read',
      'org:create',
      'org:read',
      'org:update',
      'org:delete',
      'project:read',
      'board:create',
      'board:read',
      'board:update',
      'board:delete',
      'task:create',
      'task:read',
      'task:update',
      'task:delete',
    ],
  },
];

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'adi.sreyaj@gmail.com' },
    update: {},
    create: {
      email: 'adi.sreyaj@gmail.com',
      firstName: 'Adithya',
      lastName: 'Sreyaj',
      password: '$2a$12$0.g5pAEI55Fl57yd8zpxne61oxPEkL79z5Uwu7zKRKeIWphfV//NW',
    },
  });
  console.log(`User Created Successfully!`, admin.id);
  const org = await prisma.organization.upsert({
    where: { slug: 'compito-org' },
    update: {},
    create: {
      name: 'Compito',
      slug: 'compito-org',
      createdById: admin.id,
    },
  });
  console.log(`Org Created Successfully!`, org.id);
  const rolesData: Prisma.RoleCreateManyInput[] = ROLES_PERMISSIONS.map((item) => ({
    name: item.name,
    permissions: item.permissions,
  }));
  const roles = await prisma.role.createMany({ data: rolesData });
  console.log(`Roles Created Successfully!`, roles.count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
