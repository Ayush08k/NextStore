import React, { useContext, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Star, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductGrid = ({ title = "Best Selling Products", filterCategory }) => {
  const { products, addToCart, setActiveSection, searchQuery } = useContext(ShopContext);
  const sliderRef = useRef(null);

  let filtered = products;

  if (filterCategory) {
    filtered = filtered.filter((p) => p.category === filterCategory);
  }

  if (searchQuery) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="container">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="view-all-link" onClick={() => setActiveSection('Books')}>
          View All Products <ArrowRight size={16} />
        </div>
      </div>

      <div className="slider-outer-wrap">
        {/* Left Side Slide Button */}
        <button className="side-slide-btn left" onClick={handleScrollLeft} title="Slide Left" aria-label="Slide Left">
          <ChevronLeft size={20} />
        </button>

        {/* Product Cards Slider */}
        <div className="products-slider-wrap" ref={sliderRef}>
          {filtered.map((product) => (
            <div key={product.id} className="product-card">
              {/* Product Image Stage */}
              <div className="product-img-wrap">
                <img src={product.image} alt={product.name} />
              </div>

              {/* Product Info */}
              <div className="product-info-body">
                <h3 className="product-title">{product.name}</h3>

                {/* Rating BEFORE Cost */}
                <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '6px 0 8px 0', fontSize: '13px', color: '#6b7280' }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontWeight: 700, color: '#1f2937' }}>{product.rating || 4.8}</span>
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>({product.reviews_count || 45} reviews)</span>
                </div>

                {/* Cost / Price */}
                <div className="product-price-row" style={{ marginBottom: '14px' }}>
                  <span className="current-price">₹{parseFloat(product.price).toFixed(2)}</span>
                  {product.original_price && (
                    <span className="original-price">₹{parseFloat(product.original_price).toFixed(2)}</span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                <ShoppingCart size={16} /> Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* Right Side Slide Button */}
        <button className="side-slide-btn right" onClick={handleScrollRight} title="Slide Right" aria-label="Slide Right">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};
