"use client";

import * as React from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile } from "./api";

interface AuthContextValue {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ isNewUser: boolean }>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<{ isNewUser: boolean }>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ isNewUser: boolean }> => {
    // Clear any stale onboarding data from a previous user on this device
    // so the login redirect check doesn't wrongly send this new user to dashboard
    localStorage.removeItem("cognivex_onboarding");

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name.trim()) {
      await updateProfile(credential.user, { displayName: name.trim() });
    }

    // backend returns 201 for brand-new profiles, 200 for already-existing
    const { isNewUser } = await createUserProfile(
      { name: name.trim(), email },
      credential.user
    );

    // Email signup always creates a new Firebase user, so isNewUser is always true here.
    // We still propagate it for consistency with googleSignIn.
    return { isNewUser };
  };

  const logout = async () => {
    // Clear all per-user localStorage keys so the next user on this
    // device starts fresh (no stale onboarding / name data).
    localStorage.removeItem("cognivex_onboarding");
    localStorage.removeItem("cognivex_user_name");
    await signOut(auth);
  };

  const googleSignIn = async (): Promise<{ isNewUser: boolean }> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;
    const displayName = user.displayName || user.email?.split("@")[0] || "User";

    localStorage.setItem("cognivex_user_name", displayName);

    const idToken = await user.getIdToken();
    if (!idToken) {
      throw new Error("Failed to get authentication token from Google sign-in");
    }

    const { isNewUser } = await createUserProfile(
      {
        name: displayName,
        email: user.email || "",
      },
      user
    );

    return { isNewUser };
  };

  const value = React.useMemo(
    () => ({ currentUser, loading, login, signup, logout, googleSignIn }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
