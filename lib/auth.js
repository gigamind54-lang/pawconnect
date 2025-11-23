import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} Match result
 */
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 * @param {object} payload - User data to encode
 * @returns {string} JWT token
 */
export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Extract token from Authorization header
 * @param {Request} request - Next.js request object
 * @returns {string|null} Token or null
 */
export function getTokenFromRequest(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

/**
 * Get user from request token
 * @param {Request} request - Next.js request object
 * @returns {object|null} User payload or null
 */
export function getUserFromRequest(request) {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return verifyToken(token);
}

/**
 * Middleware to require authentication
 * Returns user if authenticated, throws error if not
 */
export function requireAuth(request) {
    const user = getUserFromRequest(request);
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}
