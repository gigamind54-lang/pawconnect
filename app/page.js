'use client';
import { useState, useEffect } from 'react';
import { HomeIcon, HeartIcon, MessageIcon, HelpCircleIcon, ImageIcon } from '@/components/Icons';
import { useUser } from '@/context/UserContext';
import { fetchPosts, createPost, toggleLike } from '@/lib/api';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import AdoptionCard from '@/components/AdoptionCard';
import DiscussionCard from '@/components/DiscussionCard';
import HelpRequestCard from '@/components/HelpRequestCard';
import MediaGallery from '@/components/MediaGallery';
import CreatePostModal from '@/components/CreatePostModal';
import AuthModal from '@/components/AuthModal';
import UserProfile from '@/components/UserProfile';
import './page.css';

export default function Home() {
  const { currentUser, isAuthenticated, token, register, login, logout, updateProfile, incrementPostCount } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Fetch posts from API on mount
  useEffect(() => {
    loadPostsFromAPI();
  }, []);

  const loadPostsFromAPI = async () => {
    try {
      setLoading(true);
      const apiPosts = await fetchPosts();
      setPosts(apiPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleCreatePost = async (newPost) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    // Prepare post data for API
    const postData = {
      type: newPost.category,
      title: newPost.title,
      description: newPost.description,
      images: newPost.media && newPost.media.length > 0
        ? newPost.media // Use media array for media posts
        : (newPost.image ? [newPost.image] : []), // Or single image
      location: newPost.location,
      details: {}
    };

    // Add type-specific details
    if (newPost.category === 'adoption') {
      postData.details = {
        petName: newPost.petName,
        species: newPost.species,
        breed: newPost.breed,
        age: newPost.age,
        gender: newPost.gender,
        size: newPost.size,
        urgent: newPost.urgent || false
      };
    } else if (newPost.category === 'discussion') {
      postData.details = {
        tags: newPost.tags || [],
        isPopular: false
      };
    } else if (newPost.category === 'help') {
      postData.details = {
        helpType: newPost.helpType,
        urgencyLevel: newPost.urgencyLevel || 'normal',
        status: 'open'
      };
    } else if (newPost.category === 'media') {
      // Media posts don't need extra details, images are in the images array
      postData.details = {};
    }

    // Call API
    const result = await createPost(postData, token);

    if (result.success) {
      // Reload posts from API
      await loadPostsFromAPI();
      incrementPostCount();
      setModalOpen(false);
    } else {
      alert('Failed to create post: ' + (result.error || 'Unknown error'));
    }
  };

  const handleAuth = async (type, data) => {
    console.log('handleAuth called:', { type, data });
    setAuthError('');

    if (type === 'register') {
      const result = await register(data);
      console.log('Register result:', result);
      if (result.success) {
        setAuthModalOpen(false);
        setAuthError('');
        await loadPostsFromAPI(); // Reload posts after login
      } else {
        setAuthError(result.error || 'Registration failed');
        console.log('Registration error:', result.error);
      }
    } else {
      const result = await login(data.email, data.password);
      console.log('Login result:', result);
      if (result.success) {
        setAuthModalOpen(false);
        setAuthError('');
        await loadPostsFromAPI(); // Reload posts after login
      } else {
        setAuthError(result.error || 'Login failed');
        console.log('Login error:', result.error);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfileUpdate = (updates) => {
    updateProfile(updates);
  };

  const handleOpenCreatePost = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  const handleLike = async (postId, liked) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    // Call API to toggle like
    const result = await toggleLike(postId, token);

    if (result.success) {
      // Reload posts to get updated like count
      await loadPostsFromAPI();
    }
  };

  const handleSave = (postId, saved) => {
    console.log(`Post ${postId} ${saved ? 'saved' : 'unsaved'}`);
  };

  const filteredPosts = filterType === 'all'
    ? posts
    : posts.filter(post => post.category === filterType);

  const renderPost = (post) => {
    switch (post.category) {
      case 'adoption':
        return <AdoptionCard key={post.id} post={post} onLike={handleLike} onSave={handleSave} />;
      case 'discussion':
        return <DiscussionCard key={post.id} post={post} onLike={handleLike} />;
      case 'help':
        return <HelpRequestCard key={post.id} post={post} />;
      case 'media':
        return <MediaGallery key={post.id} post={post} onLike={handleLike} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onCreatePost={handleOpenCreatePost}
      />

      <main className="main-container">
        <div className="content-wrapper">
          <div className="feed-section">
            <div className="filter-bar">
              <button
                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                <HomeIcon size={16} />
                <span>All</span>
              </button>
              <button
                className={`filter-btn ${filterType === 'adoption' ? 'active' : ''}`}
                onClick={() => setFilterType('adoption')}
              >
                <HeartIcon size={16} />
                <span>Adoptions</span>
              </button>
              <button
                className={`filter-btn ${filterType === 'discussion' ? 'active' : ''}`}
                onClick={() => setFilterType('discussion')}
              >
                <MessageIcon size={16} />
                <span>Discussions</span>
              </button>
              <button
                className={`filter-btn ${filterType === 'help' ? 'active' : ''}`}
                onClick={() => setFilterType('help')}
              >
                <HelpCircleIcon size={16} />
                <span>Help</span>
              </button>
              <button
                className={`filter-btn ${filterType === 'media' ? 'active' : ''}`}
                onClick={() => setFilterType('media')}
              >
                <ImageIcon size={16} />
                <span>Media</span>
              </button>
            </div>

            <div className="posts-grid">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(renderPost)
              ) : (
                <div className="empty-state">
                  <h3>No posts found</h3>
                  <p>Try adjusting your filters or create a new post</p>
                  {isAuthenticated && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setModalOpen(true)}
                    >
                      Create Post
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNav
        currentUser={currentUser}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onCreatePost={handleOpenCreatePost}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      <CreatePostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => { setAuthModalOpen(false); setAuthError(''); }}
        onAuthSuccess={handleAuth}
        error={authError}
      />

      {currentUser && (
        <UserProfile
          user={currentUser}
          onClose={() => setProfileModalOpen(false)}
          onUpdate={handleProfileUpdate}
          isOpen={profileModalOpen}
        />
      )}
    </>
  );
}

// Sample data
const samplePosts = [
  {
    id: 1,
    category: 'adoption',
    petName: 'Luna',
    breed: 'Golden Retriever',
    age: '2 years',
    gender: 'Female',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
    description: 'Luna is a sweet and gentle Golden Retriever looking for her forever home. She loves playing fetch and is great with children!',
    urgent: false,
    author: 'Sarah Martinez',
    authorAvatar: null,
    timeAgo: '2 hours ago',
    likes: 42,
  },
  {
    id: 2,
    category: 'discussion',
    title: 'Best dog training techniques for puppies?',
    description: 'I just adopted an 8-week-old puppy and would love to hear your recommendations for early training. What methods have worked best for you?',
    author: 'Sarah M.',
    authorAvatar: null,
    timeAgo: '2 hours ago',
    tags: ['training', 'puppies', 'advice'],
    comments: 24,
    likes: 48,
    views: 312,
    isPopular: true,
  },
  {
    id: 3,
    category: 'help',
    title: 'Need emergency vet recommendation in Austin',
    description: 'My cat is showing signs of illness and I need an emergency vet in the Austin area. Any recommendations would be greatly appreciated!',
    helpType: 'Medical',
    location: 'Austin, TX',
    requester: 'Mike T.',
    timeAgo: '30 minutes ago',
    urgencyLevel: 'high',
    responses: 7,
    status: 'open',
  },
  {
    id: 4,
    category: 'media',
    description: 'Perfect day at the dog park with my best friends!',
    author: 'Emily R.',
    authorAvatar: null,
    timeAgo: '5 hours ago',
    media: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
      'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400',
    ],
    likes: 156,
    comments: 23,
  },
  {
    id: 5,
    category: 'adoption',
    petName: 'Charlie',
    breed: 'Beagle Mix',
    age: '4 years',
    gender: 'Male',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800',
    description: 'Charlie is a friendly and energetic Beagle mix who loves adventures and cuddles. He would do best in a home with a yard.',
    urgent: true,
    author: 'John Davis',
    authorAvatar: null,
    timeAgo: '1 day ago',
    likes: 87,
  },
  {
    id: 6,
    category: 'discussion',
    title: 'Adopting vs. buying from a breeder - your thoughts?',
    description: 'I would love to hear the community perspective on this topic. What factors should someone consider when making this decision?',
    author: 'John D.',
    authorAvatar: null,
    timeAgo: '1 day ago',
    tags: ['adoption', 'ethics', 'discussion'],
    comments: 89,
    likes: 124,
    views: 1205,
    isPopular: true,
  },
  {
    id: 7,
    category: 'adoption',
    petName: 'Whiskers',
    breed: 'Tabby Cat',
    age: '1 year',
    gender: 'Male',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    description: 'Whiskers is a playful and affectionate tabby cat. He loves to chase toys and enjoys sunny windowsills.',
    urgent: false,
    author: 'Lisa Chen',
    authorAvatar: null,
    timeAgo: '3 days ago',
    likes: 65,
  },
  {
    id: 8,
    category: 'help',
    title: 'Looking for pet-sitting services',
    description: 'I will be traveling for 2 weeks and need a reliable pet sitter for my two cats. Any recommendations in the Seattle area?',
    helpType: 'Other',
    location: 'Seattle, WA',
    requester: 'Anna K.',
    timeAgo: '3 hours ago',
    urgencyLevel: 'normal',
    responses: 12,
    status: 'in-progress',
  },
];
