import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, Send } from 'lucide-react';

export const Footer = () => {
  const { setActiveSection } = useContext(ShopContext);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">
                <ShoppingBag size={20} />
              </div>
              <span>NextStore</span>
            </div>
            <p>
              Your one-stop shop for quality educational supplies, uniforms, custom bags, sports equipment, and coaching bookings.
            </p>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('Home'); }}>Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('Books'); }}>School Books</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('Dress'); }}>Uniforms & Dress</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('Personal coatches'); }}>Personal Coaches</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('Sports'); }}>Sports Gear</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Customer Service</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('Contact'); }}>Contact Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('Contact'); }}>Track Order</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('Contact'); }}>Returns & Refunds</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('Contact'); }}>Shipping Policy</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Subscribe to Newsletter</h4>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
              Get the latest updates on new school books, sports coaches, and upcoming sales.
            </p>
            <div className="newsletter-box">
              <input type="email" placeholder="Your email address..." />
              <button className="btn-primary-green" style={{ padding: '10px 16px' }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 ShopMate NextStore. All rights reserved. Built per IEEE 830 SRS Specification.</p>
        </div>
      </div>
    </footer>
  );
};
