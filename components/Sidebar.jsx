'use client';
import { TrendingUpIcon, UserIcon, HeartIcon, FilterIcon } from '@/components/Icons';
import './Sidebar.css';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-card glass-card">
                <h3 className="sidebar-title">
                    <TrendingUpIcon size={20} />
                    <span>Trending Topics</span>
                </h3>
                <div className="trending-list">
                    <div className="trending-item">
                        <span className="trending-tag">#AdoptDontShop</span>
                        <span className="trending-count">2.4k</span>
                    </div>
                    <div className="trending-item">
                        <span className="trending-tag">#DogTraining</span>
                        <span className="trending-count">1.8k</span>
                    </div>
                    <div className="trending-item">
                        <span className="trending-tag">#CatLovers</span>
                        <span className="trending-count">1.5k</span>
                    </div>
                    <div className="trending-item">
                        <span className="trending-tag">#PetHealth</span>
                        <span className="trending-count">980</span>
                    </div>
                    <div className="trending-item">
                        <span className="trending-tag">#RescuePets</span>
                        <span className="trending-count">756</span>
                    </div>
                </div>
            </div>

            <div className="sidebar-card glass-card">
                <h3 className="sidebar-title">
                    <UserIcon size={20} />
                    <span>Community Stats</span>
                </h3>
                <div className="stats-list">
                    <div className="stat-item">
                        <div className="stat-value">15.2k</div>
                        <div className="stat-label">Active Members</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">3,847</div>
                        <div className="stat-label">Pets Adopted</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">5.6k</div>
                        <div className="stat-label">Discussions</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">892</div>
                        <div className="stat-label">Help Resolved</div>
                    </div>
                </div>
            </div>

            <div className="sidebar-card glass-card featured-card">
                <h3 className="sidebar-title">
                    <HeartIcon size={20} />
                    <span>Featured Adoption</span>
                </h3>
                <div className="featured-pet">
                    <div className="featured-badge badge badge-urgent">URGENT</div>
                    <div className="featured-pet-name">Max</div>
                    <div className="featured-pet-breed">Labrador Mix • 3 years</div>
                    <p className="featured-pet-desc">
                        Friendly, well-trained dog looking for a loving home. Great with kids!
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        <HeartIcon size={18} />
                        <span>View Profile</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
