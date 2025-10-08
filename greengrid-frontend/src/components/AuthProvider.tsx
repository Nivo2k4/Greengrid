import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// @ts-ignore
import { auth, db } from "../config/firebase"; // Make sure these are exported in your firebase.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface User {
  uid: string;
  email: string;
  fullName?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Fetch profile data from Firestore
        const profileDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const profileData = profileDoc.exists() ? profileDoc.data() : {};
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          ...profileData,
        });
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
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      // Create profile in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        fullName: userData.fullName || "",
        email: userData.email,
        role: userData.role || "resident",
        createdAt: new Date().toISOString(),
      });
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await signOut(auth);
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
