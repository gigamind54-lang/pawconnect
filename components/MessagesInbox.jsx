'use client';
import { useState, useEffect } from 'react';
import { XIcon, MessageIcon, UserIcon } from '@/components/Icons';
import './MessagesInbox.css';

export default function MessagesInbox({ isOpen, onClose, currentUser, onOpenChat }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && currentUser) {
            loadConversations();
        }
    }, [isOpen, currentUser]);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('pawconnect_token');
            const response = await fetch('/api/conversations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setConversations(data.conversations || []);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="messages-inbox modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        <MessageIcon size={24} />
                        <span>Messages</span>
                    </h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <XIcon size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading-state">
                            <MessageIcon size={48} />
                            <p>Loading conversations...</p>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="empty-state">
                            <MessageIcon size={64} />
                            <h3>No messages yet</h3>
                            <p>Start a conversation by clicking the message button on any post</p>
                        </div>
                    ) : (
                        <div className="conversations-list">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className="conversation-item"
                                    onClick={() => onOpenChat(conv)}
                                >
                                    <div className="conversation-avatar">
                                        {conv.other_avatar ? (
                                            <img src={conv.other_avatar} alt={conv.other_username} />
                                        ) : (
                                            <UserIcon size={24} />
                                        )}
                                    </div>
                                    <div className="conversation-info">
                                        <div className="conversation-header">
                                            <span className="conversation-name">{conv.other_username}</span>
                                            <span className="conversation-time">
                                                {formatTime(conv.last_message_time)}
                                            </span>
                                        </div>
                                        <div className="conversation-preview">
                                            <p className={conv.unread_count > 0 ? 'unread' : ''}>
                                                {conv.last_message || 'No messages yet'}
                                            </p>
                                            {conv.unread_count > 0 && (
                                                <span className="unread-badge">{conv.unread_count}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
