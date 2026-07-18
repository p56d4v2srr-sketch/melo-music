/**
 * POST /api/convert-to-wav
 * 将 mp3 音频 URL 转码为 WAV 格式
 * 使用 ffmpeg 进行转码，输出到 /tmp 目录
 */

import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const TMP_DIR = '/tmp/melo-wav';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, songId } = body as { url?: string; songId?: string };

    if (!url) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Validate URL is from trusted domains
    const allowedDomains = [
      'oss.yourmusic.fun',
      'tianpuyuecdn',
      'tianpuyue.cn',
      'cdn.minimaxi.com',
    ];
    const isAllowed = allowedDomains.some(d => url.includes(d));
    if (!isAllowed) {
      return NextResponse.json({ error: 'URL domain not allowed' }, { status: 400 });
    }

    // Ensure tmp directory exists
    if (!existsSync(TMP_DIR)) {
      mkdirSync(TMP_DIR, { recursive: true });
    }

    // Generate output filename
    const id = songId || `song-${Date.now()}`;
    const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '');
    const outputPath = join(TMP_DIR, `${safeId}.wav`);

    // Check if already converted
    if (existsSync(outputPath)) {
      const wavUrl = `/api/download-song?url=${encodeURIComponent(outputPath)}&filename=${safeId}.wav`;
      return NextResponse.json({
        success: true,
        wavUrl: outputPath,
        downloadUrl: wavUrl,
        cached: true,
      });
    }

    // First verify the source URL is accessible
    try {
      const headResp = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
      if (!headResp.ok) {
        return NextResponse.json({ error: 'Source URL not accessible', status: headResp.status }, { status: 400 });
      }
    } catch (fetchErr) {
      return NextResponse.json({ error: 'Source URL unreachable', detail: fetchErr instanceof Error ? fetchErr.message : String(fetchErr) }, { status: 400 });
    }

    // Download and convert using ffmpeg
    const cmd = `ffmpeg -y -i "${url}" -ar 44100 -ac 2 -f wav "${outputPath}" 2>/dev/null`;
    
    try {
      execSync(cmd, { timeout: 120000, maxBuffer: 1024 * 1024 * 5 });
    } catch (ffmpegErr) {
      console.error('[convert-to-wav] ffmpeg error:', ffmpegErr);
      return NextResponse.json({ error: 'FFmpeg conversion failed' }, { status: 500 });
    }

    const wavUrl = `/api/download-song?url=${encodeURIComponent(outputPath)}&filename=${safeId}.wav`;
    
    return NextResponse.json({
      success: true,
      wavUrl: outputPath,
      downloadUrl: wavUrl,
      cached: false,
    });
  } catch (err) {
    console.error('[convert-to-wav] error:', err);
    return NextResponse.json(
      { error: 'Conversion failed', detail: String(err) },
      { status: 500 }
    );
  }
}
