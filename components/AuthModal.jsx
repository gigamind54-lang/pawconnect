'use client';
import { useState, useEffect } from 'react';
import { XIcon, UploadIcon, CheckIcon, UserIcon } from '@/components/Icons';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, error: externalError }) {
    const [activeTab, setActiveTab] = useState('login');
    const [error, setError] = useState('');
    const [avatar, setAvatar] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        bio: '',
        location: ''
    });

    // Update internal error when external error changes
    useEffect(() => {
        if (externalError) {
            setError(externalError);
        }
    }, [externalError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const [uploading, setUploading] = useState(false);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setAvatar(data.url); // Use the Vercel Blob URL
        } catch (error) {
            console.error('Avatar upload error:', error);
            alert('Failed to upload avatar. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const validateForm = () => {
        if (activeTab === 'register') {
            if (!formData.username || !formData.email || !formData.password) {
                setError('Please fill in all required fields');
                return false;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return false;
            }
            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                setError('Please enter a valid email');
                return false;
            }
        } else {
            if (!formData.email || !formData.password) {
                setError('Please enter email and password');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted', { activeTab, formData });

        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        if (activeTab === 'register') {
            const userData = {
                ...formData,
                avatar: avatar || null
            };
            console.log('Calling register with:', userData);
            onAuthSuccess('register', userData);
        } else {
            console.log('Calling login with:', { email: formData.email });
            onAuthSuccess('login', {
                email: formData.email,
                password: formData.password
            });
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            bio: '',
            location: ''
        });
        setAvatar('');
        setError('');
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="auth-modal modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <XIcon size={20} />
                    </button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => switchTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => switchTab('register')}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    {activeTab === 'register' && (
                        <>
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
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="file-input"
                                    disabled={uploading}
                                />
                                <label htmlFor="avatar-upload" className="upload-avatar-btn btn btn-secondary">
                                    <UploadIcon size={16} />
                                    <span>{uploading ? 'Uploading...' : 'Upload Avatar'}</span>
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="username">Username *</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder={activeTab === 'register' ? 'At least 6 characters' : 'Enter your password'}
                            required
                        />
                    </div>

                    {activeTab === 'register' && (
                        <>
                            <div className="form-group">
                                <label className="form-label" htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Tell us about yourself and your pets..."
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="City, State"
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        <CheckIcon size={18} />
                        <span>{activeTab === 'login' ? 'Login' : 'Create Account'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
