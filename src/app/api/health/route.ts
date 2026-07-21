import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.COZE_PROJECT_ENV || 'unknown',
    checks: {
      supabase: {
        configured: !!(process.env.COZE_SUPABASE_URL && process.env.COZE_SUPABASE_ANON_KEY),
        url: process.env.COZE_SUPABASE_URL ? 'set' : 'missing',
        anonKey: process.env.COZE_SUPABASE_ANON_KEY ? 'set' : 'missing',
        serviceRoleKey: process.env.COZE_SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'missing',
      },
      musicProvider: process.env.MUSIC_PROVIDER || 'not set',
      nodeEnv: process.env.NODE_ENV,
    },
    versions: {
      node: process.version,
    },
  };

  console.log('[Melo Music] Health check:', JSON.stringify(health, null, 2));

  return NextResponse.json(health);
}
