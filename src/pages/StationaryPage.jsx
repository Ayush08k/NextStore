import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, Sparkles, Search, Filter, ShoppingCart, Check, Tag } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { AddToCartBtn } from '../components/AddToCartBtn';

export const StationaryPage = () => {
  const { products, addToCart, isLoadingProducts } = useContext(ShopContext);

  // Selected Bag for Customization
  const [selectedBag, setSelectedBag] = useState(null);
  const [studentName, setStudentName] = useState('ALEX SMITH');
  const [bagColor, setBagColor] = useState('Olive Green');
  const [isCustomized, setIsCustomized] = useState(true); // Default to custom (+10% fee)
  const [isBagAdded, setIsBagAdded] = useState(false);

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categoriesList = [
    'All',
    'Writing & Marking Supplies',
    'Paper Products & Notebooks',
    'Filing & Organization',
    'Desk Accessories & Fasteners'
  ];

  // Filter central products for Stationary category
  const allStationeryItems = (products || []).filter(
    (p) => p && (p.category === 'Stationary' || p.category === 'Custom Bags')
  );

  const handleSelectBagForCustomization = (bag, shouldCustomize = true) => {
    setSelectedBag(bag);
    setIsCustomized(shouldCustomize);
    // Smooth scroll down to custom studio at the end of the page
    setTimeout(() => {
      document.getElementById('custom-bag-studio')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Base and Final Price Calculation (+10% fee if customized)
  const basePrice = selectedBag ? parseFloat(selectedBag.price) : 0;
  const customFee = isCustomized ? basePrice * 0.10 : 0;
  const finalBagPrice = basePrice + customFee;

  const handleAddStudioBagToCart = () => {
    if (!selectedBag) return;

    const bagNameFormatted = isCustomized
      ? `${selectedBag.name} (Custom Printed: "${studentName}", Color: ${bagColor})`
      : `${selectedBag.name} (Standard Picture Edition, Color: ${bagColor})`;

    addToCart({
      id: `bag-${selectedBag.id}-${isCustomized ? 'custom' : 'std'}-${Date.now()}`,
      name: bagNameFormatted,
      category: 'Custom Bags',
      price: finalBagPrice,
      image: selectedBag.image
    });

    setIsBagAdded(true);
    setTimeout(() => setIsBagAdded(false), 2000);
  };

  const handleAddToCart = (item, qty = 1) => {
    addToCart(item, qty);
  };

  // Filter products by selected sub-category pill and search input
  const filteredProducts = allStationeryItems.filter((item) => {
    if (!item) return false;
    const matchesCategory =
      selectedCategory === 'All' ||
      item.sub_category === selectedCategory ||
      (selectedCategory === 'Writing & Marking Supplies' && item.sub_category?.includes('Writing')) ||
      (selectedCategory === 'Paper Products & Notebooks' && item.sub_category?.includes('Paper')) ||
      (selectedCategory === 'Filing & Organization' && item.sub_category?.includes('Filing')) ||
      (selectedCategory === 'Desk Accessories & Fasteners' && item.sub_category?.includes('Desk'));

    const q = (searchTerm || '').toLowerCase();
    const matchesSearch =
      !q ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.sub_category && item.sub_category.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Stationery &amp; Office Supplies Store</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Shop writing instruments, paper products, notebooks, filing folders, desk accessories, and school bags.
          </p>
        </div>
      </div>

      {/* SEARCH BAR & CATEGORY FILTERS */}
      <div className="form-card" style={{ marginBottom: '30px', background: '#ffffff', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '42px', fontSize: '14px', borderRadius: '24px' }}
              placeholder="Search stationery (e.g. Gel Pen, Notebook, Bag, Stapler, File Binder...)"
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
      {isLoadingProducts ? (
        <SkeletonLoader type="product" count={8} />
      ) : filteredProducts.length === 0 ? (
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
        <div className="store-products-grid stationary-grid">
          {filteredProducts.map((item) => {
            const isBagItem = item.category === 'Custom Bags' || item.name.toLowerCase().includes('bag') || item.name.toLowerCase().includes('backpack');

            return (
              <div key={item.id} className="product-card">
                <div className="product-img-wrap" style={{ height: '135px' }}>
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

                  {isBagItem ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {/* Button 1: Order Default Bag at Base Price */}
                      <AddToCartBtn
                        product={item}
                        onAddToCart={(p, q) => handleAddToCart(p, q)}
                        className="btn-primary-green"
                        label="Order Default Bag"
                        style={{ fontSize: '12px', padding: '8px' }}
                      />
                      {/* Button 2: Customize Name (+10% Fee) */}
                      <button
                        className="btn-outline-grey"
                        style={{ width: '100%', borderRadius: '10px', fontSize: '11.5px', padding: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        onClick={() => handleSelectBagForCustomization(item, true)}
                      >
                        <Sparkles size={13} color="#6c804b" /> Customize Name (+10%)
                      </button>
                    </div>
                  ) : (
                    <AddToCartBtn
                      product={item}
                      onAddToCart={(p, q) => handleAddToCart(p, q)}
                      className="btn-primary-green"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CUSTOMIZED BAG PRINTING STUDIO AT THE END OF THE PAGE */}
      <div
        id="custom-bag-studio"
        className="form-card"
        style={{
          marginTop: '40px',
          background: selectedBag ? '#f4f7ee' : '#fafaf8',
          border: selectedBag ? '2px solid #6c804b' : '1.5px dashed #d1d5db',
          borderRadius: '20px',
          padding: '32px',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Sparkles color="#6c804b" size={26} />
          <h2 style={{ fontSize: '22px', color: '#1f2937' }}>
            Bag Ordering &amp; Customization Studio
          </h2>
        </div>

        {!selectedBag ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: '#6b7280' }}>
            <ShoppingBag size={48} color="#9ca3af" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              No Bag Selected Yet
            </h3>
            <p style={{ fontSize: '13.5px' }}>
              Select any school bag from the catalog above and choose <strong>"Order Default Bag"</strong> (Base Price) or <strong>"Customize Name (+10%)"</strong> to configure your order.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ background: '#ffffff', padding: '14px 20px', borderRadius: '14px', marginBottom: '24px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6c804b', fontWeight: 800, textTransform: 'uppercase' }}>Selected Model</span>
                <h4 style={{ fontSize: '16.5px', fontWeight: 800, color: '#111827' }}>{selectedBag.name}</h4>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>Total Calculated Price</div>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#22252a' }}>
                  ₹{finalBagPrice.toFixed(2)}
                </span>
                {isCustomized && (
                  <span style={{ display: 'block', fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
                    Includes +10% Custom Printing Charge (+₹{customFee.toFixed(2)})
                  </span>
                )}
              </div>
            </div>

            <div className="grid-2" style={{ alignItems: 'flex-start', gap: '30px' }}>
              <div>
                {/* Customization Selection Option */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>
                    1. Choose Bag Order Edition *
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Option A: Standard Default Bag */}
                    <div
                      onClick={() => setIsCustomized(false)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: !isCustomized ? '2px solid #6c804b' : '1px solid #d1d5db',
                        background: !isCustomized ? '#ffffff' : '#f9fafb',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Tag size={18} color={!isCustomized ? '#6c804b' : '#9ca3af'} />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1f2937' }}>
                            Default Picture Bag (Standard Edition)
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#6b7280' }}>
                            Order exact bag shown in picture at standard base price
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#22252a' }}>
                        ₹{basePrice.toFixed(2)}
                      </span>
                    </div>

                    {/* Option B: Customized Name Printing (+10%) */}
                    <div
                      onClick={() => setIsCustomized(true)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: isCustomized ? '2px solid #6c804b' : '1px solid #d1d5db',
                        background: isCustomized ? '#ffffff' : '#f9fafb',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles size={18} color={isCustomized ? '#6c804b' : '#9ca3af'} />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1f2937' }}>
                            Customized Name Printing Edition (+10% Fee)
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#6b7280' }}>
                            Prints student name on backpack (+10% charge)
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#15803d' }}>
                        ₹{(basePrice * 1.10).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Name Input (Enabled if customized) */}
                {isCustomized && (
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      2. Enter Student Name to Print *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                      placeholder="Enter Student Full Name (e.g. ALEX SMITH)..."
                      maxLength={24}
                      style={{ fontSize: '14px', borderRadius: '10px', padding: '12px 14px' }}
                    />
                  </div>
                )}

                {/* Color Selection */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    {isCustomized ? '3. Select Color Variant *' : '2. Select Color Variant *'}
                  </label>
                  <select
                    className="form-control"
                    value={bagColor}
                    onChange={(e) => setBagColor(e.target.value)}
                    style={{ fontSize: '14px', borderRadius: '10px', padding: '12px 14px' }}
                  >
                    <option value="Olive Green">Olive Green (Signature Edition)</option>
                    <option value="Navy Blue">Navy Blue</option>
                    <option value="Graphite Black">Graphite Black</option>
                    <option value="Crimson Red">Crimson Red</option>
                    <option value="Royal Purple">Royal Purple</option>
                  </select>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <button
                    className={`btn-primary-green ${isBagAdded ? 'btn-added-state' : ''}`}
                    onClick={handleAddStudioBagToCart}
                    disabled={isBagAdded}
                    style={{
                      width: '100%',
                      padding: '13px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      backgroundColor: isBagAdded ? '#15803d' : undefined
                    }}
                  >
                    {isBagAdded ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={18} className="btn-check-anim" /> Added Bag to Cart!
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShoppingCart size={18} /> Add {isCustomized ? 'Customized' : 'Default'} Bag to Cart (₹{finalBagPrice.toFixed(2)})
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <div className="bag-studio-preview" style={{ background: bagColor === 'Navy Blue' ? '#1e3a8a' : bagColor === 'Graphite Black' ? '#111827' : bagColor === 'Crimson Red' ? '#991b1b' : bagColor === 'Royal Purple' ? '#581c87' : '#f0f4ea', transition: 'background 0.3s ease' }}>
                  <ShoppingBag size={72} color={['Navy Blue', 'Graphite Black', 'Crimson Red', 'Royal Purple'].includes(bagColor) ? '#ffffff' : '#6c804b'} />
                  {isCustomized && (
                    <div className="printed-text-overlay" style={{ color: ['Navy Blue', 'Graphite Black', 'Crimson Red', 'Royal Purple'].includes(bagColor) ? '#fbbf24' : '#22252a' }}>
                      NAME: {studentName || 'YOUR NAME'}
                    </div>
                  )}
                  <span style={{ position: 'absolute', bottom: '12px', fontSize: '12px', color: ['Navy Blue', 'Graphite Black', 'Crimson Red', 'Royal Purple'].includes(bagColor) ? '#ffffff' : '#6c804b', fontWeight: 600 }}>
                    {isCustomized ? `✨ Live Custom Print Preview (${bagColor})` : `🎒 Standard Picture Bag (${bagColor})`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
