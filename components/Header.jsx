'use client';
import { useState, useRef, useEffect } from 'react';
import { HeartIcon, UserIcon, PlusIcon, MessageIcon } from '@/components/Icons';
import './Header.css';

export default function Header({ currentUser, onLogout, onOpenAuth, onOpenProfile, onCreatePost, onOpenMessages }) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreatePost = () => {
        if (currentUser) {
            onCreatePost();
        } else {
            onOpenAuth();
        }
    };

    return (
        <header className="ig-header">
            <div className="ig-header-container">
                <div className="ig-logo">
                    <HeartIcon size={24} filled={true} />
                    <span>PawConnect</span>
                </div>

                <div className="ig-header-actions">
                    <button
                        onClick={handleCreatePost}
                        className="ig-create-btn"
                        aria-label="Create post"
                    >
                        <PlusIcon size={20} />
                        <span>Create</span>
                    </button>

                    {currentUser && (
                        <button
                            onClick={onOpenMessages}
                            className="ig-messages-btn"
                            aria-label="Messages"
                        >
                            <MessageIcon size={20} />
                            <span>Messages</span>
                        </button>
                    )}

                    {currentUser ? (
                        <div className="user-menu" ref={userMenuRef}>
                            <button
                                className="ig-user-btn"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                aria-label="User menu"
                            >
                                {currentUser.avatar ? (
                                    <img src={currentUser.avatar} alt={currentUser.username} className="user-avatar-img" />
                                ) : (
                                    <div className="user-avatar-placeholder">
                                        <UserIcon size={18} />
                                    </div>
                                )}
                            </button>

                            {userMenuOpen && (
                                <div className="ig-user-dropdown">
                                    <div className="ig-dropdown-header">
                                        <div className="ig-dropdown-name">{currentUser.username}</div>
                                        <div className="ig-dropdown-email">{currentUser.email}</div>
                                    </div>
                                    <div className="ig-dropdown-divider"></div>
                                    <button className="ig-dropdown-item" onClick={() => { onOpenProfile(); setUserMenuOpen(false); }}>
                                        <UserIcon size={16} />
                                        <span>Profile</span>
                                    </button>
                                    <div className="ig-dropdown-divider"></div>
                                    <button className="ig-dropdown-item logout" onClick={onLogout}>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={onOpenAuth} className="btn btn-primary ig-login-btn">
                            Log In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
