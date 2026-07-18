import { NextRequest, NextResponse } from 'next/server';
import { uploadBlob } from '@/lib/storage';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/voice-clone/upload
 * Upload an audio file for voice cloning
 * Returns the public URL that can be used for voice model training
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav', 'audio/ogg', 'audio/flac', 'audio/m4a', 'audio/mp4', 'video/mp4', 'video/quicktime', 'video/webm'];
    if (!allowedTypes.includes(file.type) && !file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only audio and video files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'mp3';
    const filename = `voice-clone/${timestamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Upload to S3 storage
    const result = await uploadBlob(file, filename);

    console.log('[VoiceClone] Upload success:', { key: result.key, publicUrl: result.publicUrl });

    return NextResponse.json({
      success: true,
      key: result.key,
      url: result.url,
      publicUrl: result.publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('[VoiceClone] Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
