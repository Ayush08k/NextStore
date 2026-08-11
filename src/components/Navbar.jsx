import React, { useContext, useState, useEffect, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, Search, ShoppingCart, Heart, Clock, X, ArrowRight, TrendingUp } from 'lucide-react';

export const Navbar = () => {
  const {
    activeSection,
    setActiveSection,
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    searchHistory,
    addSearchHistory,
    removeSearchHistoryItem,
    clearSearchHistory,
    products,
    wishlist
  } = useContext(ShopContext);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Debounce State for 1.5 seconds typing pause
  const [inputValue, setInputValue] = useState(searchQuery || '');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isTypingDebouncing, setIsTypingDebouncing] = useState(false);
  const searchContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setInputValue(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Click outside listener for search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1.5 SECONDS DEBOUNCE EFFECT: Wait 1500ms after user stops typing before showing suggestions
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setIsTypingDebouncing(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(val);
      setIsTypingDebouncing(false);
    }, 1500); // 1.5 Seconds delay after user stops typing
  };

  // Filter live suggestions based on debounced query ONLY
  const query = (debouncedQuery || '').trim().toLowerCase();

  const liveSuggestions = query
    ? (products || []).filter((item) => {
        if (!item || !item.name) return false;
        return (
          item.name.toLowerCase().includes(query) ||
          (item.category && item.category.toLowerCase().includes(query)) ||
          (item.sub_category && item.sub_category.toLowerCase().includes(query))
        );
      }).slice(0, 5)
    : [];

  const handleExecuteSearch = (searchTerm) => {
    const termToSearch = searchTerm !== undefined ? searchTerm : inputValue;
    if (!termToSearch || !termToSearch.trim()) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    addSearchHistory(termToSearch);
    setSearchQuery(termToSearch);
    setDebouncedQuery(termToSearch);
    setIsSearchFocused(false);
    setIsTypingDebouncing(false);
    setActiveSection('SearchResults');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleExecuteSearch();
    }
  };

  const navLinks = [
    { name: 'Home', id: 'Home' },
    { name: 'Books', id: 'Books' },
    { name: 'Dress', id: 'Dress' },
    { name: 'Personal Coaches', id: 'Personal Coaches' },
    { name: 'Sports', id: 'Sports' },
    { name: 'Stationary', id: 'Stationary' },
    { name: 'Orders', id: 'Orders' },
    { name: 'Contact', id: 'Contact' },
  ];

  return (
    <header className={`navbar redesigned-navbar ${!isVisible ? 'nav-hidden' : ''}`}>
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <div className="logo brand-logo" onClick={() => setActiveSection('Home')}>
          <div className="logo-icon-gradient">
            <ShoppingBag size={20} color="#ffffff" />
          </div>
          <span className="brand-text">
            Next<span className="brand-highlight">Store</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="main-nav">
          <ul className="nav-pills">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li
                  key={link.id}
                  className={`nav-pill-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveSection(link.id)}
                >
                  {link.name}
                  {isActive && <span className="active-pill-dot" />}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Search & Action Controls */}
        <div className="nav-actions">
          {/* SEARCH BOX WITH DROPDOWN SUGGESTIONS & HISTORY */}
          <div
            ref={searchContainerRef}
            className="search-box-redesigned"
            style={{ position: 'relative', width: isSearchFocused ? '240px' : '190px' }}
          >
            <Search size={16} className="search-icon-svg" style={{ cursor: 'pointer' }} onClick={() => handleExecuteSearch()} />
            <input
              type="text"
              placeholder="Search books, uniforms, gear..."
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleKeyDown}
            />

            {/* SEARCH SUGGESTIONS & HISTORY OVERLAY DROPDOWN */}
            {isSearchFocused && (
              <div
                className="search-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '-10px',
                  right: '-10px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #e5e7eb',
                  padding: '14px 16px',
                  zIndex: 200,
                  maxHeight: '380px',
                  overflowY: 'auto'
                }}
              >
                {/* 1. TYPING WAITING INDICATOR (1.5s Pause) */}
                {isTypingDebouncing && (
                  <div style={{ fontSize: '12px', color: '#6c804b', fontWeight: 600, padding: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="typing-dot-anim">●</span> Waiting for 1.5s pause to fetch suggestions...
                  </div>
                )}

                {/* 2. LIVE MATCHING SUGGESTIONS (Appears after 1.5s pause) */}
                {!isTypingDebouncing && query.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#6c804b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingUp size={12} /> Live Suggestions
                    </div>
                    {liveSuggestions.length === 0 ? (
                      <div style={{ fontSize: '12.5px', color: '#9ca3af', padding: '6px 0' }}>
                        No direct matches found for "{debouncedQuery}"
                      </div>
                    ) : (
                      liveSuggestions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleExecuteSearch(item.name)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease',
                          }}
                          className="search-suggest-item"
                        >
                          <Search size={13} color="#6b7280" />
                          <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px', color: '#1f2937' }}>
                            {item.name}
                          </div>
                          <span style={{ fontSize: '10px', background: '#f0f4ea', color: '#586a3b', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>
                            {item.category || 'Store'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 3. RECENT SEARCH HISTORY */}
                {!isTypingDebouncing && searchHistory.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> Recent Searches
                      </span>
                      <button
                        onClick={clearSearchHistory}
                        style={{ fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Clear All
                      </button>
                    </div>

                    {searchHistory.map((historyItem, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 8px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          color: '#374151'
                        }}
                        className="search-suggest-item"
                      >
                        <div
                          style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}
                          onClick={() => handleExecuteSearch(historyItem)}
                        >
                          <Clock size={12} color="#9ca3af" />
                          <span>{historyItem}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSearchHistoryItem(historyItem);
                          }}
                          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '2px' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!isTypingDebouncing && query.length === 0 && searchHistory.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '12.5px', color: '#9ca3af' }}>
                    Type a book title, uniform, or sports product...
                  </div>
                )}
              </div>
            )}
          </div>

          {wishlist.length > 0 && (
            <button className="icon-btn wishlist-icon-btn" onClick={() => setActiveSection('Books')} title="Wishlist">
              <Heart size={18} fill="#ef4444" color="#ef4444" />
              <span className="cart-badge">{wishlist.length}</span>
            </button>
          )}

          <button className="cart-action-btn" onClick={() => setIsCartOpen(true)} title="View Shopping Cart">
            <ShoppingCart size={18} />
            <span className="cart-btn-text">Cart</span>
            {cartCount > 0 && <span className="cart-pill-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};
