import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, cartTotal, setActiveSection } = useContext(ShopContext);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setActiveSection('Contact');
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#6c804b" />
            <h3 style={{ fontSize: '18px' }}>Your Shopping Cart</h3>
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <ShoppingBag size={48} color="#d1d5db" style={{ marginBottom: '12px' }} />
              <p>Your shopping cart is empty.</p>
              <button
                className="btn-primary-green"
                style={{ marginTop: '16px', fontSize: '13px' }}
                onClick={() => { setIsCartOpen(false); setActiveSection('Books'); }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="cart-item">
                <img src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">₹{parseFloat(item.price).toFixed(2)}</div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckoutClick}>
              Proceed to Delivery Checkout <ArrowRight size={16} style={{ display: 'inline', marginLeft: '6px' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
