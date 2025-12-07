import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getUserFromRequest } from '@/lib/auth';

/**
 * GET /api/conversations/[id]/messages
 * Get all messages in a conversation
 */
export async function GET(request, context) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await context.params;

        // Verify user is part of this conversation
        const conversation = await sql`
            SELECT * FROM conversations
            WHERE id = ${id}
            AND (user1_id = ${user.id} OR user2_id = ${user.id})
        `;

        if (conversation.rows.length === 0) {
            return NextResponse.json(
                { error: 'Conversation not found or access denied' },
                { status: 404 }
            );
        }

        // Get all messages in the conversation
        const messages = await sql`
            SELECT 
                m.*,
                u.username as sender_username,
                u.avatar as sender_avatar
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = ${id}
            ORDER BY m.created_at ASC
        `;

        // Mark messages as read
        await sql`
            UPDATE messages
            SET is_read = true
            WHERE conversation_id = ${id}
            AND sender_id != ${user.id}
            AND is_read = false
        `;

        return NextResponse.json({
            success: true,
            messages: messages.rows
        });

    } catch (error) {
        console.error('Get messages error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/conversations/[id]/messages
 * Send a message in a conversation
 */
export async function POST(request, context) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const { content } = await request.json();

        if (!content || content.trim() === '') {
            return NextResponse.json(
                { error: 'Message content is required' },
                { status: 400 }
            );
        }

        // Verify user is part of this conversation
        const conversation = await sql`
            SELECT * FROM conversations
            WHERE id = ${id}
            AND (user1_id = ${user.id} OR user2_id = ${user.id})
        `;

        if (conversation.rows.length === 0) {
            return NextResponse.json(
                { error: 'Conversation not found or access denied' },
                { status: 404 }
            );
        }

        // Create the message
        const message = await sql`
            INSERT INTO messages (conversation_id, sender_id, content)
            VALUES (${id}, ${user.id}, ${content})
            RETURNING *
        `;

        // Update conversation's updated_at timestamp
        await sql`
            UPDATE conversations
            SET updated_at = NOW()
            WHERE id = ${id}
        `;

        return NextResponse.json({
            success: true,
            message: message.rows[0]
        }, { status: 201 });

    } catch (error) {
        console.error('Send message error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
