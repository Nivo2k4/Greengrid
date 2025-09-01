import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isPredefindedLeader, validateLeaderCredentials, getLeaderByEmail } from '../data/communityLeaders';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'resident' | 'community-leader';
  avatar?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: 'resident' | 'community-leader';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('greengrid_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('greengrid_user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if this is a predefined community leader
      if (isPredefindedLeader(email)) {
        if (validateLeaderCredentials(email, password)) {
          const leaderData = getLeaderByEmail(email);
          if (leaderData) {
            const leaderUser: User = {
              id: `leader_${Date.now()}`,
              fullName: leaderData.name,
              email: leaderData.email,
              role: 'community-leader',
              avatar: leaderData.avatar,
              joinedAt: leaderData.joinDate
            };
            
            setUser(leaderUser);
            localStorage.setItem('greengrid_user', JSON.stringify(leaderUser));
            setIsLoading(false);
            return true;
          }
        }
        setIsLoading(false);
        return false;
      }
      
      // Regular user authentication
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: `user_${Date.now()}`,
          fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email,
          role: 'resident',
          joinedAt: new Date().toISOString()
        };
        
        setUser(mockUser);
        localStorage.setItem('greengrid_user', JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock registration - in real app, this would be an API call
      const newUser: User = {
        id: `user_${Date.now()}`,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
        joinedAt: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('greengrid_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('greengrid_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('greengrid_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
