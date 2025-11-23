import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getUserFromRequest } from '@/lib/auth';

/**
 * GET /api/posts
 * Fetch all posts with optional filters
 * Query params: type, userId
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const userId = searchParams.get('userId');

        let query = `
      SELECT 
        p.*,
        u.username,
        u.avatar as user_avatar,
        u.location as user_location,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
    `;

        const conditions = [];
        const params = [];
        let paramIndex = 1;

        if (type) {
            conditions.push(`p.type = $${paramIndex}`);
            params.push(type);
            paramIndex++;
        }

        if (userId) {
            conditions.push(`p.user_id = $${paramIndex}`);
            params.push(userId);
            paramIndex++;
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY p.created_at DESC LIMIT 100';

        const result = await sql.query(query, params);

        // Fetch additional details based on post type
        const posts = await Promise.all(result.rows.map(async (post) => {
            let details = {};

            if (post.type === 'adoption') {
                const adoptionResult = await sql`
          SELECT * FROM adoption_posts WHERE post_id = ${post.id}
        `;
                details = adoptionResult.rows[0] || {};
            } else if (post.type === 'discussion') {
                const discussionResult = await sql`
          SELECT * FROM discussion_posts WHERE post_id = ${post.id}
        `;
                details = discussionResult.rows[0] || {};
            } else if (post.type === 'help') {
                const helpResult = await sql`
          SELECT * FROM help_posts WHERE post_id = ${post.id}
        `;
                details = helpResult.rows[0] || {};
            }

            return {
                id: post.id,
                type: post.type,
                title: post.title,
                description: post.description,
                images: post.images,
                location: post.location,
                author: post.username,
                authorAvatar: post.user_avatar,
                userId: post.user_id,
                likes: parseInt(post.like_count),
                comments: parseInt(post.comment_count),
                timeAgo: getTimeAgo(post.created_at),
                createdAt: post.created_at,
                ...details
            };
        }));

        return NextResponse.json({
            success: true,
            posts
        });

    } catch (error) {
        console.error('Get posts error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/posts
 * Create a new post
 */
export async function POST(request) {
    try {
        // Require authentication
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { type, title, description, images, location, details } = body;

        // Validation
        if (!type || !['adoption', 'discussion', 'help', 'media'].includes(type)) {
            return NextResponse.json(
                { error: 'Invalid post type' },
                { status: 400 }
            );
        }

        // Create base post
        const postResult = await sql`
      INSERT INTO posts (user_id, type, title, description, images, location)
      VALUES (${user.id}, ${type}, ${title || null}, ${description || null}, 
              ${JSON.stringify(images || [])}, ${location || null})
      RETURNING *
    `;

        const post = postResult.rows[0];

        // Create type-specific details
        if (type === 'adoption' && details) {
            await sql`
        INSERT INTO adoption_posts (post_id, pet_name, species, breed, age, gender, size, urgent)
        VALUES (${post.id}, ${details.petName}, ${details.species || null}, 
                ${details.breed || null}, ${details.age || null}, ${details.gender || null},
                ${details.size || null}, ${details.urgent || false})
      `;
        } else if (type === 'discussion' && details) {
            await sql`
        INSERT INTO discussion_posts (post_id, tags, is_popular)
        VALUES (${post.id}, ${JSON.stringify(details.tags || [])}, ${details.isPopular || false})
      `;
        } else if (type === 'help' && details) {
            await sql`
        INSERT INTO help_posts (post_id, help_type, urgency_level, status)
        VALUES (${post.id}, ${details.helpType || null}, ${details.urgencyLevel || 'normal'}, 
                ${details.status || 'open'})
      `;
        }

        return NextResponse.json({
            success: true,
            post: {
                id: post.id,
                ...post
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Create post error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Helper function to calculate time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    return Math.floor(seconds) + ' seconds ago';
}
