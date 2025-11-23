'use client';
import { useState } from 'react';
import { HeartIcon, MessageIcon, ShareIcon, ImageIcon as ImageIconComp, UserIcon, ClockIcon } from '@/components/Icons';
import './MediaGallery.css';

export default function MediaGallery({ post, onLike }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);

    const openLightbox = (image) => {
        setCurrentImage(image);
        setLightboxOpen(true);
    };

    const handleLike = () => {
        if (!isLiked) {
            setLikeCount(likeCount + 1);
        } else {
            setLikeCount(likeCount - 1);
        }
        setIsLiked(!isLiked);
        if (onLike) onLike(post.id, !isLiked);
    };

    return (
        <>
            <div className="media-card card animate-fade-in">
                <div className="media-header card-content-header">
                    <div className="author-info">
                        <div className="author-avatar">
                            <UserIcon size={18} />
                        </div>
                        <div className="author-details">
                            <div className="author-name">{post.author}</div>
                            <div className="post-time">
                                <ClockIcon size={14} />
                                <span>{post.timeAgo}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="media-grid">
                    {post.media.slice(0, 4).map((item, index) => (
                        <div
                            key={index}
                            className="media-item"
                            onClick={() => openLightbox(item)}
                        >
                            <img src={item} alt={`Media ${index + 1}`} className="media-image" />
                            <div className="media-overlay">
                                <ImageIconComp size={32} />
                            </div>
                            {index === 3 && post.media.length > 4 && (
                                <div className="more-overlay">
                                    +{post.media.length - 4}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="card-content">
                    <p className="card-description">{post.description}</p>
                    <div className="media-footer">
                        <button
                            onClick={handleLike}
                            className={`action-btn ${isLiked ? 'liked' : ''}`}
                            aria-label="Like post"
                        >
                            <HeartIcon size={18} filled={isLiked} />
                            <span>{likeCount}</span>
                        </button>
                        <button className="action-btn" aria-label="Comment">
                            <MessageIcon size={18} />
                            <span>{post.comments}</span>
                        </button>
                        <button className="action-btn" aria-label="Share">
                            <ShareIcon size={18} />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>

            {lightboxOpen && (
                <div className="lightbox" onClick={() => setLightboxOpen(false)}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close">
                            ✕
                        </button>
                        <img src={currentImage} alt="Full size" className="lightbox-image" />
                    </div>
                </div>
            )}
        </>
    );
}
