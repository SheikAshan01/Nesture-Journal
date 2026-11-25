import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

const ALL_PERMISSIONS = [
  { name: 'article:create', description: 'Create new articles' },
  { name: 'article:edit', description: 'Edit articles' },
  { name: 'article:publish', description: 'Publish/unpublish articles' },
  { name: 'article:delete', description: 'Delete articles' },
  { name: 'category:manage', description: 'Manage categories' },
  { name: 'media:upload', description: 'Upload media assets' },
  { name: 'seo:manage', description: 'Manage SEO metadata' },
  { name: 'settings:manage', description: 'Manage platform settings' },
  { name: 'user:manage', description: 'Manage users and roles' },
];

export async function ensureRoleWithPermissions(roleName: 'SUPER_ADMIN' | 'EDITOR') {
  // Ensure permissions exist
  for (const perm of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  let role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) {
    role = await prisma.role.create({
      data: {
        name: roleName,
        description:
          roleName === 'SUPER_ADMIN'
            ? 'Full platform & editorial administrator'
            : 'Senior Editorial Staff & Content Publisher',
      },
    });
  }

  // Attach permissions to role if missing
  const perms = await prisma.permission.findMany();
  for (const p of perms) {
    const targetPerms =
      roleName === 'SUPER_ADMIN'
        ? perms
        : perms.filter((x) => !['user:manage', 'settings:manage'].includes(x.name));
    if (targetPerms.some((tp) => tp.id === p.id)) {
      await prisma.rolePermission
        .upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: p.id } },
          update: {},
          create: { roleId: role.id, permissionId: p.id },
        })
        .catch(() => {});
    }
  }

  return role;
}

export async function ensureDefaultTestAccount(email: string) {
  const clean = email.toLowerCase().trim();
  if (clean !== 'admin@nesturejournal.com' && clean !== 'editor@nesturejournal.com') {
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email: clean } });
  if (existing) return;

  const isSuper = clean === 'admin@nesturejournal.com';
  const role = await ensureRoleWithPermissions(isSuper ? 'SUPER_ADMIN' : 'EDITOR');
  const passwordHash = await bcrypt.hash(
    isSuper ? 'AdminPassword@2026!' : 'EditorPassword@2026!',
    12
  );

  const user = await prisma.user.create({
    data: {
      email: clean,
      name: isSuper ? 'Director' : 'Senior Editor',
      passwordHash,
      roleId: role.id,
      isActive: true,
    },
  });

  await prisma.author
    .upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: user.name,
        slug: isSuper ? 'director-editorial' : 'senior-editor',
        roleTitle: isSuper ? 'Editor-in-Chief' : 'Senior Real Estate Editor',
        email: user.email,
      },
    })
    .catch(() => {});
}
