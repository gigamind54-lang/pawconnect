import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getUserFromRequest } from '@/lib/auth';

/**
 * POST /api/posts/[id]/like
 * Toggle like on a post
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

        // Check if already liked
        const existingLike = await sql`
      SELECT id FROM likes 
      WHERE user_id = ${user.id} AND post_id = ${id}
    `;

        if (existingLike.rows.length > 0) {
            // Unlike
            await sql`
        DELETE FROM likes 
        WHERE user_id = ${user.id} AND post_id = ${id}
      `;

            // Get updated count
            const countResult = await sql`
        SELECT COUNT(*) as count FROM likes WHERE post_id = ${id}
      `;

            return NextResponse.json({
                success: true,
                liked: false,
                likeCount: parseInt(countResult.rows[0].count)
            });
        } else {
            // Like
            await sql`
        INSERT INTO likes (user_id, post_id)
        VALUES (${user.id}, ${id})
      `;

            // Get updated count
            const countResult = await sql`
        SELECT COUNT(*) as count FROM likes WHERE post_id = ${id}
      `;

            return NextResponse.json({
                success: true,
                liked: true,
                likeCount: parseInt(countResult.rows[0].count)
            });
        }

    } catch (error) {
        console.error('Toggle like error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/posts/[id]/like
 * Get like status and count for a post
 */
export async function GET(request, context) {
    try {
        const { id } = await context.params;
        const user = getUserFromRequest(request);

        // Get like count
        const countResult = await sql`
      SELECT COUNT(*) as count FROM likes WHERE post_id = ${id}
    `;

        // Check if current user liked (if authenticated)
        let isLiked = false;
        if (user) {
            const likeResult = await sql`
        SELECT id FROM likes 
        WHERE user_id = ${user.id} AND post_id = ${id}
      `;
            isLiked = likeResult.rows.length > 0;
        }

        return NextResponse.json({
            success: true,
            likeCount: parseInt(countResult.rows[0].count),
            isLiked
        });

    } catch (error) {
        console.error('Get like status error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
