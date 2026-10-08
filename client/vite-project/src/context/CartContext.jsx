import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../axiosCalls/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { customer } = useAuth();

  // refresh cart from backend
  const refreshCart = useCallback(async () => {
    if (!customer) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/cart");
      if (res.data?.success) {
        setCartItems(res.data.cart || []);
      }
      return { success: true, cart: res.data?.cart || [] };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to fetch cart";
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, [customer]);

  // Sync cart automatically when authenticated user changes
  useEffect(() => {
    if (customer) {
      refreshCart();
    } else {
      setCartItems([]);
      setError(null);
    }
  }, [customer, refreshCart]);

  // add to cart
  const addToCart = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      // Optimistically update existing item quantity if present
      setCartItems((prev) => {
        const exists = prev.some((item) => {
          const itemId = item.product?._id ? item.product._id.toString() : item.product?.toString();
          return itemId === productId.toString();
        });
        if (exists) {
          return prev.map((item) => {
            const itemId = item.product?._id ? item.product._id.toString() : item.product?.toString();
            return itemId === productId.toString() ? { ...item, quantity: (item.quantity || 1) + 1 } : item;
          });
        }
        return prev;
      });

      const res = await axiosInstance.post(`/cart/${productId}`);
      // Refresh populated cart to ensure complete product details
      await refreshCart();
      return { success: true, data: res.data };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to add to cart";
      setError(errMsg);
      await refreshCart();
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // remove from cart
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      // Optimistically update and refresh
      setCartItems((prev) =>
        prev.filter((item) => {
          const itemId = item.product?._id ? item.product._id.toString() : item.product?.toString();
          return itemId !== productId.toString();
        })
      );
      const res = await axiosInstance.delete(`/cart/${productId}`);
      await refreshCart();
      return { success: true, data: res.data };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to remove from cart";
      setError(errMsg);
      await refreshCart();
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      // Optimistically update local quantity for immediate real-time reactivity
      setCartItems((prev) =>
        prev.map((item) => {
          const itemId = item.product?._id ? item.product._id.toString() : item.product?.toString();
          if (itemId === productId.toString()) {
            return { ...item, quantity };
          }
          return item;
        })
      );

      const res = await axiosInstance.patch(`/cart/${productId}`, { quantity });
      await refreshCart();
      return { success: true, data: res.data };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update quantity";
      setError(errMsg);
      await refreshCart();
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Derived cart values (calculated dynamically from cart state, never stored in MongoDB)
  const totalUnits = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  const cartItemCount = cartItems.length;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.product?.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  // Convenient aliases
  const cartCount = totalUnits;
  const cartTotal = subtotal;

  // Clear cart in global state
  const clearCart = useCallback(() => {
    setCartItems([]);
    setError(null);
  }, []);

  const value = {
    cartItems,
    cart: cartItems,
    loading,
    cartLoading: loading,
    isLoading: loading,
    error,
    cartError: error,
    addToCart,
    removeFromCart,
    deleteFromCart: removeFromCart,
    updateQuantity,
    updateCartQuantity: updateQuantity,
    refreshCart,
    fetchCart: refreshCart,
    clearCart,
    // Derived values
    subtotal,
    totalUnits,
    cartItemCount,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
