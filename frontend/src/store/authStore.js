import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });
          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Connexion échouée',
            loading: false,
          });
          return {
            success: false,
            error: error.response?.data?.message || 'Identifiants invalides',
          };
        }
      },

      register: async (name, email, password, isBusiness = false) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.register({
            name,
            email,
            password,
            isBusiness,
          });
          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Inscription échouée',
            loading: false,
          });
          return {
            success: false,
            error: error.response?.data?.message || "Erreur lors de l'inscription",
          };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const { token, user } = get();
        if (!token) return;

        try {
          // If using mock token, skip API call and verify locally
          if (token.startsWith('mock-')) {
            if (user) {
              set({ isAuthenticated: true });
              return;
            }
          }

          const response = await authAPI.getProfile();
          set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
          console.warn('Session check failed, logging out');
          get().logout();
        }
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
