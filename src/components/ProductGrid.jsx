import React, { useContext, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, Star, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductGrid = ({ title = "Best Selling Products", filterCategory }) => {
  const { products, addToCart, wishlist, toggleWishlist, setActiveSection, searchQuery } = useContext(ShopContext);
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
      sliderRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 280, behavior: 'smooth' });
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
        <button className="side-slide-btn left" onClick={handleScrollLeft} title="Slide Left">
          <ChevronLeft size={22} />
        </button>

        {/* Product Cards Slider */}
        <div className="products-slider-wrap" ref={sliderRef}>
          {filtered.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div key={product.id} className="product-card">
                <button
                  className="wishlist-btn"
                  onClick={() => toggleWishlist(product.id)}
                  title="Save to Wishlist"
                >
                  <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : '#6b7280'} />
                </button>

                <div className="product-img-wrap">
                  <img src={product.image} alt={product.name} />
                </div>

                <div>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-rating">
                    <Star size={14} className="star-icon" />
                    <span>{product.rating || 4.8} ({product.reviews_count || 45})</span>
                  </div>

                  <div className="product-price-row">
                    <span className="current-price">${parseFloat(product.price).toFixed(2)}</span>
                    {product.original_price && (
                      <span className="original-price">${parseFloat(product.original_price).toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Side Slide Button */}
        <button className="side-slide-btn right" onClick={handleScrollRight} title="Slide Right">
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
};
