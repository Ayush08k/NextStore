import React, { useState } from 'react';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';

export const AddToCartBtn = ({
  product,
  onAddToCart,
  label = "Add to Cart",
  addedLabel = "Added to Cart!",
  iconSize = 16,
  style = {},
  className = "add-to-cart-btn",
  showQtySelector = true
}) => {
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (qty > 1) setQty(qty - 1);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    setQty(qty + 1);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, qty);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {/* Quantity Selection Control */}
      {showQtySelector && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '4px 10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563' }}>Quantity:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleDecrease}
              disabled={qty <= 1}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '1px solid #d1d5db',
                background: qty <= 1 ? '#f3f4f6' : '#ffffff',
                color: qty <= 1 ? '#9ca3af' : '#1f2937',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: qty <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <Minus size={12} />
            </button>
            <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '16px', textAlign: 'center', color: '#111827' }}>
              {qty}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '1px solid #d1d5db',
                background: '#ffffff',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Add To Cart Button with 2s Animation */}
      <button
        type="button"
        className={`${className} ${isAdded ? 'btn-added-state' : ''}`}
        onClick={handleAddClick}
        disabled={isAdded}
        style={{
          width: '100%',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: isAdded ? '#15803d' : undefined,
          borderColor: isAdded ? '#15803d' : undefined,
          color: isAdded ? '#ffffff' : undefined,
          transform: isAdded ? 'scale(0.97)' : 'scale(1)',
          cursor: isAdded ? 'default' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '10px',
          borderRadius: '10px',
          fontSize: '13px',
          ...style
        }}
      >
        {isAdded ? (
          <>
            <Check size={iconSize} className="btn-check-anim" />
            <span>{addedLabel} ({qty})</span>
          </>
        ) : (
          <>
            <ShoppingCart size={iconSize} />
            <span>{label}</span>
          </>
        )}
      </button>
    </div>
  );
};
