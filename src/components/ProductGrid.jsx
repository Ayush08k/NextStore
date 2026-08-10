import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Star, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductGrid = ({ title = "Best Selling Products", filterCategory }) => {
  const { products, addToCart, setActiveSection, searchQuery } = useContext(ShopContext);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animDir, setAnimDir] = useState(null); // 'left' | 'right' | null
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);
  const MOBILE_VISIBLE = 2; // cards visible at a time on mobile

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  let filtered = products;
  if (filterCategory) filtered = filtered.filter((p) => p.category === filterCategory);
  if (searchQuery) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const totalCards = filtered.length;
  const maxIndex = Math.max(0, totalCards - MOBILE_VISIBLE);

  // Desktop scroll handlers
  const handleScrollLeft = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: -260, behavior: 'smooth' });
  };
  const handleScrollRight = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: 260, behavior: 'smooth' });
  };

  // Mobile animated carousel handlers
  const navigate = useCallback((dir) => {
    if (isAnimating) return;
    if (dir === 'right' && currentIndex >= maxIndex) return;
    if (dir === 'left' && currentIndex <= 0) return;

    setIsAnimating(true);
    setAnimDir(dir);

    setTimeout(() => {
      setCurrentIndex((prev) => (dir === 'right' ? prev + 1 : prev - 1));
      setAnimDir(null);
      setTimeout(() => setIsAnimating(false), 50);
    }, 320);
  }, [isAnimating, currentIndex, maxIndex]);

  // Dot indicator page index (which pair we're on)
  const totalDots = Math.ceil(totalCards / MOBILE_VISIBLE);
  const activeDot = Math.floor(currentIndex / 1); // one step per card

  const visibleCards = isMobile ? filtered.slice(currentIndex, currentIndex + MOBILE_VISIBLE) : filtered;

  return (
    <section className="container product-grid-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="view-all-link" onClick={() => setActiveSection('Books')}>
          View All <ArrowRight size={16} />
        </div>
      </div>

      {isMobile ? (
        /* ─── MOBILE ANIMATED CAROUSEL ─── */
        <div className="mobile-carousel-root">
          {/* Cards stage */}
          <div className={`mobile-carousel-stage${animDir ? ` anim-${animDir}` : ''}`}>
            {visibleCards.map((product) => (
              <MobileCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>

          {/* Navigation row */}
          <div className="mobile-carousel-nav">
            <button
              className="mobile-nav-btn"
              onClick={() => navigate('left')}
              disabled={currentIndex === 0 || isAnimating}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dot indicators */}
            <div className="mobile-carousel-dots">
              {filtered.map((_, i) => (
                i <= maxIndex && (
                  <button
                    key={i}
                    className={`carousel-dot${currentIndex === i ? ' active' : ''}`}
                    onClick={() => {
                      if (!isAnimating) setCurrentIndex(i);
                    }}
                    aria-label={`Go to card ${i + 1}`}
                  />
                )
              ))}
            </div>

            <button
              className="mobile-nav-btn"
              onClick={() => navigate('right')}
              disabled={currentIndex >= maxIndex || isAnimating}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        /* ─── DESKTOP HORIZONTAL SCROLL ─── */
        <div className="slider-outer-wrap">
          <button className="side-slide-btn left" onClick={handleScrollLeft} aria-label="Slide Left">
            <ChevronLeft size={20} />
          </button>

          <div className="products-slider-wrap" ref={sliderRef}>
            {filtered.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-img-wrap">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info-body">
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '6px 0 8px 0', fontSize: '13px', color: '#6b7280' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontWeight: 700, color: '#1f2937' }}>{product.rating || 4.8}</span>
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>({product.reviews_count || 45} reviews)</span>
                  </div>
                  <div className="product-price-row" style={{ marginBottom: '14px' }}>
                    <span className="current-price">₹{parseFloat(product.price).toFixed(2)}</span>
                    {product.original_price && (
                      <span className="original-price">₹{parseFloat(product.original_price).toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            ))}
          </div>

          <button className="side-slide-btn right" onClick={handleScrollRight} aria-label="Slide Right">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
};

/* Separate mobile card component to keep JSX clean */
function MobileCard({ product, addToCart }) {
  return (
    <div className="mobile-product-card">
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info-body">
        <h3 className="product-title" style={{ fontSize: '13.5px' }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '5px 0 6px', fontSize: '12px', color: '#6b7280' }}>
          <Star size={12} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontWeight: 700, color: '#1f2937' }}>{product.rating || 4.8}</span>
          <span style={{ color: '#9ca3af' }}>({product.reviews_count || 45})</span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <span className="current-price" style={{ fontSize: '15px' }}>₹{parseFloat(product.price).toFixed(2)}</span>
          {product.original_price && (
            <span className="original-price" style={{ fontSize: '12px' }}>₹{parseFloat(product.original_price).toFixed(2)}</span>
          )}
        </div>
      </div>
      <button
        className="add-to-cart-btn"
        style={{ fontSize: '12px', padding: '9px 10px' }}
        onClick={() => addToCart(product)}
      >
        <ShoppingCart size={13} /> Add
      </button>
    </div>
  );
}
