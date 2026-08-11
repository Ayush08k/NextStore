import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('Home');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCoaches, setIsLoadingCoaches] = useState(true);
  const [apiError, setApiError] = useState(false);

  // Fetch initial products
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setApiError(false);
      } else {
        setApiError(true);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setApiError(true);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch initial coaches
  const fetchCoaches = async () => {
    setIsLoadingCoaches(true);
    try {
      const res = await fetch('/api/coaches');
      if (res.ok) {
        const data = await res.json();
        setCoaches(data);
        setApiError(false);
      } else {
        setApiError(true);
      }
    } catch (err) {
      console.error('Failed to fetch coaches:', err);
      setApiError(true);
    } finally {
      setIsLoadingCoaches(false);
    }
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
