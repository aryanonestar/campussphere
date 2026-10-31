import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import demoApi from '../services/mockPortalApi';

const AuthContext = createContext(null);

const TOKEN_KEY = 'student-portal-token';
const USER_KEY = 'student-portal-user';
const THEME_KEY = 'student-portal-theme';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');
  const isDemoMode = demoApi.isEnabled();
  const demoAccounts = useMemo(() => demoApi.getDemoAccounts(), []);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const bootstrapUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/users/profile');
        setUser(data);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
        if (!isDemoMode) {
          toast.error('Your session has expired. Please sign in again.');
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrapUser();
  }, [token, isDemoMode]);

  const persistAuth = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persistAuth(data.token, data.user);
    toast.success(data.message);
    return data;
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    persistAuth(data.token, data.user);
    toast.success(data.message);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const refreshProfile = async () => {
    const { data } = await api.get('/users/profile');
    setUser(data);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put('/users/update', payload);
    const refreshed = await refreshProfile();
    toast.success(data.message);
    return refreshed;
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      theme,
      register,
      login,
      logout,
      refreshProfile,
      updateProfile,
      toggleTheme,
      setUser,
      isDemoMode,
      demoAccounts,
    }),
    [user, token, loading, theme, isDemoMode, demoAccounts]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
};
