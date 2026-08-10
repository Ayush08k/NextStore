import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Shirt, ShoppingCart, Check } from 'lucide-react';

export const DressPage = () => {
  const { addToCart } = useContext(ShopContext);
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedSize, setSelectedSize] = useState('Medium');

  const uniforms = [
    {
      id: 'un-1',
      name: 'Official School Blazer & Tie',
      gender: 'Boys',
      price: 55.00,
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80',
      description: 'Navy blue wool-blend tailored school blazer with official crest.'
    },
    {
      id: 'un-2',
      name: 'Pleated School Skirt & Shirt Set',
      gender: 'Girls',
      price: 48.00,
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80',
      description: 'Comfortable pleated tartan skirt and crisp white cotton shirt.'
    },
    {
      id: 'un-3',
      name: 'PE & Sports Tracksuit Uniform',
      gender: 'Unisex',
      price: 38.00,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
      description: 'Breathable polyester tracksuit jacket and pants for physical education.'
    },
    {
      id: 'un-4',
      name: 'Summer Cotton Polo Shirt (Pack of 2)',
      gender: 'Unisex',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80',
      description: '100% breathable combed cotton pique polo shirts for daily wear.'
    }
  ];

  const filteredUniforms = uniforms.filter((u) => selectedGender === 'All' || u.gender === selectedGender || u.gender === 'Unisex');

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">School Uniforms & Dress Catalog</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Browse official school dresses, blazers, skirts, polos, and PE tracksuits.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="form-card" style={{ marginBottom: '30px' }}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Filter by Category / Gender</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['All', 'Boys', 'Girls', 'Unisex'].map((g) => (
                <button
                  key={g}
                  className={selectedGender === g ? 'btn-primary-green' : 'btn-outline-grey'}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => setSelectedGender(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Uniform Size</label>
            <select
              className="form-control"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="Small">Small (Age 5-7)</option>
              <option value="Medium">Medium (Age 8-11)</option>
              <option value="Large">Large (Age 12-15)</option>
              <option value="XL">XL (Age 16+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Uniforms Grid */}
      <div className="grid-2">
        {filteredUniforms.map((uniform) => (
          <div
            key={uniform.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              gap: '20px',
              alignItems: 'center'
            }}
          >
            <img
              src={uniform.image}
              alt={uniform.name}
              style={{ width: '130px', height: '130px', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '11px', background: '#f0f4ea', color: '#6c804b', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                {uniform.gender}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '8px' }}>{uniform.name}</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 10px 0' }}>{uniform.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 800 }}>${uniform.price.toFixed(2)}</span>
                <button
                  className="btn-primary-green"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  onClick={() =>
                    addToCart({
                      id: uniform.id,
                      name: `${uniform.name} (Size: ${selectedSize})`,
                      category: 'Dress',
                      price: uniform.price,
                      image: uniform.image
                    })
                  }
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
