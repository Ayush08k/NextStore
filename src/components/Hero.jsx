import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  const { setActiveSection } = useContext(ShopContext);

  return (
    <section className="hero-wrapper">
      <div className="container">
        <div className="hero-card">
          <div className="hero-content">
            <div className="hero-pill">
              <span className="dot-green"></span>
              NEW ARRIVALS
            </div>
            <h1 className="hero-title">
              Discover The Best <br />Products for You
            </h1>
            <p className="hero-subtitle">
              Explore our wide range of high-quality products at affordable prices. Shop now and enjoy the best deals!
            </p>

            <div className="hero-buttons">
              <button className="btn-primary-green" onClick={() => setActiveSection('Books')}>
                Shop now <ArrowRight size={16} />
              </button>
              <button className="btn-outline-grey" onClick={() => setActiveSection('Stationary')}>
                Explore Deals
              </button>
            </div>

            <div className="hero-customers">
              <div className="avatar-group">
                <img className="avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Customer 1" />
                <img className="avatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Customer 2" />
                <img className="avatar" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" alt="Customer 3" />
              </div>
              <span className="customer-text">Trusted by 10,000+ Happy Customers</span>
            </div>
          </div>

          {/* Image as grid sibling — right column on desktop, reordered via CSS on mobile */}
          <div className="hero-image-container">
            <img
              src="/images/hero_showcase.png"
              alt="Discover The Best Products for You"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
