import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  auth, 
  onAuthStateChanged, 
  signInWithGoogle, 
  logOut, 
  testConnection 
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSyncing: boolean;
  setIsSyncing: (val: boolean) => void;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSyncing: false,
  setIsSyncing: () => {},
  signIn: async () => null,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Run connection health check
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const signedInUser = await signInWithGoogle();
      setUser(signedInUser);
      return signedInUser;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSyncing,
        setIsSyncing,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
