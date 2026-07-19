import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// POST /api/messages - 发送私信
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, content } = body;

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      })
      .select()
      .single();
    if (error) throw new Error(`发送私信失败: ${error.message}`);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('发送私信失败:', error);
    return NextResponse.json(
      { success: false, error: '发送私信失败' },
      { status: 500 }
    );
  }
}

// GET /api/messages - 获取私信列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const otherId = searchParams.get('otherId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    if (otherId) {
      // Get conversation with specific user
      const { data, error } = await client
        .from('messages')
        .select('id, content, is_read, created_at, sender_id, users!messages_sender_id_users_id_fk(nickname, avatar)')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      if (error) throw new Error(`获取对话失败: ${error.message}`);

      // Mark as read
      await client
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', otherId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      return NextResponse.json({
        success: true,
        data: {
          messages: (data || []).map((m: any) => ({
            id: m.id,
            content: m.content,
            isRead: m.is_read,
            createdAt: m.created_at,
            senderId: m.sender_id,
            senderNickname: m.users?.nickname || '匿名',
            senderAvatar: m.users?.avatar || null,
          })),
        },
      });
    } else {
      // Get conversation list (recent contacts)
      const { data, error } = await client
        .from('messages')
        .select('id, content, created_at, sender_id, receiver_id')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw new Error(`获取会话列表失败: ${error.message}`);

      // Get unique contact IDs
      const contactIds = [...new Set(
        (data || []).map((m: any) => m.sender_id === userId ? m.receiver_id : m.sender_id)
      )];

      if (contactIds.length === 0) {
        return NextResponse.json({ success: true, data: { conversations: [] } });
      }

      // Fetch contact info
      const { data: contacts, error: contactsError } = await client
        .from('users')
        .select('id, nickname, avatar')
        .in('id', contactIds);
      if (contactsError) throw new Error(`获取用户信息失败: ${contactsError.message}`);

      const contactMap = new Map((contacts || []).map((c: any) => [c.id, c]));

      const conversations = contactIds.map(contactId => {
        const lastMsg = (data || []).find((m: any) => 
          m.sender_id === contactId || m.receiver_id === contactId
        );
        const contact = contactMap.get(contactId);
        return {
          userId: contactId,
          nickname: contact?.nickname || '匿名',
          avatar: contact?.avatar || null,
          lastMessage: lastMsg?.content || '',
          lastTime: lastMsg?.created_at || null,
          unreadCount: 0,
        };
      });

      return NextResponse.json({ success: true, data: { conversations } });
    }
  } catch (error) {
    console.error('获取私信失败:', error);
    return NextResponse.json(
      { success: false, error: '获取私信失败' },
      { status: 500 }
    );
  }
}
