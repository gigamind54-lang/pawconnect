// API helper functions for posts

/**
 * Fetch all posts from the API
 * @param {string} type - Filter by post type (optional)
 * @returns {Promise<Array>} Array of posts
 */
export async function fetchPosts(type = null) {
    try {
        const url = type ? `/api/posts?type=${type}` : '/api/posts';
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            return data.posts || [];
        }
        return [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

/**
 * Create a new post
 * @param {object} postData - Post data
 * @param {string} token - Auth token
 * @returns {Promise<object>} Created post or error
 */
export async function createPost(postData, token) {
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });

        const data = await response.json();
        return { success: response.ok, ...data };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, error: 'Failed to create post' };
    }
}

/**
 * Toggle like on a post
 * @param {string} postId - Post ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} Like status and count
 */
export async function toggleLike(postId, token) {
    try {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return { success: false };
    } catch (error) {
        console.error('Error toggling like:', error);
        return { success: false };
    }
}
