import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';
import { deleteMedia } from '@/lib/media/storage';
import { logAuditEvent } from '@/lib/auth/audit';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, 'media:manage')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const success = await deleteMedia(id);

    if (!success) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    await logAuditEvent({
      userId: user.id,
      action: 'MEDIA_DELETE',
      entityType: 'ArticleImage',
      entityId: id,
    });

    return NextResponse.json({ success: true, message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('Delete media error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
