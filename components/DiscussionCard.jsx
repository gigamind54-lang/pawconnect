'use client';
import { useState } from 'react';
import { MessageIcon, ThumbsUpIcon, EyeIcon, UserIcon } from '@/components/Icons';
import './DiscussionCard.css';

export default function DiscussionCard({ post, onLike }) {
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        if (onLike) onLike(post.id, !isLiked);
    };

    return (
        <article className="instagram-card">
            {/* Header */}
            <div className="ig-card-header">
                <div className="ig-user-info">
                    <div className="ig-avatar">
                        {post.authorAvatar ? (
                            <img src={post.authorAvatar} alt={post.author} />
                        ) : (
                            <UserIcon size={20} />
                        )}
                    </div>
                    <div className="ig-user-details">
                        <div className="ig-username">{post.author}</div>
                        <div className="ig-location">Discussion</div>
                    </div>
                </div>
            </div>

            {/* Image Placeholder */}
            <div className="ig-image-container">
                <div className="discussion-placeholder">
                    <MessageIcon size={48} />
                    <div className="discussion-title-overlay">{post.title}</div>
                </div>
            </div>

            {/* Actions */}
            <div className="ig-actions">
                <div className="ig-actions-left">
                    <button
                        onClick={handleLike}
                        className={`ig-action-btn ${isLiked ? 'liked' : ''}`}
                        aria-label="Like"
                    >
                        <ThumbsUpIcon size={24} filled={isLiked} />
                    </button>
                    <button className="ig-action-btn" aria-label="Comments">
                        <MessageIcon size={24} />
                    </button>
                </div>
                <div className="ig-actions-right">
                    <button className="discussion-join-btn" aria-label="Join discussion">
                        Join Discussion
                    </button>
                </div>
            </div>

            {/* Likes */}
            <div className="ig-likes">
                <strong>{post.likes || 0} likes</strong>
            </div>

            {/* Caption */}
            <div className="ig-caption">
                <strong>{post.title}</strong>
            </div>

            <div className="ig-description">{post.description}</div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="discussion-tags">
                    {post.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                    ))}
                </div>
            )}

            {/* Time & Stats */}
            <div className="ig-time">
                {post.timeAgo} • {post.comments} comments • {post.views} views
            </div>
        </article>
    );
}
