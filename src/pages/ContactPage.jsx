import React, { useState } from 'react';
import { Send, CheckCircle, MessageSquare } from 'lucide-react';

export const ContactPage = () => {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [contactStatus, setContactStatus] = useState(null);
  const [isSendingMsg, setIsSendingMsg] = useState(false);

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
      <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h1 className="section-title">Contact Us</h1>
          <p style={{ color: '#6b7280', marginTop: '6px' }}>
            Have a question about prescribed school books, uniform sizes, or personal coaches? Send us a message below.
          </p>
        </div>
      </div>

      <div className="form-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <MessageSquare color="#6c804b" size={24} />
          <h2 style={{ fontSize: '20px' }}>Contact Form (Mail Service)</h2>
        </div>

        {contactStatus ? (
          <div style={{ background: '#eef2e6', padding: '24px', borderRadius: '12px', color: '#586a3b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <CheckCircle size={24} color="#6c804b" />
              <h3 style={{ fontSize: '18px' }}>{contactStatus.message}</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#4b5563' }}>
              Thank you for contacting NextStore! Our customer support team will reply to your email address shortly.
            </p>
            {contactStatus.mailPreview && (
              <div style={{ marginTop: '16px', fontSize: '13px', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #c9d6b5' }}>
                <span style={{ fontWeight: 700, color: '#22252a' }}>Live Ethereal Mail Link: </span>
                <a
                  href={contactStatus.mailPreview}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#6c804b', textDecoration: 'underline', display: 'block', wordBreak: 'break-all', marginTop: '4px' }}
                >
                  {contactStatus.mailPreview}
                </a>
              </div>
            )}
            <button
              className="btn-outline-grey"
              style={{ marginTop: '20px', fontSize: '13px', width: '100%' }}
              onClick={() => setContactStatus(null)}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="John Doe"
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your Email Address *</label>
              <input
                type="email"
                className="form-control"
                required
                placeholder="john@example.com"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                placeholder="School book inquiry, coach booking, etc."
                value={contactData.subject}
                onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                className="form-control"
                rows={5}
                required
                placeholder="Write your message here..."
                value={contactData.message}
                onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '14px' }}>
              <button
                type="submit"
                className="btn-primary-green"
                style={{ padding: '10px 24px', fontSize: '14px', borderRadius: '10px' }}
                disabled={isSendingMsg}
              >
                <Send size={16} /> {isSendingMsg ? 'Sending Email...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
