import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Truck, CheckCircle, ShoppingBag, ArrowRight, Package } from 'lucide-react';

export const OrdersPage = () => {
  const { cart, cartTotal, clearCart, setActiveSection } = useContext(ShopContext);

  const [deliveryData, setDeliveryData] = useState({
    recipient_name: '',
    phone: '',
    alt_phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
    email: ''
  });

  const [orderStatus, setOrderStatus] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handleDeliverySubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty! Please add products before placing a doorstep delivery order.');
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...deliveryData,
          total_amount: cartTotal,
          items: cart
        })
      });

      const data = await res.json();
      if (res.ok) {
        setOrderStatus(data);
        clearCart();
      } else {
        alert(data.error || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      alert('Network error placing order.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Home Delivery Checkout & Orders</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Complete recipient contact address details for doorstep delivery of educational supplies and book kits.
          </p>
        </div>
      </div>

      {orderStatus ? (
        <div className="form-card" style={{ maxWidth: '700px', margin: '0 auto', background: '#eef2e6', color: '#586a3b', padding: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <CheckCircle size={36} color="#6c804b" />
            <div>
              <h2 style={{ fontSize: '24px' }}>Order #{orderStatus.orderId} Placed Successfully!</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px' }}>{orderStatus.message}</p>
            </div>
          </div>

          <p style={{ fontSize: '15px', color: '#4b5563', margin: '16px 0' }}>
            Your prescribed school books, uniforms, or educational items are being prepared for doorstep delivery.
          </p>

          {orderStatus.mailPreview && (
            <div style={{ marginTop: '20px', background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #c9d6b5' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#22252a' }}>📧 Live Ethereal Mail Order Receipt Link:</p>
              <a
                href={orderStatus.mailPreview}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '13px', color: '#6c804b', textDecoration: 'underline', wordBreak: 'break-all', display: 'inline-block', marginTop: '4px' }}
              >
                {orderStatus.mailPreview}
              </a>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', marginTop: '28px' }}>
            <button className="btn-primary-green" onClick={() => setActiveSection('Books')}>
              Continue Shopping <ArrowRight size={16} />
            </button>
            <button className="btn-outline-grey" onClick={() => setOrderStatus(null)}>
              Place Another Order
            </button>
          </div>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: '30px', alignItems: 'start' }}>
          {/* Checkout Form */}
          <div className="form-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Truck color="#6c804b" size={24} />
              <h2 style={{ fontSize: '20px' }}>Home Delivery Address Entry</h2>
            </div>

            <form onSubmit={handleDeliverySubmit}>
              <div className="form-group">
                <label className="form-label">Recipient Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. John Smith"
                  value={deliveryData.recipient_name}
                  onChange={(e) => setDeliveryData({ ...deliveryData, recipient_name: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Primary Mobile Contact *</label>
                  <input
                    type="tel"
                    className="form-control"
                    required
                    placeholder="+91 98765 43210"
                    value={deliveryData.phone}
                    onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Alternate Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Optional secondary phone"
                    value={deliveryData.alt_phone}
                    onChange={(e) => setDeliveryData({ ...deliveryData, alt_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (for instant order receipts)</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="customer@example.com"
                  value={deliveryData.email}
                  onChange={(e) => setDeliveryData({ ...deliveryData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Complete Home Delivery Address *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  required
                  placeholder="Flat/House No, Building, Street Name, Landmark..."
                  value={deliveryData.address}
                  onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })}
                />
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Kota / Jaipur"
                    value={deliveryData.city}
                    onChange={(e) => setDeliveryData({ ...deliveryData, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rajasthan"
                    value={deliveryData.state}
                    onChange={(e) => setDeliveryData({ ...deliveryData, state: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="324005"
                    value={deliveryData.pincode}
                    onChange={(e) => setDeliveryData({ ...deliveryData, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '14px' }}>
                <button
                  type="submit"
                  className="btn-primary-green"
                  style={{ padding: '11px 26px', fontSize: '14px', borderRadius: '10px' }}
                  disabled={isSubmittingOrder || cart.length === 0}
                >
                  {isSubmittingOrder ? 'Submitting Order...' : 'Submit Doorstep Delivery Order'}
                </button>
              </div>
            </form>
          </div>

          {/* Cart Order Summary Side Card */}
          <div className="form-card" style={{ background: '#fcfcf9', border: '1px solid #e7e9df' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <Package color="#6c804b" size={22} />
              <h3 style={{ fontSize: '18px' }}>Order Summary ({cart.length} items)</h3>
            </div>

            {cart.length === 0 ? (
              <div style={{ padding: '30px 10px', textAlign: 'center', color: '#6b7280' }}>
                <ShoppingBag size={42} color="#d1d5db" style={{ marginBottom: '10px' }} />
                <p>Your shopping cart is empty.</p>
                <button
                  className="btn-primary-green"
                  style={{ marginTop: '14px', fontSize: '13px' }}
                  onClick={() => setActiveSection('Books')}
                >
                  Browse School Books & Supplies
                </button>
              </div>
            ) : (
              <div>
                <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '20px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Qty: {item.quantity} × ₹{parseFloat(item.price).toFixed(2)}</div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '14px' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', color: '#6b7280' }}>
                    <span>Subtotal:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', color: '#6b7280' }}>
                    <span>Doorstep Shipping:</span>
                    <span style={{ color: '#6c804b', fontWeight: 600 }}>FREE</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800 }}>
                    <span>Total Amount:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
