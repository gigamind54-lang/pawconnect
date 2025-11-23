'use client';
import { HelpCircleIcon, MapPinIcon, UserIcon, AlertCircleIcon } from '@/components/Icons';
import './HelpRequestCard.css';

export default function HelpRequestCard({ post }) {
    const urgencyColor = post.urgencyLevel === 'high' ? 'urgent' : post.urgencyLevel === 'normal' ? 'normal' : 'low';

    return (
        <article className="instagram-card">
            {/* Header */}
            <div className="ig-card-header">
                <div className="ig-user-info">
                    <div className="ig-avatar">
                        {post.authorAvatar ? (
                            <img src={post.authorAvatar} alt={post.requester} />
                        ) : (
                            <UserIcon size={20} />
                        )}
                    </div>
                    <div className="ig-user-details">
                        <div className="ig-username">{post.requester || 'Anonymous'}</div>
                        <div className="ig-location">
                            <MapPinIcon size={12} />
                            <span>{post.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Placeholder with Help Tag */}
            <div className="ig-image-container">
                <div className={`help-tag help-tag-${urgencyColor}`}>
                    <AlertCircleIcon size={14} />
                    <span>{post.urgencyLevel === 'high' ? 'Urgent Help' : 'Help Needed'}</span>
                </div>
                <div className={`help-placeholder help-placeholder-${urgencyColor}`}>
                    <HelpCircleIcon size={48} />
                    <div className="help-title-overlay">{post.title}</div>
                </div>
            </div>

            {/* Actions */}
            <div className="ig-actions">
                <div className="ig-actions-left">
                    <div className="ig-action-text">{post.responses || 0} responses</div>
                </div>
                <div className="ig-actions-right">
                    <button className="help-offer-btn" aria-label="Offer help">
                        Offer Help
                    </button>
                </div>
            </div>

            {/* Caption */}
            <div className="ig-caption">
                <strong>{post.helpType}</strong>
                <span className="ig-caption-text"> • {post.status}</span>
            </div>

            <div className="ig-description">{post.description}</div>

            {/* Time */}
            <div className="ig-time">{post.timeAgo || '1 hour ago'}</div>
        </article>
    );
}
