import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getUserFromRequest } from '@/lib/auth';

/**
 * GET /api/conversations
 * Get all conversations for the current user
 */
export async function GET(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get all conversations where user is participant
        const result = await sql`
            SELECT 
                c.*,
                CASE 
                    WHEN c.user1_id = ${user.id} THEN u2.username
                    ELSE u1.username
                END as other_username,
                CASE 
                    WHEN c.user1_id = ${user.id} THEN u2.avatar
                    ELSE u1.avatar
                END as other_avatar,
                CASE 
                    WHEN c.user1_id = ${user.id} THEN c.user2_id
                    ELSE c.user1_id
                END as other_user_id,
                m.content as last_message,
                m.created_at as last_message_time,
                (SELECT COUNT(*) FROM messages 
                 WHERE conversation_id = c.id 
                 AND sender_id != ${user.id} 
                 AND is_read = false) as unread_count
            FROM conversations c
            JOIN users u1 ON c.user1_id = u1.id
            JOIN users u2 ON c.user2_id = u2.id
            LEFT JOIN LATERAL (
                SELECT content, created_at
                FROM messages
                WHERE conversation_id = c.id
                ORDER BY created_at DESC
                LIMIT 1
            ) m ON true
            WHERE c.user1_id = ${user.id} OR c.user2_id = ${user.id}
            ORDER BY c.updated_at DESC
        `;

        return NextResponse.json({
            success: true,
            conversations: result.rows
        });

    } catch (error) {
        console.error('Get conversations error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/conversations
 * Create or get a conversation with another user
 */
export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { otherUserId } = await request.json();

        if (!otherUserId) {
            return NextResponse.json(
                { error: 'Other user ID is required' },
                { status: 400 }
            );
        }

        // Check if conversation already exists (in either direction)
        const existing = await sql`
            SELECT * FROM conversations
            WHERE (user1_id = ${user.id} AND user2_id = ${otherUserId})
               OR (user1_id = ${otherUserId} AND user2_id = ${user.id})
        `;

        if (existing.rows.length > 0) {
            return NextResponse.json({
                success: true,
                conversation: existing.rows[0]
            });
        }

        // Create new conversation
        const result = await sql`
            INSERT INTO conversations (user1_id, user2_id)
            VALUES (${user.id}, ${otherUserId})
            RETURNING *
        `;

        return NextResponse.json({
            success: true,
            conversation: result.rows[0]
        }, { status: 201 });

    } catch (error) {
        console.error('Create conversation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
