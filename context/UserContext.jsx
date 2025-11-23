'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);

    // Load token and user from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('pawconnect_token');
        if (savedToken) {
            setToken(savedToken);
            fetchCurrentUser(savedToken);
        }
    }, []);

    // Fetch current user from API
    const fetchCurrentUser = async (authToken) => {
        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data.user);
                setIsAuthenticated(true);
            } else {
                // Token invalid, clear it
                localStorage.removeItem('pawconnect_token');
                setToken(null);
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Fetch user error:', error);
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('pawconnect_token', data.token);
                setToken(data.token);
                setCurrentUser(data.user);
                setIsAuthenticated(true);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: 'Failed to connect to server' };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('pawconnect_token', data.token);
                setToken(data.token);
                setCurrentUser(data.user);
                setIsAuthenticated(true);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Failed to connect to server' };
        }
    };

    const logout = () => {
        localStorage.removeItem('pawconnect_token');
        setToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (updates) => {
        if (!currentUser) return { success: false, error: 'Not authenticated' };

        try {
            const response = await fetch(`/api/users/${currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (response.ok) {
                setCurrentUser(data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: 'Failed to update profile' };
        }
    };

    const incrementPostCount = () => {
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                stats: {
                    ...currentUser.stats,
                    postsCount: (currentUser.stats?.postsCount || 0) + 1
                }
            };
            setCurrentUser(updatedUser);
        }
    };

    const value = {
        currentUser,
        isAuthenticated,
        token,
        register,
        login,
        logout,
        updateProfile,
        incrementPostCount
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
