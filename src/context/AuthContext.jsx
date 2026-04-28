import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { firebaseAuth } from '../lib/firebase';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          setToken(idToken);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          });

          // Fetch user profile from backend
          const response = await api.get('/api/me', {
            headers: { Authorization: `Bearer ${idToken}` }
          });
          
          setProfile(response.data.profile);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else {
        setUser(null);
        setProfile(null);
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, profileData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Save profile to backend
      const response = await api.post('/api/profile', profileData, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      
      setProfile(response.data.profile);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
      setProfile(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/api/profile', updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(response.data.profile);
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshProfile = async () => {
    try {
      if (!token) return;
      const response = await api.get('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.profile);
      return { success: true };
    } catch (error) {
      console.error('Refresh profile error:', error);
      return { success: false, error: error.message };
    }
  };

  const getAuthToken = async () => {
    if (firebaseAuth.currentUser) {
      return await firebaseAuth.currentUser.getIdToken();
    }
    return null;
  };

  const value = {
    user,
    profile,
    role: profile?.role,
    loading,
    token,
    signup,
    login,
    logout,
    resetPassword,
    updateProfile,
    refreshProfile,
    getAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
