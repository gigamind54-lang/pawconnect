import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getUserFromRequest } from '@/lib/auth';

/**
 * GET /api/posts/[id]
 * Get a single post by ID
 */
export async function GET(request, { params }) {
    try {
        const { id } = params;

        const result = await sql`
      SELECT 
        p.*,
        u.username,
        u.avatar as user_avatar,
        u.location as user_location,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ${id}
    `;

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        const post = result.rows[0];

        // Fetch type-specific details
        let details = {};
        if (post.type === 'adoption') {
            const detailsResult = await sql`
        SELECT * FROM adoption_posts WHERE post_id = ${id}
      `;
            details = detailsResult.rows[0] || {};
        } else if (post.type === 'discussion') {
            const detailsResult = await sql`
        SELECT * FROM discussion_posts WHERE post_id = ${id}
      `;
            details = detailsResult.rows[0] || {};
        } else if (post.type === 'help') {
            const detailsResult = await sql`
        SELECT * FROM help_posts WHERE post_id = ${id}
      `;
            details = detailsResult.rows[0] || {};
        }

        return NextResponse.json({
            success: true,
            post: {
                ...post,
                ...details,
                likes: parseInt(post.like_count),
                comments: parseInt(post.comment_count)
            }
        });

    } catch (error) {
        console.error('Get post error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/posts/[id]
 * Delete a post (must be owner)
 */
export async function DELETE(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = params;

        // Check if user owns the post
        const checkResult = await sql`
      SELECT user_id FROM posts WHERE id = ${id}
    `;

        if (checkResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        if (checkResult.rows[0].user_id !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Delete post (cascade will delete related records)
        await sql`DELETE FROM posts WHERE id = ${id}`;

        return NextResponse.json({
            success: true,
            message: 'Post deleted successfully'
        });

    } catch (error) {
        console.error('Delete post error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
