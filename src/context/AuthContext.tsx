import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const fetchProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const syncRes = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: firebaseUser.displayName })
      });
      
      if (syncRes.ok) {
        setProfile(await syncRes.json());
      } else {
        console.error("Failed to sync user", await syncRes.text());
      }
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  const fetchDemoProfile = async () => {
    try {
      const syncRes = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer DEMO_TOKEN`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'Demo User' })
      });
      
      if (syncRes.ok) {
        setProfile(await syncRes.json());
      } else {
        console.error("Failed to sync demo user");
      }
    } catch (err) {
      console.error("Error fetching demo profile", err);
    }
  };

  useEffect(() => {
    const isDemo = localStorage.getItem('demoMode') === 'true';
    if (isDemo) {
      setDemoMode(true);
      setUser({ uid: 'demo_user_123', email: 'demo@example.com', displayName: 'Demo User' } as any);
      fetchDemoProfile().then(() => setLoading(false));
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };
  
  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const token = await cred.user.getIdToken();
    const syncRes = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    if (syncRes.ok) {
      setProfile(await syncRes.json());
    }
  };
  
  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signInAsDemo = async () => {
    localStorage.setItem('demoMode', 'true');
    setDemoMode(true);
    setUser({ uid: 'demo_user_123', email: 'demo@example.com', displayName: 'Demo User' } as any);
    await fetchDemoProfile();
  };

  const logout = async () => {
    if (demoMode) {
      localStorage.removeItem('demoMode');
      setDemoMode(false);
      setUser(null);
      setProfile(null);
      return;
    }
    await firebaseSignOut(auth);
  };

  const getAuthToken = async () => {
    if (demoMode) return 'DEMO_TOKEN';
    if (!user) return null;
    return await user.getIdToken();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, signInAsDemo, logout, getAuthToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
