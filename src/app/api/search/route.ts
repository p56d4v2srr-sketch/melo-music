import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, songs, artists, genres
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        data: { songs: [], artists: [], genres: [], total: 0 }
      });
    }

    const client = getSupabaseClient();
    const results: {
      songs: any[];
      artists: any[];
      genres: string[];
      total: number;
    } = {
      songs: [],
      artists: [],
      genres: [],
      total: 0
    };

    // Search songs
    if (type === 'all' || type === 'songs') {
      const { data: songs, error: songsError } = await client
        .from('songs')
        .select(`
          *,
          users!artist_id (id, nickname, avatar)
        `)
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        .eq('is_published', true)
        .order('play_count', { ascending: false })
        .range(offset, offset + limit - 1);

      if (!songsError && songs) {
        results.songs = songs.map(s => ({
          ...s,
          artist: s.users
        }));
      }
    }

    // Search artists
    if (type === 'all' || type === 'artists') {
      const { data: artists, error: artistsError } = await client
        .from('users')
        .select('*')
        .or(`nickname.ilike.%${q}%,bio.ilike.%${q}%`)
        .limit(limit);

      if (!artistsError && artists) {
        results.artists = artists;
      }
    }

    // Search genres (from style_tags)
    if (type === 'all' || type === 'genres') {
      const { data: songs } = await client
        .from('songs')
        .select('style_tags')
        .eq('is_published', true)
        .limit(100);

      if (songs) {
        const allTags = songs.flatMap(s => s.style_tags || []);
        const uniqueTags = [...new Set(allTags)];
        results.genres = uniqueTags
          .filter(tag => tag.toLowerCase().includes(q.toLowerCase()))
          .slice(0, limit);
      }
    }

    results.total = results.songs.length + results.artists.length + results.genres.length;

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: '搜索失败' },
      { status: 500 }
    );
  }
}
