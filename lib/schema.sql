-- PawConnect Database Schema
-- PostgreSQL Database for PawConnect Application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar TEXT,
    bio TEXT,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table (Base table for all post types)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('adoption', 'discussion', 'help', 'media')),
    title VARCHAR(255),
    description TEXT,
    images JSONB DEFAULT '[]',
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adoption Posts Details
CREATE TABLE adoption_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID UNIQUE NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    pet_name VARCHAR(100) NOT NULL,
    species VARCHAR(50),
    breed VARCHAR(100),
    age VARCHAR(50),
    gender VARCHAR(20),
    size VARCHAR(20),
    urgent BOOLEAN DEFAULT FALSE
);

-- Discussion Posts Details
CREATE TABLE discussion_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID UNIQUE NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tags JSONB DEFAULT '[]',
    is_popular BOOLEAN DEFAULT FALSE
);

-- Help Posts Details
CREATE TABLE help_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID UNIQUE NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    help_type VARCHAR(100),
    urgency_level VARCHAR(20) CHECK (urgency_level IN ('low', 'normal', 'high')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved'))
);

-- Likes Table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- Comments Table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
