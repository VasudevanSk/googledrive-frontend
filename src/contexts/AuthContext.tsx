import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType, RegisterData, AuthResponse } from '@/types';
import { apiClient } from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        apiClient.setToken(storedToken);
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.login(email, password);
      
      if (response.success && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        apiClient.setToken(response.token);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.register(data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    apiClient.setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.forgotPassword(email);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send reset email',
      };
    }
  }, []);

  const resetPassword = useCallback(async (resetToken: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.resetPassword(resetToken, password);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to reset password',
      };
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
