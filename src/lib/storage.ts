/**
 * S3 Storage utility for file uploads
 * Uses coze-coding-dev-sdk S3Storage
 */

import { S3Storage } from 'coze-coding-dev-sdk';

let storageInstance: S3Storage | null = null;

function getStorage(): S3Storage {
  if (!storageInstance) {
    storageInstance = new S3Storage();
  }
  return storageInstance;
}

export interface UploadResult {
  key: string;
  url: string;
  publicUrl: string;
}

/**
 * Upload a file to S3 storage
 */
export async function uploadFile(
  file: Buffer | Uint8Array,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  const storage = getStorage();
  const key = await storage.uploadFile({
    fileContent: Buffer.from(file),
    fileName: filename,
    contentType: contentType,
  });
  const url = await storage.generatePresignedUrl({ key });
  return { key, url, publicUrl: url };
}

/**
 * Upload a file from a Blob
 */
export async function uploadBlob(
  blob: Blob,
  filename: string
): Promise<UploadResult> {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  return uploadFile(buffer, filename, blob.type);
}

/**
 * Get a presigned download URL
 */
export async function getDownloadUrl(key: string): Promise<string> {
  const storage = getStorage();
  return storage.generatePresignedUrl({ key });
}

/**
 * Delete a file from storage
 */
export async function deleteFile(key: string): Promise<void> {
  const storage = getStorage();
  await storage.deleteFile({ fileKey: key });
}
