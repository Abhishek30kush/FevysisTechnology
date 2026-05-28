import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  auth 
} from "../services/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { db } from "../services/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  async function signUp(email, password, forcedRole) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const role = forcedRole || (email.toLowerCase().includes("admin") ? "admin" : "client");
    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      email: email,
      role: role,
      createdAt: serverTimestamp()
    });
    return res;
  }

  async function login(email, password) {
    const res = await signInWithEmailAndPassword(auth, email, password);
    // Ensure user document exists in database
    const userDocRef = doc(db, "users", res.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      const role = email.toLowerCase().includes("admin") ? "admin" : "client";
      await setDoc(userDocRef, {
        uid: res.user.uid,
        email: email,
        role: role,
        createdAt: serverTimestamp()
      });
    }
    return res;
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const userDocRef = doc(db, "users", res.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      const role = res.user.email.toLowerCase().includes("admin") ? "admin" : "client";
      await setDoc(userDocRef, {
        uid: res.user.uid,
        email: res.user.email,
        role: role,
        createdAt: serverTimestamp()
      });
    }
    return res;
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().role === "admin");
          } else {
            // Seed a new user document in Firestore database
            // If email contains "admin", assign the "admin" role, else "client"
            const role = user.email.toLowerCase().includes("admin") ? "admin" : "client";
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              role: role,
              createdAt: serverTimestamp()
            });
            setIsAdmin(role === "admin");
          }
        } catch (err) {
          console.error("Firestore user fetch error:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    signUp,
    login,
    logout,
    loginWithGoogle,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
