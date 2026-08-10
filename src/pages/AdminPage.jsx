import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Plus, Trash2, ShieldAlert, CheckCircle, Database } from 'lucide-react';

export const AdminPage = () => {
  const { fetchProducts, fetchCoaches } = useContext(ShopContext);

  const [activeTab, setActiveTab] = useState('products'); // products | schools | books | coaches
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State for Adding New Item
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Stationary',
    price: '',
    original_price: '',
    badge: 'New',
    image: '',
    description: ''
  });

  const [schoolForm, setSchoolForm] = useState({
    city: '',
    name: '',
    address: ''
  });

  const [bookForm, setBookForm] = useState({
    school_id: '',
    class_grade: 'Class 5',
    subject: '',
    book_title: '',
    publisher: '',
    price: ''
  });

  const [coachForm, setCoachForm] = useState({
    name: '',
    sport: 'Cricket',
    specialization: '',
    experience_years: 5,
    hourly_rate: '',
    available_slots: '10:00 AM, 02:00 PM, 05:00 PM'
  });

  const loadCurrentData = async () => {
    setLoading(true);
    try {
      let url = '';
      if (activeTab === 'products') url = '/api/products';
      else if (activeTab === 'schools') url = '/api/schools';
      else if (activeTab === 'books') url = '/api/books';
      else if (activeTab === 'coaches') url = '/api/coaches';

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItemsList(data);
      }
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentData();
  }, [activeTab]);

  // Handle Add Operations
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    let url = '';
    let payload = {};

    if (activeTab === 'products') {
      url = '/api/products';
      payload = productForm;
    } else if (activeTab === 'schools') {
      url = '/api/schools';
      payload = schoolForm;
    } else if (activeTab === 'books') {
      url = '/api/books';
      payload = bookForm;
    } else if (activeTab === 'coaches') {
      url = '/api/coaches';
      payload = coachForm;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setFeedbackMsg(`Successfully ADDED new ${activeTab.slice(0, -1)} entry!`);
        loadCurrentData();
        fetchProducts();
        fetchCoaches();

        // Reset forms
        setProductForm({ name: '', category: 'Stationary', price: '', original_price: '', badge: 'New', image: '', description: '' });
        setSchoolForm({ city: '', name: '', address: '' });
        setBookForm({ school_id: '', class_grade: 'Class 5', subject: '', book_title: '', publisher: '', price: '' });
        setCoachForm({ name: '', sport: 'Cricket', specialization: '', experience_years: 5, hourly_rate: '', available_slots: '10:00 AM, 02:00 PM, 05:00 PM' });

        setTimeout(() => setFeedbackMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  // Handle Delete Operations
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/${activeTab}?id=${deleteTarget.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setFeedbackMsg(`Successfully DELETED record ID #${deleteTarget.id}`);
        setDeleteTarget(null);
        loadCurrentData();
        fetchProducts();
        fetchCoaches();
        setTimeout(() => setFeedbackMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Admin Dashboard (Add & Delete Data)</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            SRS Compliant Admin Portal exclusively for adding new data records and deleting obsolete entries.
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <div style={{ background: '#eef2e6', color: '#586a3b', padding: '14px 20px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 600 }}>{feedbackMsg}</span>
        </div>
      )}

      {/* Admin Module Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
        {[
          { id: 'products', name: 'Products Catalog (Stationery, Uniforms, Bags, Sports)' },
          { id: 'schools', name: 'Schools & Cities' },
          { id: 'books', name: 'Class Books Prescriptions' },
          { id: 'coaches', name: 'Sports Coaches' }
        ].map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'btn-primary-green' : 'btn-outline-grey'}
            onClick={() => setActiveTab(tab.id)}
            style={{ borderRadius: '8px', padding: '10px 18px', fontSize: '14px' }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ gap: '30px', alignItems: 'start' }}>
        {/* ADD DATA FORM */}
        <div className="form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Plus color="#6c804b" size={24} />
            <h2 style={{ fontSize: '18px' }}>Add New {activeTab.toUpperCase()} Record</h2>
          </div>

          <form onSubmit={handleAddSubmit}>
            {activeTab === 'products' && (
              <>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-control"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      <option value="Stationary">Stationary</option>
                      <option value="Dress">Dress (Uniforms)</option>
                      <option value="Custom Bags">Custom Bags</option>
                      <option value="Sports">Sports</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  />
                </div>
              </>
            )}

            {activeTab === 'schools' && (
              <>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. New York, London, Delhi"
                    value={schoolForm.city}
                    onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">School Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Greenwood High School"
                    value={schoolForm.name}
                    onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={schoolForm.address}
                    onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                  />
                </div>
              </>
            )}

            {activeTab === 'books' && (
              <>
                <div className="form-group">
                  <label className="form-label">School ID *</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    placeholder="Enter School ID (e.g. 1)"
                    value={bookForm.school_id}
                    onChange={(e) => setBookForm({ ...bookForm, school_id: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Class Grade *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Class 5"
                      value={bookForm.class_grade}
                      onChange={(e) => setBookForm({ ...bookForm, class_grade: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      required
                      value={bookForm.price}
                      onChange={(e) => setBookForm({ ...bookForm, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Book Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={bookForm.book_title}
                    onChange={(e) => setBookForm({ ...bookForm, book_title: e.target.value })}
                  />
                </div>
              </>
            )}

            {activeTab === 'coaches' && (
              <>
                <div className="form-group">
                  <label className="form-label">Coach Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={coachForm.name}
                    onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Sport Category *</label>
                    <select
                      className="form-control"
                      value={coachForm.sport}
                      onChange={(e) => setCoachForm({ ...coachForm, sport: e.target.value })}
                    >
                      <option value="Cricket">Cricket</option>
                      <option value="Football">Football</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Badminton">Badminton</option>
                      <option value="Chess">Chess</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hourly Rate (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      required
                      value={coachForm.hourly_rate}
                      onChange={(e) => setCoachForm({ ...coachForm, hourly_rate: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn-primary-green" style={{ width: '100%', marginTop: '16px' }}>
              <Plus size={16} /> Save & Insert Data Record
            </button>
          </form>
        </div>

        {/* EXISTING RECORDS LIST & DELETE ACTION */}
        <div className="form-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database color="#6c804b" size={24} />
              <h2 style={{ fontSize: '18px' }}>Existing {activeTab.toUpperCase()} Data</h2>
            </div>
            <span style={{ fontSize: '12px', background: '#f3f4f6', padding: '4px 10px', borderRadius: '12px' }}>
              {itemsList.length} Records
            </span>
          </div>

          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {itemsList.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderBottom: '1px solid #f3f4f6'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>
                    #{item.id} - {item.name || item.book_title || item.city}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {item.category || item.sport || item.class_grade || item.address || ''}
                  </div>
                </div>

                <button
                  onClick={() => setDeleteTarget(item)}
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Delete Action per SRS 2.5/4.3 */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626', marginBottom: '14px' }}>
              <ShieldAlert size={28} />
              <h3 style={{ fontSize: '18px' }}>Confirm Permanent Deletion</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '20px' }}>
              Are you sure you want to delete record <strong>#{deleteTarget.id} ({deleteTarget.name || deleteTarget.book_title || deleteTarget.city})</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-primary-green"
                style={{ flex: 1, background: '#dc2626' }}
                onClick={confirmDelete}
              >
                Yes, Delete Record
              </button>
              <button
                className="btn-outline-grey"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
