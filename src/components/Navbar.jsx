import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, Search, ShoppingCart, Heart } from 'lucide-react';

export const Navbar = () => {
  const { activeSection, setActiveSection, cartCount, setIsCartOpen, searchQuery, setSearchQuery, wishlist } = useContext(ShopContext);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false); // Scrolling down -> hide navbar
      } else {
        setIsVisible(true);  // Scrolling up -> show navbar
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Home', id: 'Home' },
    { name: 'Books', id: 'Books' },
    { name: 'Dress', id: 'Dress' },
    { name: 'Personal coatches', id: 'Personal coatches' },
    { name: 'Sports', id: 'Sports' },
    { name: 'Stationary', id: 'Stationary' },
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
          <div className="search-box-redesigned">
            <Search size={16} className="search-icon-svg" />
            <input
              type="text"
              placeholder="Search books, uniforms, gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
