import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { sportsProductsData } from '../data/sportsData';
import { Star, CheckCircle, Search, Trophy } from 'lucide-react';
import { AddToCartBtn } from '../components/AddToCartBtn';

export const SportsPage = () => {
  const { addToCart } = useContext(ShopContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedMsg, setAddedMsg] = useState('');

  const categories = [
    'All',
    'Cricket',
    'Football',
    'Badminton',
    'Basketball',
    'Volleyball',
    'Tennis',
    'Table Tennis',
    'Field Hockey',
    'Boxing / Combat',
    'Swimming',
    'Fitness / Gym',
    'Fitness / Yoga',
    'Fitness / Cardio',
    'Multi-Sport',
    'General Gear'
  ];

  const handleAddToCart = (product, qty = 1) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: 'Sports Equipment',
      price: product.price,
      image: product.image
    }, qty);
    setAddedMsg(`"${product.name}" (${qty}) added to your cart!`);
    setTimeout(() => setAddedMsg(''), 3500);
  };

  const filteredProducts = sportsProductsData.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.sub_category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sub_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header Banner */}
      <div className="section-header" style={{ marginBottom: '30px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={28} color="#6c804b" />
            <h1 className="section-title">Sports Equipment &amp; Gear Catalog</h1>
          </div>
          <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '14px' }}>
            Explore 30 official sports gear items across Cricket, Football, Badminton, Tennis, Swimming, Boxing &amp; Gym Fitness.
          </p>
        </div>
      </div>



      {/* Filter and Search Bar */}
      <div className="form-card" style={{ marginBottom: '30px', background: '#f8f8f4', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search equipment, rackets, balls, gloves..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px', borderRadius: '20px' }}
            />
          </div>

          {/* Sub-Category Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'btn-primary-green' : 'btn-outline-grey'}
                onClick={() => setSelectedCategory(cat)}
                style={{ borderRadius: '20px', padding: '6px 14px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Count Display */}
      <div style={{ marginBottom: '20px', color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>
        Showing <strong>{filteredProducts.length}</strong> of 30 sports items
      </div>

      {/* Dedicated Full Product Grid (No Arrows, No View All button) */}
      <div className="store-products-grid sports-grid">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div>
              {/* Product Image & Badge */}
              <div className="product-img-wrap" style={{ position: 'relative', width: '100%', height: '135px', margin: 0, borderRadius: 0 }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {product.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#6c804b',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '12px'
                    }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', background: '#f0f4ea', color: '#586a3b', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                    {product.sub_category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{product.rating}</span>
                    <span style={{ color: '#9ca3af', fontWeight: 400 }}>({product.reviews_count})</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#22252a', marginBottom: '6px', lineHeight: '1.3' }}>
                  {product.name}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#6b7280', marginBottom: '14px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description}
                </p>
              </div>
            </div>

            {/* Price & Add to Cart Footer */}
            <div style={{ padding: '0 18px 18px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#22252a' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                    Range: {product.price_range} ({product.usd_range})
                  </div>
                </div>
              </div>

              <AddToCartBtn
                product={product}
                onAddToCart={(p, q) => handleAddToCart(p, q)}
                className="btn-primary-green"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
