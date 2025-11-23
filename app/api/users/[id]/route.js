import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getUserFromRequest } from '@/lib/auth';

/**
 * PUT /api/users/[id]
 * Update user profile
 */
export async function PUT(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = params;

        // Verify user can only update their own profile
        if (user.id !== id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { username, bio, location, avatar } = body;

        // Update user in database
        const result = await sql`
            UPDATE users 
            SET username = ${username || user.username},
                bio = ${bio || null},
                location = ${location || null},
                avatar = ${avatar || null},
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING id, username, email, avatar, bio, location, created_at
        `;

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
