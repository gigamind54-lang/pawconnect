import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, email, password, avatar, bio, location } = body;

        // Validation
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'Username, email, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existing = await sql`
      SELECT id FROM users 
      WHERE email = ${email} OR username = ${username}
    `;

        if (existing.rows.length > 0) {
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const result = await sql`
      INSERT INTO users (username, email, password_hash, avatar, bio, location)
      VALUES (${username}, ${email}, ${passwordHash}, ${avatar || null}, ${bio || null}, ${location || null})
      RETURNING id, username, email, avatar, bio, location, created_at
    `;

        const user = result.rows[0];

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
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
