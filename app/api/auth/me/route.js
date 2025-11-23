import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        // Get user from JWT token
        const tokenUser = getUserFromRequest(request);

        if (!tokenUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch full user data from database
        const result = await sql`
      SELECT id, username, email, avatar, bio, location, created_at
      FROM users
      WHERE id = ${tokenUser.id}
    `;

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = result.rows[0];

        // Get user's post count
        const stats = await sql`
      SELECT COUNT(*) as posts_count
      FROM posts
      WHERE user_id = ${user.id}
    `;

        // Get user's likes received count
        const likesResult = await sql`
      SELECT COUNT(*) as likes_count
      FROM likes l
      JOIN posts p ON l.post_id = p.id
      WHERE p.user_id = ${user.id}
    `;

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                location: user.location,
                joinedDate: user.created_at,
                stats: {
                    postsCount: parseInt(stats.rows[0].posts_count),
                    likesReceived: parseInt(likesResult.rows[0].likes_count)
                }
            }
        });

    } catch (error) {
        console.error('Get current user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
