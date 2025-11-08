import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useCartStore } from './cartStore'; // Import cartStore

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
        // --- IMPORTANT FIX: Clear the cart on logout ---
        useCartStore.getState().clearCart();
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // name of the item in storage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage
    }
  )
);