import { NextRequest, NextResponse } from 'next/server';

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
];

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '_').replace(/\s+/g, '_');
}

function getAsciiFallback(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7E]/g, '_').replace(/_+/g, '_');
  return ascii || 'melo-download';
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
  if (!ALLOWED_HOSTS.includes(hostname)) {
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
    const basename = urlPath.split('/').pop() || '';
    safeFilename = basename || `melo-${Date.now()}.mp3`;
  }
  safeFilename = sanitizeFilename(safeFilename);

  // Determine content type
  const contentType = type === 'video' ? 'video/mp4' : 'audio/mpeg';

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
