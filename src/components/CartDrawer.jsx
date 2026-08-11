import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, cartTotal, setActiveSection } = useContext(ShopContext);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setActiveSection('Orders');
  };

  return (
    <div
      className="cart-overlay"
      onClick={() => setIsCartOpen(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(17, 24, 39, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      {/* CENTER POPUP MODAL WINDOW */}
      <div
        className="cart-modal-window"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'popupModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* HEADER WITH LOGO & CLOSE BUTTON */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #ececec',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafaf8'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#6c804b', width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17.5px', fontWeight: 800, color: '#1f2937', margin: 0 }}>
                NextStore Cart
              </h3>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Review your selected products</span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: '#f3f4f6',
              border: 'none',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4b5563',
              transition: 'all 0.2s ease'
            }}
            title="Close Cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY ITEMS */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <ShoppingBag size={56} color="#d1d5db" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Your cart is empty
              </h4>
              <p style={{ fontSize: '13px' }}>Explore books, uniforms, sports gear &amp; stationery to add items.</p>
              <button
                className="btn-primary-green"
                style={{ marginTop: '18px', fontSize: '13px', padding: '10px 22px' }}
                onClick={() => { setIsCartOpen(false); setActiveSection('Books'); }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px',
                    borderRadius: '14px',
                    border: '1px solid #f0f0f0',
                    background: '#fcfcfc'
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                    alt={item.name}
                    style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '10px', background: '#ffffff', padding: '4px', border: '1px solid #e5e7eb' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#6c804b', marginTop: '4px' }}>
                      ₹{parseFloat(item.price).toFixed(2)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER CHECKOUT */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #ececec', background: '#fafaf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', color: '#4b5563', fontWeight: 600 }}>Subtotal:</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#1f2937' }}>₹{cartTotal.toFixed(2)}</span>
            </div>

            <button
              className="btn-primary-green"
              onClick={handleCheckoutClick}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '15px', justifyContent: 'center' }}
            >
              Proceed to Orders Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
