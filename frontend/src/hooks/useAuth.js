'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { sendSignInLinkToEmail } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if magic link sign in
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          // cleanup URL
          window.history.replaceState(null, '', window.location.pathname);
        })
        .catch((error) => console.error('Error signing in with link', error));
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/verify`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser({ ...firebaseUser, dbData: res.data });
        } catch (err) {
          console.error('Auth verification failed. Logging out.', err);
          auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email) => {
    const actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
  };

  const logout = () => auth.signOut();

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
