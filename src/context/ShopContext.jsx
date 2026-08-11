import React, { createContext, useState, useEffect } from 'react';
import { initialProducts, initialCoaches, initialBooks, initialUniforms } from '../data/mockData';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('Home');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Search History state with local storage persistence
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('nextstore_search_history');
      return saved ? JSON.parse(saved) : ['CBSE Books', 'School Uniform', 'Basketball', 'Gel Pen'];
    } catch {
      return ['CBSE Books', 'School Uniform', 'Basketball', 'Gel Pen'];
    }
  });

  // Comprehensive Catalog combining all store items for universal search
  const [products] = useState(() => {
    const catalog = [...initialProducts];
    
    // Normalize and add books
    (initialBooks || []).forEach((b) => {
      catalog.push({
        id: `book-cat-${b.id}`,
        name: b.book_title || b.title,
        category: 'Books',
        sub_category: b.subject,
        school_name: b.school_name,
        board: b.board,
        price: b.price,
        price_range: b.price_range,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
        description: `Official ${b.board || 'CBSE'} prescribed book for ${b.subject}`
      });
    });

    // Normalize and add uniforms
    (initialUniforms || []).forEach((u) => {
      catalog.push({
        id: `uniform-cat-${u.id}`,
        name: u.name,
        category: 'Dress',
        sub_category: u.dress_type,
        price: u.price,
        price_range: u.price_range,
        rating: 4.8,
        image: u.image || 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80',
        description: u.description
      });
    });

    return catalog;
  });

  const [coaches] = useState(initialCoaches);
  const [isLoadingProducts] = useState(false);
  const [isLoadingCoaches] = useState(false);
  const [apiError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('nextstore_search_history', JSON.stringify(searchHistory));
    } catch (e) {
      console.error(e);
    }
  }, [searchHistory]);

  const addSearchHistory = (term) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase());
      return [cleanTerm, ...filtered].slice(0, 8); // Keep top 8 recent searches
    });
  };

  const removeSearchHistoryItem = (term) => {
    setSearchHistory((prev) => prev.filter((item) => item !== term));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const addToCart = (product, quantityToAdd = 1) => {
    const qty = typeof quantityToAdd === 'number' && quantityToAdd > 0 ? quantityToAdd : (product.quantity || 1);
    setCart((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id) && item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(product.id) && item.name === product.name
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (String(item.id) === String(id)) {
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
        searchHistory,
        addSearchHistory,
        removeSearchHistoryItem,
        clearSearchHistory,
        products,
        isLoadingProducts,
        coaches,
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
