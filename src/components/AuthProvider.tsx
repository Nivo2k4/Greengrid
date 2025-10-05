import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isPredefindedLeader, validateLeaderCredentials, getLeaderByEmail } from '../data/communityLeaders';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'resident' | 'community-leader';
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
  role: 'resident' | 'community-leader';
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  communityUpdates?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);

      if (firebaseUser) {
        try {
          // Sync user data with backend
          const syncResponse = await fetch('http://localhost:5000/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
              phone: firebaseUser.phoneNumber || '',
              photoURL: firebaseUser.photoURL || '',
              providerId: firebaseUser.providerId || 'firebase'
            }),
          });

          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            const userData: User = {
              id: firebaseUser.uid,
              fullName: syncData.user.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
              email: firebaseUser.email || '',
              role: syncData.user.role || 'resident',
              avatar: firebaseUser.photoURL || syncData.user.photoURL,
              joinedAt: syncData.user.createdAt || new Date().toISOString()
            };

            setUser(userData);
            localStorage.setItem('greengrid_user', JSON.stringify(userData));
            console.log('✅ User authenticated and synced with backend:', userData);
          } else {
            throw new Error('Failed to sync user data');
          }
        } catch (error) {
          console.error('❌ Error syncing user data:', error);
          // Fallback to basic user data
          const userData: User = {
            id: firebaseUser.uid,
            fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            email: firebaseUser.email || '',
            role: 'resident',
            avatar: firebaseUser.photoURL || undefined,
            joinedAt: new Date().toISOString()
          };
          setUser(userData);
          localStorage.setItem('greengrid_user', JSON.stringify(userData));
        }
      } else {
        setUser(null);
        localStorage.removeItem('greengrid_user');
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      console.log('🔐 Attempting Firebase login for:', email);

      // Check if this is a predefined community leader first
      if (isPredefindedLeader(email)) {
        if (validateLeaderCredentials(email, password)) {
          const leaderData = getLeaderByEmail(email);
          if (leaderData) {
            // For community leaders, create a Firebase user account if it doesn't exist
            try {
              // Try to sign in with Firebase first
              await signInWithEmailAndPassword(auth, email, password);
              console.log('✅ Community leader authenticated with Firebase');
              return true;
            } catch (firebaseError: any) {
              if (firebaseError.code === 'auth/user-not-found') {
                // Create Firebase account for community leader
                try {
                  await createUserWithEmailAndPassword(auth, email, password);
                  console.log('✅ Community leader account created in Firebase');
                  return true;
                } catch (createError) {
                  console.error('❌ Failed to create community leader account:', createError);
                  return false;
                }
              } else {
                console.error('❌ Firebase authentication error:', firebaseError);
                return false;
              }
            }
          }
        }
        setIsLoading(false);
        return false;
      }

      // Regular user authentication with Firebase
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ User authenticated with Firebase');
        return true;
      } catch (firebaseError: any) {
        console.error('❌ Firebase login error:', firebaseError);

        // Provide user-friendly error messages
        if (firebaseError.code === 'auth/user-not-found') {
          throw new Error('No account found with this email address. Please register first.');
        } else if (firebaseError.code === 'auth/wrong-password') {
          throw new Error('Incorrect password. Please try again.');
        } else if (firebaseError.code === 'auth/invalid-email') {
          throw new Error('Invalid email address format.');
        } else if (firebaseError.code === 'auth/too-many-requests') {
          throw new Error('Too many failed attempts. Please try again later.');
        } else {
          throw new Error('Login failed. Please check your credentials and try again.');
        }
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setIsLoading(false);
      throw error; // Re-throw to let the UI handle the error message
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);

    try {
      console.log('📝 Attempting Firebase registration for:', userData.email);

      // Create Firebase user account
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      console.log('✅ User account created in Firebase:', firebaseUser.uid);

      // Update the user's display name in Firebase
      try {
        // Use the updateProfile method from the user object
        await (firebaseUser as any).updateProfile({
          displayName: userData.fullName
        });
        console.log('✅ User profile updated in Firebase');
      } catch (updateError) {
        console.warn('⚠️ Could not update Firebase profile:', updateError);
      }

      // 🔥 MANUALLY SYNC WITH BACKEND IMMEDIATELY
      try {
        console.log('🔄 Syncing new user with backend...');
        const syncResponse = await fetch('http://localhost:5000/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: userData.fullName,
            phone: '',
            photoURL: firebaseUser.photoURL || '',
            providerId: 'firebase',
            role: userData.role, // 🔥 IMPORTANT: Include the role from registration
            preferences: {
              emailNotifications: userData.emailNotifications || false,
              smsNotifications: userData.smsNotifications || false,
              communityUpdates: userData.communityUpdates || false
            }
          }),
        });

        if (syncResponse.ok) {
          const syncData = await syncResponse.json();
          console.log('✅ User synced with backend successfully:', syncData);

          // Update local state immediately
          const newUser: User = {
            id: firebaseUser.uid,
            fullName: userData.fullName,
            email: firebaseUser.email || '',
            role: userData.role,
            avatar: firebaseUser.photoURL || undefined,
            joinedAt: new Date().toISOString()
          };

          setUser(newUser);
          localStorage.setItem('greengrid_user', JSON.stringify(newUser));
        } else {
          console.error('❌ Failed to sync with backend:', await syncResponse.text());
        }
      } catch (syncError) {
        console.error('❌ Backend sync error:', syncError);
        // Don't fail registration if sync fails, but log the error
      }

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      setIsLoading(false);

      // Provide user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email address already exists. Please try logging in instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Signing out user');
      await signOut(auth);
      // The onAuthStateChanged listener will handle clearing the user state
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Fallback: manually clear user state
      setUser(null);
      localStorage.removeItem('greengrid_user');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      try {
        // Update local state
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('greengrid_user', JSON.stringify(updatedUser));

        // Sync with backend
        const syncResponse = await fetch('http://localhost:5000/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.id,
            email: updatedUser.email,
            name: updatedUser.fullName,
            phone: updatedUser.phone || '',
            photoURL: updatedUser.avatar || '',
            providerId: 'firebase'
          }),
        });

        if (syncResponse.ok) {
          console.log('✅ Profile updated and synced with backend');
        } else {
          console.error('❌ Failed to sync profile update with backend');
        }
      } catch (error) {
        console.error('❌ Profile update error:', error);
      }
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
