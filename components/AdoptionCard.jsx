'use client';
import { useState } from 'react';
import { HeartIcon, ShareIcon, MapPinIcon, BookmarkIcon, MessageIcon, UserIcon } from '@/components/Icons';
import './AdoptionCard.css';

export default function AdoptionCard({ post, onLike, onSave, onMessage }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleLike = () => {
        if (onLike) onLike(post.id, !isLiked);
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        if (onSave) onSave(post.id, !isSaved);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Adopt ${post.petName}`,
                    text: `Check out ${post.petName} for adoption!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        if (post.onDelete) {
            post.onDelete(post.id);
        }
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
                        <div className="ig-username">{post.author || 'Anonymous'}</div>
                        <div className="ig-location">
                            <MapPinIcon size={12} />
                            <span>{post.location}</span>
                        </div>
                    </div>
                </div>
                {post.isOwner && (
                    <button
                        onClick={handleDelete}
                        className="ig-delete-btn"
                        aria-label="Delete post"
                    >
                        Delete this post
                    </button>
                )}
            </div>

            {/* Image */}
            <div className="ig-image-container">
                <div className="adoption-tag">
                    <HeartIcon size={14} filled={true} />
                    <span>Adoption</span>
                </div>
                <img
                    src={post.images && post.images[0] ? post.images[0] : 'https://images.unsplash.com/photo-1600077106724-946750eeaf8c?w=800'}
                    alt={post.petName || post.pet_name}
                    className="ig-image"
                />
                {post.urgent && (
                    <div className="badge badge-urgent ig-badge">URGENT</div>
                )}
            </div>

            {/* Actions */}
            <div className="ig-actions">
                <div className="ig-actions-left">
                    <button
                        onClick={handleLike}
                        className={`ig-action-btn ${isLiked ? 'liked' : ''}`}
                        aria-label="Like"
                    >
                        <HeartIcon size={24} filled={isLiked} />
                    </button>
                    <button className="ig-action-btn" aria-label="Comment">
                        <MessageIcon size={24} />
                    </button>
                    <button onClick={handleShare} className="ig-action-btn" aria-label="Share">
                        <ShareIcon size={24} />
                    </button>
                </div>
                <div className="ig-actions-right">
                    <button
                        className="ig-contact-btn-row"
                        aria-label="Contact about adoption"
                        onClick={() => onMessage && onMessage(post)}
                    >
                        Send Message
                    </button>
                    <button
                        onClick={handleSave}
                        className={`ig-action-btn ${isSaved ? 'saved' : ''}`}
                        aria-label="Save"
                    >
                        <BookmarkIcon size={24} filled={isSaved} />
                    </button>
                </div>
            </div>

            {/* Likes */}
            <div className="ig-likes">
                <strong>{post.likes || 0} likes</strong>
            </div>

            {/* Caption */}
            <div className="ig-caption">
                <strong>{post.petName || post.pet_name}</strong>
                <span className="ig-caption-text">
                    {' '}{post.breed} • {post.age} • {post.gender}
                </span>
            </div>

            <div className="ig-description">{post.description}</div>

            {/* Time */}
            <div className="ig-time">{post.timeAgo || '1 hour ago'}</div>
        </article>
    );
}
