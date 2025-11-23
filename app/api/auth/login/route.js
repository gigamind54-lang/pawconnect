import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email
        const result = await sql`
      SELECT id, username, email, password_hash, avatar, bio, location, created_at
      FROM users
      WHERE email = ${email}
    `;

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const user = result.rows[0];

        // Verify password
        const isValid = await comparePassword(password, user.password_hash);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            username: user.username,
            email: user.email
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                location: user.location,
                joinedDate: user.created_at
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
