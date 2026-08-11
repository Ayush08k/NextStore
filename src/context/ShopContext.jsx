import React, { createContext, useState, useEffect } from 'react';
import { initialProducts, initialCoaches } from '../data/mockData';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('Home');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [coaches, setCoaches] = useState(initialCoaches);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCoaches, setIsLoadingCoaches] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Frontend-only state reset helpers
  const fetchProducts = () => {
    setIsLoadingProducts(false);
    setApiError(false);
  };

  const fetchCoaches = () => {
    setIsLoadingCoaches(false);
    setApiError(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchCoaches();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        activeSection,
        setActiveSection,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        searchQuery,
        setSearchQuery,
        products,
        setProducts,
        fetchProducts,
        isLoadingProducts,
        coaches,
        fetchCoaches,
        isLoadingCoaches,
        apiError,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
