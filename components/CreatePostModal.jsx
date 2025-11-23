'use client';
import { useState } from 'react';
import { XIcon, UploadIcon, HeartIcon, MessageIcon, HelpCircleIcon, ImageIcon, CheckIcon } from '@/components/Icons';
import './CreatePostModal.css';

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
    const [activeTab, setActiveTab] = useState('adoption');
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        petName: '',
        breed: '',
        age: '',
        gender: 'Male',
        location: '',
        urgent: false,
        title: '',
        helpType: 'Medical',
        urgencyLevel: 'normal',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);

        try {
            // Upload each file to Vercel Blob
            const uploadPromises = files.map(async (file) => {
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
                return data.url; // Return the blob URL
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setUploadedImages([...uploadedImages, ...uploadedUrls]);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload images. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            ...formData,
            category: activeTab,
            image: uploadedImages[0] || 'https://images.unsplash.com/photo-1600077106724-946750eeaf8c?w=800',
            media: uploadedImages.length > 0 ? uploadedImages : undefined,
        };

        onSubmit(newPost);

        // Reset form
        setFormData({
            petName: '',
            breed: '',
            age: '',
            gender: 'Male',
            location: '',
            urgent: false,
            title: '',
            helpType: 'Medical',
            urgencyLevel: 'normal',
            description: '',
        });
        setUploadedImages([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Create New Post</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close modal">
                        <XIcon size={20} />
                    </button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'adoption' ? 'active' : ''}`}
                        onClick={() => setActiveTab('adoption')}
                    >
                        <HeartIcon size={18} />
                        <span>Adoption</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`}
                        onClick={() => setActiveTab('discussion')}
                    >
                        <MessageIcon size={18} />
                        <span>Discussion</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'help' ? 'active' : ''}`}
                        onClick={() => setActiveTab('help')}
                    >
                        <HelpCircleIcon size={18} />
                        <span>Help Request</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
                        onClick={() => setActiveTab('media')}
                    >
                        <ImageIcon size={18} />
                        <span>Media</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Image Upload Section */}
                    <div className="form-group">
                        <label className="form-label">
                            <UploadIcon size={16} />
                            <span>Upload Images</span>
                        </label>
                        <div className="image-upload-area">
                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="file-input"
                                disabled={uploading}
                            />
                            <label htmlFor="image-upload" className="upload-label">
                                <UploadIcon size={32} />
                                <div className="upload-text">
                                    <div className="upload-title">
                                        {uploading ? 'Uploading...' : 'Click to upload images'}
                                    </div>
                                    <div className="upload-hint">
                                        {uploading ? 'Please wait while images are being uploaded' : 'or drag and drop'}
                                    </div>
                                </div>
                            </label>

                            {uploadedImages.length > 0 && (
                                <div className="uploaded-images">
                                    {uploadedImages.map((img, index) => (
                                        <div key={index} className="uploaded-image">
                                            <img src={img} alt={`Upload ${index + 1}`} />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="remove-image-btn"
                                                aria-label="Remove image"
                                            >
                                                <XIcon size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Adoption Form Fields */}
                    {activeTab === 'adoption' && (
                        <>
                            <div className="form-group">
                                <label className="form-label" htmlFor="petName">Pet Name *</label>
                                <input
                                    type="text"
                                    id="petName"
                                    name="petName"
                                    value={formData.petName}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                    placeholder="e.g., Luna"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="breed">Breed *</label>
                                    <input
                                        type="text"
                                        id="breed"
                                        name="breed"
                                        value={formData.breed}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        placeholder="e.g., Golden Retriever"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="age">Age *</label>
                                    <input
                                        type="text"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        placeholder="e.g., 2 years"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="gender">Gender</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="location-adoption">Location *</label>
                                    <input
                                        type="text"
                                        id="location-adoption"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        placeholder="e.g., San Francisco, CA"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="urgent"
                                        checked={formData.urgent}
                                        onChange={handleChange}
                                    />
                                    <span>Mark as urgent</span>
                                </label>
                            </div>
                        </>
                    )}

                    {/* Discussion Form Fields */}
                    {activeTab === 'discussion' && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="discussion-title">Discussion Title *</label>
                            <input
                                type="text"
                                id="discussion-title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                                required
                                placeholder="What would you like to discuss?"
                            />
                        </div>
                    )}

                    {/* Help Request Form Fields */}
                    {activeTab === 'help' && (
                        <>
                            <div className="form-group">
                                <label className="form-label" htmlFor="help-title">Request Title *</label>
                                <input
                                    type="text"
                                    id="help-title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                    placeholder="What help do you need?"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="helpType">Help Type</label>
                                    <select
                                        id="helpType"
                                        name="helpType"
                                        value={formData.helpType}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="Medical">Medical</option>
                                        <option value="Shelter">Shelter</option>
                                        <option value="Training">Training</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="urgencyLevel">Urgency</label>
                                    <select
                                        id="urgencyLevel"
                                        name="urgencyLevel"
                                        value={formData.urgencyLevel}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="location-help">Location *</label>
                                <input
                                    type="text"
                                    id="location-help"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                    placeholder="Where do you need help?"
                                />
                            </div>
                        </>
                    )}

                    {/* Common Description Field */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-textarea"
                            required
                            placeholder={
                                activeTab === 'adoption'
                                    ? 'Tell us about this wonderful pet...'
                                    : activeTab === 'discussion'
                                        ? 'Share your thoughts with the community...'
                                        : activeTab === 'help'
                                            ? 'Describe the help you need...'
                                            : 'Share your caption...'
                            }
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <CheckIcon size={18} />
                            <span>Create Post</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
