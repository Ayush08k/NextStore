import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Mail, Phone, MapPin, Send, CheckCircle, Truck, ShoppingCart } from 'lucide-react';

export const ContactPage = () => {
  const { cart, cartTotal, clearCart } = useContext(ShopContext);

  // Delivery Checkout Form State
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

  // Inquiry Form State
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState(null);
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Handle Home Delivery Checkout Submission
  const handleDeliverySubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty! Please add products before placing a home delivery order.');
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

  // Handle Contact Inquiry Form Submission (Mail Service)
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSendingMsg(true);
    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      const data = await res.json();
      if (res.ok) {
        setContactStatus(data);
        setContactData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Mail dispatch error:', err);
      alert('Network error sending email.');
    } finally {
      setIsSendingMsg(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Checkout & Contact Support</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Submit doorstep delivery contact address or reach our customer support team.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '30px' }}>
        {/* Left Column: Home Delivery Address Module */}
        <div className="form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Truck color="#6c804b" size={24} />
            <h2 style={{ fontSize: '20px' }}>Home Delivery Address Entry</h2>
          </div>

          {orderStatus ? (
            <div style={{ background: '#eef2e6', padding: '24px', borderRadius: '12px', color: '#586a3b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <CheckCircle size={28} />
                <h3 style={{ fontSize: '20px' }}>Order #{orderStatus.orderId} Placed!</h3>
              </div>
              <p>{orderStatus.message}</p>
              {orderStatus.mailPreview && (
                <div style={{ marginTop: '16px', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #c9d6b5' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>📧 Live Ethereal Mail Confirmation Link:</p>
                  <a
                    href={orderStatus.mailPreview}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '13px', color: '#6c804b', textDecoration: 'underline', wordBreak: 'break-all' }}
                  >
                    {orderStatus.mailPreview}
                  </a>
                </div>
              )}
              <button
                className="btn-primary-green"
                style={{ marginTop: '20px', width: '100%' }}
                onClick={() => setOrderStatus(null)}
              >
                Place Another Order
              </button>
            </div>
          ) : (
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
                    placeholder="+1 (555) 000-0000"
                    value={deliveryData.phone}
                    onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Alternate Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Optional phone"
                    value={deliveryData.alt_phone}
                    onChange={(e) => setDeliveryData({ ...deliveryData, alt_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (for order receipts)</label>
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
                  placeholder="Flat/House No, Building, Street, Landmark..."
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
                    value={deliveryData.city}
                    onChange={(e) => setDeliveryData({ ...deliveryData, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
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
                    value={deliveryData.pincode}
                    onChange={(e) => setDeliveryData({ ...deliveryData, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ background: '#fafaf8', padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Cart Total ({cart.length} items):</span>
                <span style={{ fontSize: '18px', fontWeight: 800 }}>${cartTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="btn-primary-green"
                style={{ width: '100%', padding: '14px' }}
                disabled={isSubmittingOrder}
              >
                {isSubmittingOrder ? 'Submitting Order...' : 'Submit Doorstep Delivery Order'}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Inquiry & Mail Service */}
        <div>
          <div className="form-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Mail color="#6c804b" size={24} />
              <h2 style={{ fontSize: '20px' }}>Send Us a Message (Mail Service)</h2>
            </div>

            {contactStatus ? (
              <div style={{ background: '#eef2e6', padding: '20px', borderRadius: '8px', color: '#586a3b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircle size={20} />
                  <strong>{contactStatus.message}</strong>
                </div>
                {contactStatus.mailPreview && (
                  <div style={{ marginTop: '10px', fontSize: '12px', background: '#fff', padding: '10px', borderRadius: '6px' }}>
                    <span>Live Mail Preview Link: </span>
                    <a href={contactStatus.mailPreview} target="_blank" rel="noreferrer" style={{ color: '#6c804b', textDecoration: 'underline' }}>
                      {contactStatus.mailPreview}
                    </a>
                  </div>
                )}
                <button
                  className="btn-outline-grey"
                  style={{ marginTop: '14px', fontSize: '12px' }}
                  onClick={() => setContactStatus(null)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Email</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Book inquiry, Coach slot, etc."
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    required
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-green"
                  style={{ width: '100%' }}
                  disabled={isSendingMsg}
                >
                  <Send size={16} /> {isSendingMsg ? 'Sending Email...' : 'Send Message via Mailer'}
                </button>
              </form>
            )}
          </div>

          <div className="form-card" style={{ background: '#f8f8f4' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Store Contact Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="#6c804b" />
                <span>NextStore HQ, 100 Education Way, NY 10001</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#6c804b" />
                <span>+1 (800) NEXT-STORE / +1 (800) 639-8786</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#6c804b" />
                <span>support@nextstore.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
