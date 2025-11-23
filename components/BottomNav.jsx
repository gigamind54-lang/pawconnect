'use client';
import { HomeIcon, SearchIcon, PlusIcon, HeartIcon, UserIcon } from '@/components/Icons';
import './BottomNav.css';

export default function BottomNav({ currentUser, onNavigate, activeTab, onCreatePost, onOpenAuth, onOpenProfile }) {
    const handleTabClick = (tab) => {
        if (tab === 'create') {
            if (currentUser) {
                onCreatePost();
            } else {
                onOpenAuth();
            }
        } else if (tab === 'profile') {
            if (currentUser) {
                onOpenProfile();
            } else {
                onOpenAuth();
            }
        } else {
            onNavigate(tab);
        }
    };

    return (
        <nav className="bottom-nav">
            <button
                className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => handleTabClick('home')}
                aria-label="Home"
            >
                <HomeIcon size={24} />
            </button>

            <button
                className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => handleTabClick('search')}
                aria-label="Search"
            >
                <SearchIcon size={24} />
            </button>

            <button
                className="nav-item create-btn"
                onClick={() => handleTabClick('create')}
                aria-label="Create post"
            >
                <div className="create-icon">
                    <PlusIcon size={22} />
                </div>
            </button>

            <button
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => handleTabClick('notifications')}
                aria-label="Notifications"
            >
                <HeartIcon size={24} />
            </button>

            <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleTabClick('profile')}
                aria-label="Profile"
            >
                {currentUser?.avatar ? (
                    <div className={`profile-avatar ${activeTab === 'profile' ? 'active' : ''}`}>
                        <img src={currentUser.avatar} alt={currentUser.username} />
                    </div>
                ) : (
                    <UserIcon size={24} />
                )}
            </button>
        </nav>
    );
}
