import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create a Supabase server client that can read cookies
 * This is the proper way to handle auth in Next.js App Router
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  // Use COZE_SUPABASE_* env vars (server-side) or NEXT_PUBLIC_SUPABASE_* (client-side)
  const supabaseUrl = process.env.COZE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.COZE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}

/**
 * Get authenticated user from Supabase session
 * Uses the SSR client to properly read cookies
 */
export async function getAuthenticatedUser() {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[Server Auth] getUser error:', error.message);
      return { user: null, error: '登录已过期，请重新登录' };
    }
    
    if (!user) {
      return { user: null, error: '未登录' };
    }

    return { user, error: null };
  } catch (error) {
    console.error('[Server Auth] Error:', error);
    return { user: null, error: '认证失败' };
  }
}

/**
 * Get authenticated user from Authorization header
 * Alternative method when cookie is not available
 */
export async function getAuthenticatedUserFromHeader(authHeader: string | null) {
  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: '未提供认证令牌' };
    }

    const token = authHeader.substring(7);
    
    // Use COZE_SUPABASE_* env vars (server-side) or NEXT_PUBLIC_SUPABASE_* (client-side)
    const supabaseUrl = process.env.COZE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.COZE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[Server Auth Header] Missing Supabase env vars');
      return { user: null, error: '服务器配置错误' };
    }
    
    // Create client with auth token in headers
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[Server Auth Header] getUser error:', error.message);
      return { user: null, error: '登录已过期，请重新登录' };
    }
    
    if (!user) {
      return { user: null, error: '未登录' };
    }

    return { user, error: null };
  } catch (error) {
    console.error('[Server Auth Header] Error:', error);
    return { user: null, error: '认证失败' };
  }
}

/**
 * Debug function to log all cookies (for troubleshooting)
 */
export async function debugCookies() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  console.log('[Debug] All cookies:', allCookies.map(c => c.name));
  return allCookies;
}
