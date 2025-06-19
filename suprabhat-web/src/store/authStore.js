import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// The persist middleware will automatically save the store's state
// to localStorage, so the user stays logged in after a refresh.

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      // Action to set token and user data upon login
      login: (userData) => {
        const { user, token } = userData;
        set({ token, user, isAuthenticated: true });
      },

      // Action to clear data upon logout
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // name of the item in storage
    }
  )
);