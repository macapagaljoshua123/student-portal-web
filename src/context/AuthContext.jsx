import { createContext, useContext, useEffect, useState, useCallback } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("sgp_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((tokenResponse) => {
    const { access_token, ...userData } = tokenResponse;
    localStorage.setItem("sgp_token", access_token);
    localStorage.setItem("sgp_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await apiClient.post("/auth/login", { email, password });
      return persistSession(data);
    },
    [persistSession]
  );

  const loginWithGoogle = useCallback(
    async (idToken) => {
      const { data } = await apiClient.post("/auth/google", { id_token: idToken });
      return persistSession(data);
    },
    [persistSession]
  );

  // Prompt#1 section 2.1: Google sign-up requires choosing Free or Pro tier.
  // Free tier completes sign-up immediately; Pro tier is a request that
  // Super Admin must manually approve, so no session is created for it.
  const signupWithGoogle = useCallback(
    async (idToken, tier) => {
      if (tier === "pro") {
        const { data } = await apiClient.post("/auth/google/pro-request", {
          id_token: idToken,
        });
        return { pending: true, ...data };
      }
      const { data } = await apiClient.post("/auth/google", {
        id_token: idToken,
        tier: "free",
      });
      return persistSession(data);
    },
    [persistSession]
  );

  const completePasswordReset = useCallback(() => {
    setUser((prev) => {
      const next = { ...prev, must_reset_password: false };
      localStorage.setItem("sgp_user", JSON.stringify(next));
      return next;
    });
  }, []);

  // Merge a partial update (e.g. a new full_name) into the cached user
  // object after a successful Settings save, without a full re-login.
  const refreshUser = useCallback((partial) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem("sgp_user", JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sgp_token");
    localStorage.removeItem("sgp_user");
    setUser(null);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        signupWithGoogle,
        logout,
        completePasswordReset,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
