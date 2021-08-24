import { Prisma, PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
config();
const prisma = new PrismaClient();

const ROLES_PERMISSIONS = [
  {
    name: 'super-admin',
    label: 'Super Admin',
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
    label: 'Admin',
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
    label: 'Org Admin',
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
    label: 'Project Admin',
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
    label: 'User',
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
  const rolesData: Prisma.RoleCreateManyInput[] = ROLES_PERMISSIONS.map((item) => ({
    name: item.name,
    label: item.label,
    permissions: item.permissions,
  }));
  const roles = await Promise.all(
    rolesData.map((data) => {
      return prisma.role.upsert({
        where: { name: data.name },
        update: {},
        create: {
          name: data.name,
          label: data.label,
          permissions: data.permissions,
        },
      });
    }),
  );
  console.log(`Roles Created Successfully!`, roles.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
