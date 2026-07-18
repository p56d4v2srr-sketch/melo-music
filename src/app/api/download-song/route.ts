import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { extname, basename } from 'path';
import { existsSync } from 'fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = [
  'cdn1.suno.ai',
  'cdn2.suno.ai',
  'cdn.suno.ai',
  'audiopipe.suno.ai',
  'cdn1.suno.com',
  'cdn2.suno.com',
  'audiopipe.suno.com',
  'storage.googleapis.com',
  'commondatastorage.googleapis.com',
  'api.acedata.cloud',
  'data-sz.tianpuyue.cn',   // PuLe audio CDN
  'media-pipe.api.tianpuyue.cn', // PuLe streaming
  'tianpuyuecdn.com',       // PuLe CDN
  'oss.yourmusic.fun',      // Suno proxy CDN
];

// Wildcard patterns for subdomain matching (e.g., *.aliyuncs.com)
const ALLOWED_HOST_PATTERNS = [
  /\.aliyuncs\.com$/,   // Aliyun OSS: xxx.oss-cn-hangzhou.aliyuncs.com
  /\.tianpuyue\.cn$/,   // PuLe CDN: data-sz.tianpuyue.cn, media-pipe.api.tianpuyue.cn
  /\.tianpuyuecdn\.com$/, // PuLe CDN
  /\.yourmusic\.fun$/,  // Suno proxy (谱乐 AI)
];

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '_').replace(/\s+/g, '_');
}

function getAsciiFallback(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7E]/g, '_').replace(/_+/g, '_');
  return ascii || 'melo-download';
}

function getContentType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  switch (ext) {
    case '.wav': return 'audio/wav';
    case '.mp3': return 'audio/mpeg';
    case '.ogg': return 'audio/ogg';
    case '.flac': return 'audio/flac';
    case '.m4a': return 'audio/mp4';
    case '.mp4': return 'video/mp4';
    default: return 'application/octet-stream';
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const filename = searchParams.get('filename');
  const type = searchParams.get('type') || 'audio';

  // Validate url parameter
  if (!url) {
    console.log('[download-song] Missing url parameter');
    return NextResponse.json(
      { error: 'INVALID_URL' },
      { status: 400 }
    );
  }

  // Check if it's a local file path (for WAV conversion)
  if (url.startsWith('/tmp/')) {
    if (!existsSync(url)) {
      return NextResponse.json({ error: 'FILE_NOT_FOUND' }, { status: 404 });
    }
    const fileStats = await stat(url);
    const fileBuffer = await readFile(url);
    const safeFilename = filename || basename(url);
    const contentType = getContentType(url);
    const asciiFilename = getAsciiFallback(safeFilename);
    const encodedFilename = encodeURIComponent(safeFilename);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        'Content-Disposition': `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // Parse and validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    console.log('[download-song] Invalid URL:', url);
    return NextResponse.json(
      { error: 'INVALID_URL' },
      { status: 400 }
    );
  }

  // SSRF whitelist check
  const hostname = parsedUrl.hostname;
  const isAllowed = ALLOWED_HOSTS.includes(hostname) || ALLOWED_HOST_PATTERNS.some(pattern => pattern.test(hostname));
  if (!isAllowed) {
    console.log('[download-song] Domain not allowed:', hostname);
    return NextResponse.json(
      { error: 'DOMAIN_NOT_ALLOWED' },
      { status: 400 }
    );
  }

  // Determine filename
  let safeFilename = filename || '';
  if (!safeFilename) {
    const urlPath = parsedUrl.pathname;
    const baseName = urlPath.split('/').pop() || '';
    safeFilename = baseName || `melo-${Date.now()}.mp3`;
  }
  safeFilename = sanitizeFilename(safeFilename);

  // Determine content type based on URL extension and type parameter
  const urlPath = parsedUrl.pathname.toLowerCase();
  let contentType: string;
  if (type === 'video') {
    contentType = 'video/mp4';
  } else if (urlPath.endsWith('.wav')) {
    contentType = 'audio/wav';
  } else if (urlPath.endsWith('.mp3')) {
    contentType = 'audio/mpeg';
  } else if (urlPath.endsWith('.ogg')) {
    contentType = 'audio/ogg';
  } else if (urlPath.endsWith('.flac')) {
    contentType = 'audio/flac';
  } else if (urlPath.endsWith('.m4a')) {
    contentType = 'audio/mp4';
  } else {
    contentType = 'application/octet-stream';
  }

  // ASCII fallback for Content-Disposition
  const asciiFilename = getAsciiFallback(safeFilename);
  const encodedFilename = encodeURIComponent(safeFilename);

  // Fetch upstream
  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(url, {
      headers: {
        'User-Agent': 'MeloMusic/1.0',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown fetch error';
    console.log('[download-song] Fetch failed:', message);
    return NextResponse.json(
      { error: 'FETCH_FAILED', message },
      { status: 500 }
    );
  }

  // Check upstream status
  if (!upstreamResponse.ok) {
    console.log('[download-song] Upstream error:', upstreamResponse.status, upstreamResponse.statusText);
    return NextResponse.json(
      { error: 'UPSTREAM_ERROR', status: upstreamResponse.status, statusText: upstreamResponse.statusText },
      { status: 502 }
    );
  }

  // Build response headers
  const headers = new Headers();
  headers.set('Content-Type', contentType);
  headers.set('Content-Disposition', `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`);
  headers.set('Cache-Control', 'private, max-age=3600');

  // Pass through Content-Length if available
  const contentLength = upstreamResponse.headers.get('content-length');
  if (contentLength) {
    headers.set('Content-Length', contentLength);
  }

  // Pass through Accept-Ranges if available
  const acceptRanges = upstreamResponse.headers.get('accept-ranges');
  if (acceptRanges) {
    headers.set('Accept-Ranges', acceptRanges);
  }

  console.log('[download-song] Proxying:', url, '->', safeFilename);

  // Stream the response body
  return new NextResponse(upstreamResponse.body, {
    status: 200,
    headers,
  });
}
