import React, { useContext, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ChevronLeft, ChevronRight, BookOpen, Shirt, PenTool, Trophy, Dumbbell, ShoppingBag, Palette, Calculator, FlaskConical, Cpu } from 'lucide-react';

export const Categories = () => {
  const { setActiveSection } = useContext(ShopContext);
  const sliderRef = useRef(null);

  const categories = [
    { name: 'School Books', section: 'Books', icon: <BookOpen size={34} color="#6c804b" /> },
    { name: 'Dress & Uniforms', section: 'Dress', icon: <Shirt size={34} color="#5a6d3c" /> },
    { name: 'Stationary & Supplies', section: 'Stationary', icon: <PenTool size={34} color="#748c54" /> },
    { name: 'Personal Coaches', section: 'Personal Coaches', icon: <Trophy size={34} color="#4a5d30" /> },
    { name: 'Sports & Athletic Gear', section: 'Sports', icon: <Dumbbell size={34} color="#6c804b" /> },
    { name: 'Customized Bags & Kits', section: 'Stationary', icon: <ShoppingBag size={34} color="#89a164" /> },
    { name: 'Art & Craft Kits', section: 'Stationary', icon: <Palette size={34} color="#6c804b" /> },
    { name: 'Calculators & Math Kits', section: 'Stationary', icon: <Calculator size={34} color="#5a6d3c" /> },
  ];

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="container" style={{ position: 'relative', marginBottom: '50px' }}>
      <div className="section-header">
        <h2 className="section-title">Shop by Categories</h2>
      </div>

      <div className="products-slider-wrap" style={{ position: 'relative', padding: '0 36px' }}>
        {/* Left Scroll Button */}
        <button
          className="side-slide-btn"
          style={{ left: 0, zIndex: 10 }}
          onClick={() => handleScroll('left')}
          title="Scroll Left"
          aria-label="Scroll Left"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Categories Horizontal Carousel Container */}
        <div
          ref={sliderRef}
          className="categories-slider-track"
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            padding: '12px 4px 20px 4px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="category-circle-card"
              style={{ flex: '0 0 auto', width: '130px' }}
              onClick={() => setActiveSection(cat.section)}
            >
              <div className="circle-img-wrap">
                {cat.icon}
              </div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          className="side-slide-btn"
          style={{ right: 0, zIndex: 10 }}
          onClick={() => handleScroll('right')}
          title="Scroll Right"
          aria-label="Scroll Right"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};
