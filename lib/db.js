import { sql } from '@vercel/postgres';

/**
 * Database connection using Vercel Postgres
 * Automatically uses environment variables:
 * - POSTGRES_URL
 * - POSTGRES_PRISMA_URL
 * - POSTGRES_URL_NON_POOLING
 */

export const db = sql;

/**
 * Test database connection
 */
export async function testConnection() {
    try {
        const result = await sql`SELECT NOW()`;
        console.log('Database connected:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
}

/**
 * Execute the database schema
 * Run this once to set up all tables
 */
export async function runMigrations() {
    try {
        // Read and execute schema.sql
        const fs = require('fs');
        const path = require('path');
        const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        await sql.query(schema);
        console.log('Database schema created successfully');
        return true;
    } catch (error) {
        console.error('Migration error:', error);
        return false;
    }
}
