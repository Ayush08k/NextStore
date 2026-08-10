import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, Sparkles, ShoppingCart, Search, Filter, CheckCircle } from 'lucide-react';

export const StationaryPage = () => {
  const { products, addToCart } = useContext(ShopContext);

  // Customized Bag Studio State
  const [studentName, setStudentName] = useState('ALEX SMITH');
  const [bagColor, setBagColor] = useState('Olive Green');
  const [bagPrice] = useState(1299.00);

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedMsg, setAddedMsg] = useState('');

  const categoriesList = [
    'All',
    'Writing & Marking Supplies',
    'Paper Products & Notebooks',
    'Filing & Organization',
    'Desk Accessories & Fasteners'
  ];

  // Filter central products for Stationary category
  const allStationeryItems = products.filter(
    (p) => p.category === 'Stationary' || p.category === 'Custom Bags'
  );

  const handleAddCustomBag = () => {
    addToCart({
      id: `custom-bag-${Date.now()}`,
      name: `Customized School Backpack (Printed: "${studentName}")`,
      category: 'Custom Bags',
      price: bagPrice,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'
    });
    setAddedMsg('Customized Bag added to your cart!');
    setTimeout(() => setAddedMsg(''), 4000);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedMsg(`"${item.name}" added to cart!`);
    setTimeout(() => setAddedMsg(''), 4000);
  };

  // Filter products by selected sub-category pill and search input
  const filteredProducts = allStationeryItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.sub_category === selectedCategory ||
      (selectedCategory === 'Writing & Marking Supplies' && item.sub_category?.includes('Writing')) ||
      (selectedCategory === 'Paper Products & Notebooks' && item.sub_category?.includes('Paper')) ||
      (selectedCategory === 'Filing & Organization' && item.sub_category?.includes('Filing')) ||
      (selectedCategory === 'Desk Accessories & Fasteners' && item.sub_category?.includes('Desk'));

    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sub_category && item.sub_category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Stationery & Office Supplies Store</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Shop writing instruments, paper products, notebooks, filing folders, desk accessories, and customized bags.
          </p>
        </div>
      </div>

      {/* Customized Bag Printing Studio Top Banner */}
      <div className="form-card" style={{ marginBottom: '40px', background: '#fbfbf8', border: '1px solid #e2e5da' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Sparkles color="#6c804b" size={24} />
          <h2 style={{ fontSize: '22px' }}>Customized Bag Printing Studio</h2>
        </div>

        <div className="grid-2" style={{ alignItems: 'center' }}>
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
                Price: ₹{bagPrice.toFixed(2)}
              </div>
              <button className="btn-primary-green" onClick={handleAddCustomBag}>
                <ShoppingCart size={18} /> Order Customized Bag
              </button>
            </div>
          </div>

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

      {/* Cart Feedback Notification */}
      {addedMsg && (
        <div style={{ background: '#eef2e6', color: '#586a3b', padding: '14px 20px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 600 }}>{addedMsg}</span>
        </div>
      )}

      {/* SEARCH BAR & CATEGORY FILTERS */}
      <div className="form-card" style={{ marginBottom: '30px', background: '#ffffff', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '42px', fontSize: '14px', borderRadius: '24px' }}
              placeholder="Search stationery (e.g. Gel Pen, Spiral Notebook, Glue Stick, Stapler, File Binder...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>
            Showing {filteredProducts.length} items
          </div>
        </div>

        {/* Category Pill Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'btn-primary-green' : 'btn-outline-grey'}
              style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '13px' }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* STATIONERY PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center', padding: '50px', color: '#6b7280' }}>
          <Filter size={48} color="#d1d5db" style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: '16px', fontWeight: 600 }}>No stationery items match your selected filter or search.</p>
          <button
            className="btn-outline-grey"
            style={{ marginTop: '16px', fontSize: '13px' }}
            onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="products-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {filteredProducts.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-img-wrap">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="product-info-body">
                <span style={{ fontSize: '11px', background: '#f0f4ea', color: '#4a5c32', padding: '3px 8px', borderRadius: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                  {item.sub_category || 'Stationery'}
                </span>

                <h3 className="product-title" style={{ marginTop: '8px', fontSize: '14.5px', height: '38px' }}>
                  {item.name}
                </h3>

                {item.price_range && (
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                    Range: {item.price_range}
                  </div>
                )}

                <div className="product-price-row" style={{ margin: '4px 0 14px 0' }}>
                  <span className="current-price" style={{ fontSize: '16.5px' }}>₹{parseFloat(item.price).toFixed(2)}</span>
                  {item.original_price && (
                    <span className="original-price">₹{parseFloat(item.original_price).toFixed(2)}</span>
                  )}
                </div>
              </div>

              <button className="add-to-cart-btn" onClick={() => handleAddToCart(item)}>
                <ShoppingCart size={16} /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
