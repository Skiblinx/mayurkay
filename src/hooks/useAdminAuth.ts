import { useState, useEffect } from 'react';
import { adminLogin, verifyAdminToken } from '@/services/apiService';
import { AdminUser } from '@/types/api';

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await verifyAdminToken();
      setUser(response.user);
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await adminLogin(email, password);
      
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error instanceof Error ? error.message : 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('authToken');
      setUser(null);
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error instanceof Error ? error.message : 'Logout failed' };
    }
  };

  return {
    user,
    session: null, // For backward compatibility
    isAdmin: !!user && user.isActive,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};