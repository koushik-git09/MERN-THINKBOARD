import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api, { TOKEN_KEY } from "../lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setSession = (nextUser, token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setUser(nextUser);
  };

  const refreshMe = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = async ({ username, password }) => {
    const res = await api.post("/auth/register", { username, password });
    setSession(res.data.user, res.data.token);
    toast.success("Account created");
  };

  const login = async ({ username, password }) => {
    const res = await api.post("/auth/login", { username, password });
    setSession(res.data.user, res.data.token);
    toast.success("Logged in");
  };

  const logout = () => {
    setSession(null, null);
    toast.success("Logged out");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshMe,
      isAuthenticated: Boolean(user),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
