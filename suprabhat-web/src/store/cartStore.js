import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // Array to hold { product, quantity }

      // --- ACTIONS ---

      /**
       * Adds a product to the cart or increments its quantity if it already exists.
       */
      addToCart: (product) => {
        const cart = get().items;
        const findProduct = cart.find((item) => item.product._id === product._id);

        if (findProduct) {
          // If product exists, just increment quantity
          findProduct.quantity += 1;
        } else {
          // If product doesn't exist, add it with quantity 1
          cart.push({ product: product, quantity: 1 });
        }

        set({ items: [...cart] });
      },

      /**
       * Removes a product completely from the cart.
       */
      removeFromCart: (productId) => {
        set({
          items: get().items.filter((item) => item.product._id !== productId),
        });
      },

      /**
       * Increments the quantity of a product in the cart.
       */
      incrementQuantity: (productId) => {
        const cart = get().items;
        const findProduct = cart.find((item) => item.product._id === productId);
        if (findProduct) {
          findProduct.quantity += 1;
        }
        set({ items: [...cart] });
      },

      /**
       * Decrements the quantity of a product. Removes it if quantity becomes 0.
       */
      decrementQuantity: (productId) => {
        const cart = get().items;
        const findProduct = cart.find((item) => item.product._id === productId);
        if (findProduct && findProduct.quantity > 1) {
          findProduct.quantity -= 1;
          set({ items: [...cart] });
        } else {
          // If quantity is 1, remove the item completely
          get().removeFromCart(productId);
        }
      },

      /**
       * Clears the entire cart.
       */
      clearCart: () => {
        set({ items: [] });
      },

      // --- SELECTORS / DERIVED STATE ---

      /**
       * Calculates the total number of items in the cart.
       */
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Calculates the total price of all items in the cart.
       */
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // Persist cart to localStorage
    }
  )
);