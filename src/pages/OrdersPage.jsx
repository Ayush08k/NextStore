import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Truck, CheckCircle, ShoppingBag, ArrowRight, ArrowLeft, Package, Check } from 'lucide-react';

export const OrdersPage = () => {
  const { cart, cartTotal, clearCart, setActiveSection } = useContext(ShopContext);

  // 2-Step Checkout Flow: 'summary' (Step 1) -> 'address' (Step 2)
  const [checkoutStep, setCheckoutStep] = useState('summary');
  const [slideAnimClass, setSlideAnimClass] = useState('step-anim-next');

  const goToStep = (step) => {
    if (step === checkoutStep) return;
    if (step === 'address') setSlideAnimClass('step-anim-next');
    else setSlideAnimClass('step-anim-prev');
    setCheckoutStep(step);
  };

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
    <div className="container" style={{ padding: '40px 20px', minHeight: '70vh' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Doorstep Delivery &amp; Order Checkout</h1>
          <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
            Review order items and complete recipient delivery address details for doorstep dispatch.
          </p>
        </div>
      </div>

      {/* SUCCESS ORDER CONFIRMATION SCREEN */}
      {orderStatus ? (
        <div className="form-card" style={{ maxWidth: '680px', margin: '0 auto', background: '#eef2e6', color: '#586a3b', padding: '32px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <CheckCircle size={38} color="#6c804b" />
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Order #{orderStatus.orderId} Placed Successfully!</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px' }}>{orderStatus.message}</p>
            </div>
          </div>

          <p style={{ fontSize: '14.5px', color: '#4b5563', margin: '16px 0' }}>
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

          <div style={{ display: 'flex', gap: '14px', marginTop: '28px', flexWrap: 'wrap' }}>
            <button className="btn-primary-green" onClick={() => setActiveSection('Books')}>
              Continue Shopping <ArrowRight size={16} />
            </button>
            <button className="btn-outline-grey" onClick={() => { setOrderStatus(null); setCheckoutStep('summary'); }}>
              Place Another Order
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>

          {/* STEP PROGRESS TRACKER */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            <div
              onClick={() => goToStep('summary')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '20px',
                background: checkoutStep === 'summary' ? '#586a3b' : '#f3f4f6',
                color: checkoutStep === 'summary' ? '#ffffff' : '#6b7280',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: checkoutStep === 'summary' ? '#ffffff' : '#d1d5db', color: checkoutStep === 'summary' ? '#586a3b' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                1
              </span>
              <span>1. Order Summary ({cart.length})</span>
            </div>

            <ArrowRight size={16} color="#9ca3af" />

            <div
              onClick={() => { if (cart.length > 0) goToStep('address'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '20px',
                background: checkoutStep === 'address' ? '#586a3b' : '#f3f4f6',
                color: checkoutStep === 'address' ? '#ffffff' : '#6b7280',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
                opacity: cart.length > 0 ? 1 : 0.6,
                transition: 'all 0.25s ease'
              }}
            >
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: checkoutStep === 'address' ? '#ffffff' : '#d1d5db', color: checkoutStep === 'address' ? '#586a3b' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                2
              </span>
              <span>2. Delivery Address</span>
            </div>
          </div>

          {/* STEP 1: ORDER SUMMARY PAGE */}
          {checkoutStep === 'summary' && (
            <div className={`form-card ${slideAnimClass}`} style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package color="#6c804b" size={24} />
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>Review Order Items</h2>
                </div>
                <span style={{ fontSize: '13px', background: '#f0f4ea', color: '#4a5c32', padding: '4px 10px', borderRadius: '10px', fontWeight: 700 }}>
                  {cart.length} Item{cart.length !== 1 ? 's' : ''} Selected
                </span>
              </div>

              {cart.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
                  <ShoppingBag size={52} color="#d1d5db" style={{ marginBottom: '14px' }} />
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Your shopping cart is empty</h3>
                  <p style={{ fontSize: '13.5px', marginBottom: '20px' }}>Add books, uniforms, sports gear or stationery items to proceed to checkout.</p>
                  <button
                    className="btn-primary-green"
                    style={{ fontSize: '13.5px', padding: '10px 24px' }}
                    onClick={() => setActiveSection('Books')}
                  >
                    Browse School Catalog
                  </button>
                </div>
              ) : (
                <div>
                  {/* Cart Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {cart.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px',
                          borderRadius: '12px',
                          background: '#fafaf8',
                          border: '1px solid #ededef',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                            alt={item.name}
                            style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px', background: '#ffffff', padding: '4px', border: '1px solid #e5e7eb' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937', lineHeight: 1.3 }}>{item.name}</div>
                            <div style={{ fontSize: '12.5px', color: '#6b7280', marginTop: '2px' }}>
                              Qty: <strong>{item.quantity}</strong> × ₹{parseFloat(item.price).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <span style={{ fontWeight: 800, fontSize: '15px', color: '#22252a', whiteSpace: 'nowrap' }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Summary */}
                  <div style={{ background: '#f8f9f5', padding: '20px', borderRadius: '14px', border: '1px solid #e2e5da', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', color: '#4b5563' }}>
                      <span>Subtotal ({cart.length} items):</span>
                      <span style={{ fontWeight: 700 }}>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', color: '#4b5563' }}>
                      <span>Doorstep Express Delivery:</span>
                      <span style={{ color: '#15803d', fontWeight: 800 }}>FREE</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '19px', fontWeight: 900, color: '#111827' }}>
                      <span>Total Amount Payable:</span>
                      <span style={{ color: '#586a3b' }}>₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* PROCEED TO STEP 2 BUTTON */}
                  <button
                    className="btn-primary-green"
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '15px', justifyContent: 'center' }}
                    onClick={() => goToStep('address')}
                  >
                    Proceed to Delivery Address <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: DELIVERY ADDRESS ENTRY FORM */}
          {checkoutStep === 'address' && (
            <div className={`form-card ${slideAnimClass}`} style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Truck color="#6c804b" size={24} />
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>Recipient Delivery Address Entry</h2>
                </div>

                <button
                  type="button"
                  className="btn-outline-grey"
                  style={{ fontSize: '12.5px', padding: '6px 14px', borderRadius: '10px' }}
                  onClick={() => goToStep('summary')}
                >
                  <ArrowLeft size={14} /> Back to Order
                </button>
              </div>

              <form onSubmit={handleDeliverySubmit}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>Recipient Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. John Smith"
                    value={deliveryData.recipient_name}
                    onChange={(e) => setDeliveryData({ ...deliveryData, recipient_name: e.target.value })}
                    style={{ padding: '12px 14px', fontSize: '14px', borderRadius: '10px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Primary Mobile Contact *</label>
                    <input
                      type="tel"
                      className="form-control"
                      required
                      placeholder="+91 98765 43210"
                      value={deliveryData.phone}
                      onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                      style={{ padding: '12px 14px', fontSize: '14px', borderRadius: '10px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Alternate Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Optional secondary phone"
                      value={deliveryData.alt_phone}
                      onChange={(e) => setDeliveryData({ ...deliveryData, alt_phone: e.target.value })}
                      style={{ padding: '12px 14px', fontSize: '14px', borderRadius: '10px' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Email Address (for instant order receipts)</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="customer@example.com"
                    value={deliveryData.email}
                    onChange={(e) => setDeliveryData({ ...deliveryData, email: e.target.value })}
                    style={{ padding: '12px 14px', fontSize: '14px', borderRadius: '10px' }}
                  />
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Complete Home Delivery Address *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    required
                    placeholder="Flat/House No, Building, Street Name, Landmark..."
                    value={deliveryData.address}
                    onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })}
                    style={{ padding: '12px 14px', fontSize: '14px', borderRadius: '10px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>City *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Kota / Jaipur"
                      value={deliveryData.city}
                      onChange={(e) => setDeliveryData({ ...deliveryData, city: e.target.value })}
                      style={{ padding: '12px 14px', fontSize: '14px', borderRadius: '10px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>State *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rajasthan"
                      required
                      value={deliveryData.state}
                      onChange={(e) => setDeliveryData({ ...deliveryData, state: e.target.value })}
                      style={{ padding: '12px 14px', fontSize: '14px', borderRadius: '10px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Pincode *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="324005"
                      value={deliveryData.pincode}
                      onChange={(e) => setDeliveryData({ ...deliveryData, pincode: e.target.value })}
                      style={{ padding: '12px 14px', fontSize: '14px', borderRadius: '10px' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '28px' }}>
                  <button
                    type="submit"
                    className="btn-primary-green"
                    style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '12px', justifyContent: 'center' }}
                    disabled={isSubmittingOrder || cart.length === 0}
                  >
                    {isSubmittingOrder ? 'Submitting Doorstep Order...' : `Order Now (₹${cartTotal.toFixed(2)})`}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
