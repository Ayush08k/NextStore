import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Search } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { AddToCartBtn } from '../components/AddToCartBtn';

export const SearchResultsPage = () => {
  const { searchQuery, setSearchQuery, products, addToCart } = useContext(ShopContext);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isSearchLoading, setIsSearchLoading] = useState(true);

  // 2-Second Skull Loading animation whenever searchQuery changes
  useEffect(() => {
    setIsSearchLoading(true);
    const timer = setTimeout(() => {
      setIsSearchLoading(false);
    }, 2000); // 2 seconds loading before displaying results

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const query = (searchQuery || '').trim().toLowerCase();

  // Search through all items across products, books, uniforms, sports, etc.
  const matchedProducts = (products || []).filter((item) => {
    if (!item || !query) return false;
    const nameMatch = item.name && item.name.toLowerCase().includes(query);
    const catMatch = item.category && item.category.toLowerCase().includes(query);
    const subMatch = item.sub_category && item.sub_category.toLowerCase().includes(query);
    const descMatch = item.description && item.description.toLowerCase().includes(query);
    const schoolMatch = item.school_name && item.school_name.toLowerCase().includes(query);
    const boardMatch = item.board && item.board.toLowerCase().includes(query);

    return nameMatch || catMatch || subMatch || descMatch || schoolMatch || boardMatch;
  });

  // Filter by category pill if selected
  const categoriesList = ['All', ...new Set(matchedProducts.map(p => p.category).filter(Boolean))];

  const filteredResults = selectedCategoryFilter === 'All'
    ? matchedProducts
    : matchedProducts.filter(p => p.category === selectedCategoryFilter);

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '65vh' }}>
      {/* Search Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title">
            Search Results {query && <span>for "{searchQuery}"</span>}
          </h1>
          <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
            Found {matchedProducts.length} matching product{matchedProducts.length !== 1 ? 's' : ''} across NextStore catalog.
          </p>
        </div>
      </div>

      {/* Category Pills if results exist */}
      {!isSearchLoading && matchedProducts.length > 0 && categoriesList.length > 2 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {categoriesList.map(cat => (
            <button
              key={cat}
              className={selectedCategoryFilter === cat ? 'btn-primary-green' : 'btn-outline-grey'}
              style={{ borderRadius: '20px', padding: '6px 16px', fontSize: '13px' }}
              onClick={() => setSelectedCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 2-SECOND SKULL LOADING STATE */}
      {isSearchLoading ? (
        <div>
          <div style={{ fontSize: '14px', color: '#6c804b', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={16} /> Searching store catalog for "{searchQuery}"...
          </div>
          <SkeletonLoader type="skull" count={8} />
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center', padding: '60px 20px', background: '#fafaf8' }}>
          <Search size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
            No products found matching "{searchQuery}"
          </h2>
          <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '14px', maxWidth: '460px', margin: '6px auto 20px' }}>
            Try searching with broader terms like <strong>"CBSE"</strong>, <strong>"Uniform"</strong>, <strong>"Basketball"</strong>, <strong>"Gel Pen"</strong>, or <strong>"NCERT"</strong>.
          </p>
          <button
            className="btn-primary-green"
            onClick={() => setSearchQuery('')}
            style={{ fontSize: '13.5px', padding: '10px 22px' }}
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="store-products-grid search-results-grid">
          {filteredResults.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-img-wrap" style={{ height: '135px' }}>
                <img src={item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'} alt={item.name} />
              </div>

              <div className="product-info-body">
                <span style={{ fontSize: '11px', background: '#f0f4ea', color: '#4a5c32', padding: '3px 8px', borderRadius: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                  {item.category || 'Product'}
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

                <AddToCartBtn
                  product={item}
                  onAddToCart={(p, q) => addToCart(p, q)}
                  className="btn-primary-green"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
