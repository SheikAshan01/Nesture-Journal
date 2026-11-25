import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import prisma from '@/lib/db';

const UPLOAD_BASE_DIR = path.resolve(process.cwd(), 'public', 'uploads');
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_BASE_DIR)) {
    fs.mkdirSync(UPLOAD_BASE_DIR, { recursive: true });
  }
}

export interface ProcessedMedia {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  alt?: string;
}

export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string,
  altText?: string
): Promise<ProcessedMedia> {
  ensureUploadDir();

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(`Unsupported image type "${mimeType}". Allowed: JPEG, PNG, WebP, AVIF.`);
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size ${(buffer.length / (1024 * 1024)).toFixed(2)}MB exceeds maximum 5MB limit.`);
  }

  // Prevent path traversal
  const safeBaseName = path.basename(originalFilename).replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueId = crypto.randomBytes(8).toString('hex');
  const targetFilename = `${Date.now()}-${uniqueId}.webp`;
  const targetPath = path.join(UPLOAD_BASE_DIR, targetFilename);

  // Optimize to WebP with Sharp
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const optimizedBuffer = await image
    .webp({ quality: 85 })
    .toBuffer();

  await fs.promises.writeFile(targetPath, optimizedBuffer);

  const publicUrl = `/uploads/${targetFilename}`;

  // Record in PostgreSQL ArticleImage table
  const record = await prisma.articleImage.create({
    data: {
      url: publicUrl,
      filename: targetFilename,
      alt: altText || safeBaseName,
      fileSize: optimizedBuffer.length,
      mimeType: 'image/webp',
      width: metadata.width || null,
      height: metadata.height || null,
    },
  });

  return {
    id: record.id,
    url: publicUrl,
    filename: targetFilename,
    mimeType: 'image/webp',
    fileSize: optimizedBuffer.length,
    width: metadata.width || 0,
    height: metadata.height || 0,
    alt: record.alt || undefined,
  };
}

export async function deleteMedia(id: string): Promise<boolean> {
  const media = await prisma.articleImage.findUnique({ where: { id } });
  if (!media) return false;

  // Safe path check
  const filePath = path.join(UPLOAD_BASE_DIR, path.basename(media.filename));
  if (fs.existsSync(filePath)) {
    try {
      await fs.promises.unlink(filePath);
    } catch (e) {
      console.warn('Failed to delete media file from disk:', e);
    }
  }

  await prisma.articleImage.delete({ where: { id } });
  return true;
}
