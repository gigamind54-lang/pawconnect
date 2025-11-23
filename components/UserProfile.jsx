'use client';
import { useState } from 'react';
import { UserIcon, MapPinIcon, HeartIcon, MessageIcon, XIcon, UploadIcon, CheckIcon } from '@/components/Icons';
import './UserProfile.css';

export default function UserProfile({ user, isOpen, onClose, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [formData, setFormData] = useState({
        username: user?.username || '',
        bio: user?.bio || '',
        location: user?.location || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onUpdate({
            ...formData,
            avatar: avatar
        });
        setIsEditing(false);
    };

    if (!isOpen || !user) return null;

    const joinDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="profile-modal modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {isEditing ? 'Edit Profile' : 'User Profile'}
                    </h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <XIcon size={20} />
                    </button>
                </div>

                <div className="modal-body profile-content">
                    {!isEditing ? (
                        <>
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} />
                                    ) : (
                                        <UserIcon size={64} />
                                    )}
                                </div>
                                <div className="profile-info">
                                    <h3 className="profile-username">{user.username}</h3>
                                    <div className="profile-email">{user.email}</div>
                                    {user.location && (
                                        <div className="profile-location">
                                            <MapPinIcon size={16} />
                                            <span>{user.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {user.bio && (
                                <div className="profile-section">
                                    <h4 className="section-title">About</h4>
                                    <p className="profile-bio">{user.bio}</p>
                                </div>
                            )}

                            <div className="profile-section">
                                <h4 className="section-title">Statistics</h4>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <HeartIcon size={24} />
                                        <div className="stat-value">{user.stats?.postsCount || 0}</div>
                                        <div className="stat-label">Posts Created</div>
                                    </div>
                                    <div className="stat-card">
                                        <MessageIcon size={24} />
                                        <div className="stat-value">{user.stats?.likesReceived || 0}</div>
                                        <div className="stat-label">Likes Received</div>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section">
                                <div className="profile-meta">
                                    Member since {joinDate}
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <div className="edit-profile-form">
                            <div className="avatar-upload-section">
                                <div className="avatar-preview">
                                    {avatar ? (
                                        <img src={avatar} alt="Avatar" />
                                    ) : (
                                        <UserIcon size={48} />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="profile-avatar-upload"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="file-input"
                                />
                                <label htmlFor="profile-avatar-upload" className="upload-avatar-btn btn btn-secondary">
                                    <UploadIcon size={16} />
                                    <span>Change Avatar</span>
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="edit-username">Username</label>
                                <input
                                    type="text"
                                    id="edit-username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="edit-bio">Bio</label>
                                <textarea
                                    id="edit-bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Tell us about yourself..."
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="edit-location">Location</label>
                                <input
                                    type="text"
                                    id="edit-location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="City, State"
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                >
                                    <CheckIcon size={18} />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
