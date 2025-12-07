'use client';
import { useState, useEffect, useRef } from 'react';
import { XIcon, SendIcon, UserIcon } from '@/components/Icons';
import './ChatWindow.css';

export default function ChatWindow({ isOpen, onClose, conversation, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && conversation) {
            loadMessages();
        }
    }, [isOpen, conversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('pawconnect_token');
            const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            const token = localStorage.getItem('pawconnect_token');
            const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newMessage })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages([...messages, data.message]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (!isOpen || !conversation) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="chat-window modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header chat-header">
                    <div className="chat-user-info">
                        <div className="chat-avatar">
                            {conversation.other_avatar ? (
                                <img src={conversation.other_avatar} alt={conversation.other_username} />
                            ) : (
                                <UserIcon size={20} />
                            )}
                        </div>
                        <span className="chat-username">{conversation.other_username}</span>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <XIcon size={20} />
                    </button>
                </div>

                <div className="chat-messages">
                    {loading ? (
                        <div className="loading-messages">
                            <p>Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="empty-messages">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">
                                        <p>{message.content}</p>
                                        <span className="message-time">{formatTime(message.created_at)}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                <form className="chat-input-form" onSubmit={sendMessage}>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        className="send-button"
                        disabled={!newMessage.trim() || sending}
                        aria-label="Send message"
                    >
                        <SendIcon size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
