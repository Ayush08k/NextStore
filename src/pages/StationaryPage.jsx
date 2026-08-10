import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ProductGrid } from '../components/ProductGrid';
import { ShoppingBag, Sparkles, ShoppingCart } from 'lucide-react';

export const StationaryPage = () => {
  const { addToCart } = useContext(ShopContext);
  const [studentName, setStudentName] = useState('ALEX SMITH');
  const [bagColor, setBagColor] = useState('Olive Green');
  const [bagPrice] = useState(39.99);

  const handleAddCustomBag = () => {
    addToCart({
      id: `custom-bag-${Date.now()}`,
      name: `Customized School Backpack (Printed: "${studentName}")`,
      category: 'Custom Bags',
      price: bagPrice,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'
    });
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Stationery & Customized Bags Studio</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Personalize school bags with student names, and shop premium stationery supplies.
          </p>
        </div>
      </div>

      {/* Customized Bag Studio Section */}
      <div className="form-card" style={{ marginBottom: '50px', background: '#fbfbf8', border: '1px solid #e2e5da' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Sparkles color="#6c804b" size={24} />
          <h2 style={{ fontSize: '22px' }}>Customized Bag Printing Studio</h2>
        </div>

        <div className="grid-2" style={{ alignItems: 'center' }}>
          {/* Controls */}
          <div>
            <div className="form-group">
              <label className="form-label">Student Name for Bag Print</label>
              <input
                type="text"
                className="form-control"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                placeholder="Enter Student Full Name..."
                maxLength={24}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Backpack Color</label>
              <select
                className="form-control"
                value={bagColor}
                onChange={(e) => setBagColor(e.target.value)}
              >
                <option value="Olive Green">Olive Green (Signature Edition)</option>
                <option value="Navy Blue">Navy Blue</option>
                <option value="Graphite Black">Graphite Black</option>
              </select>
            </div>

            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '14px' }}>
                Price: ${bagPrice.toFixed(2)}
              </div>
              <button className="btn-primary-green" onClick={handleAddCustomBag}>
                <ShoppingCart size={18} /> Order Customized Bag
              </button>
            </div>
          </div>

          {/* Live Preview Container */}
          <div>
            <div className="bag-studio-preview">
              <ShoppingBag size={72} color="#6c804b" />
              <div className="printed-text-overlay">
                NAME: {studentName || 'YOUR NAME'}
              </div>
              <span style={{ position: 'absolute', bottom: '12px', fontSize: '12px', color: '#6c804b', fontWeight: 600 }}>
                ✨ Live Bag Printing Preview ({bagColor})
              </span>
            </div>
          </div>
        </div>
      </div>

      <ProductGrid title="Stationery Catalog" filterCategory="Stationary" />
    </div>
  );
};
