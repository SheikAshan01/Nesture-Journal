import prisma from '@/lib/db';

export async function logAuditEvent({
  userId,
  action,
  entityType,
  entityId,
  details,
  ipAddress,
}: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, any> | string;
  ipAddress?: string | null;
}) {
  try {
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : details;
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entityType,
        entityId: entityId || null,
        details: detailsStr || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    console.error('[AuditLog] Failed to record audit log:', err);
  }
}
