import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'resident' | 'community-leader' | 'admin';
  avatar?: string;
  phone?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: 'resident' | 'community-leader' | 'admin';
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  communityUpdates?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        let role: 'resident' | 'community-leader' | 'admin' = 'resident';
        let fullName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '';
        let joinedAt = new Date().toISOString();
        if (userDoc.exists()) {
          const data = userDoc.data();
          role = data.role || 'resident';
          fullName = data.fullName || fullName;
          joinedAt = data.joinedAt || joinedAt;
        }
        const userData: User = {
          id: firebaseUser.uid,
          fullName,
          email: firebaseUser.email || '',
          role,
          avatar: firebaseUser.photoURL || undefined,
          joinedAt,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting user
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;
      // Save user profile to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
        joinedAt: new Date().toISOString(),
        emailNotifications: userData.emailNotifications || false,
        smsNotifications: userData.smsNotifications || false,
        communityUpdates: userData.communityUpdates || false,
      });
      // Optionally update Firebase display name
      if (firebaseUser.displayName !== userData.fullName) {
        await (firebaseUser as any).updateProfile({ displayName: userData.fullName });
      }
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, { ...updates }, { merge: true });
      setUser({ ...user, ...updates });
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
