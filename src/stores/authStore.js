// Authentication Store using Zustand

import { create } from 'zustand';
import { authService } from '../services/auth.js';

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  initialize: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await authService.init();
      const user = authService.getCurrentUser();
      const isAuthenticated = authService.isAuthenticated();
      
      set({ 
        user, 
        isAuthenticated, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authService.login(username, password);
      
      set({ 
        user: result.user,
        session: result.session,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return result;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await authService.register(userData);
      
      set({ 
        isLoading: false,
        error: null
      });
      
      return user;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authService.logout();
      
      set({ 
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  },

  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedUser = await authService.updateProfile(updates);
      
      set({ 
        user: updatedUser,
        isLoading: false,
        error: null
      });
      
      return updatedUser;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null });
    
    try {
      await authService.changePassword(currentPassword, newPassword);
      
      set({ 
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  refreshSession: async () => {
    try {
      const session = await authService.refreshSession();
      
      set({ 
        session,
        error: null
      });
      
      return session;
    } catch (error) {
      set({ 
        error: error.message,
        user: null,
        session: null,
        isAuthenticated: false
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters
  getUser: () => get().user,
  getSession: () => get().session,
  isUserAuthenticated: () => get().isAuthenticated,
  isLoadingAuth: () => get().isLoading,
  getAuthError: () => get().error,

  // Utility methods
  hasPermission: (permission) => {
    const { user } = get();
    if (!user || !user.permissions) return false;
    
    return user.permissions.includes(permission) || user.permissions.includes('all:read') || user.permissions.includes('all:write');
  },

  isRole: (role) => {
    const { user } = get();
    return user?.role === role;
  },

  getPreferences: () => {
    const { user } = get();
    return user?.preferences || {};
  },

  getTheme: () => {
    const { user } = get();
    return user?.preferences?.theme || 'dark';
  },

  getCurrency: () => {
    const { user } = get();
    return user?.preferences?.currency || 'IDR';
  },

  getLocale: () => {
    const { user } = get();
    return user?.preferences?.locale || 'id-ID';
  }
}));

