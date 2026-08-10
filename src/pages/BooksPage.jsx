import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { BookOpen, CheckCircle, ShoppingCart, Filter, Search } from 'lucide-react';

export const BooksPage = () => {
  const { addToCart } = useContext(ShopContext);
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [books, setBooks] = useState([]);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [loading, setLoading] = useState(false);
  const [kitAddedMsg, setKitAddedMsg] = useState('');

  // Fetch Cities on load
  useEffect(() => {
    fetch('/api/schools/cities')
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        if (data.length > 0) setSelectedCity(data[0]);
      });
  }, []);

  // Fetch Schools when City changes
  useEffect(() => {
    if (selectedCity) {
      fetch(`/api/schools?city=${encodeURIComponent(selectedCity)}`)
        .then((res) => res.json())
        .then((data) => {
          setSchools(data);
          if (data.length > 0) setSelectedSchoolId(data[0].id);
        });
    }
  }, [selectedCity]);

  // Fetch Books when School or Class changes
  useEffect(() => {
    if (selectedSchoolId && selectedClass) {
      setLoading(true);
      fetch(`/api/books?school_id=${selectedSchoolId}&class_grade=${encodeURIComponent(selectedClass)}`)
        .then((res) => res.json())
        .then((data) => {
          setBooks(data);
          setLoading(false);
        });
    }
  }, [selectedSchoolId, selectedClass]);

  const handleAddFullKit = () => {
    if (books.length === 0) return;
    const totalKitPrice = books.reduce((sum, b) => sum + b.price, 0);
    const selectedSchoolObj = schools.find((s) => s.id === parseInt(selectedSchoolId));

    const kitItem = {
      id: `kit-${selectedSchoolId}-${selectedClass}`,
      name: `${selectedSchoolObj ? selectedSchoolObj.name : 'School'} - Complete ${selectedClass} Book Kit`,
      category: 'School Books',
      price: totalKitPrice,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    };

    addToCart(kitItem);
    setKitAddedMsg('Complete Class Book Kit added to your cart!');
    setTimeout(() => setKitAddedMsg(''), 4000);
  };

  const selectedSchoolObj = schools.find((s) => s.id === parseInt(selectedSchoolId));

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">School & Class Books Selector</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Select your City, School Name, and Class Grade to load the exact prescribed syllabus books.
          </p>
        </div>
      </div>

      {/* Cascade Filters */}
      <div className="form-card" style={{ marginBottom: '30px', background: '#f8f8f4' }}>
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">1. Select City</label>
            <select
              className="form-control"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">2. Select School Name</label>
            <select
              className="form-control"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name} ({school.city})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">3. Select Class / Grade</label>
            <select
              className="form-control"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(
                (cls, idx) => (
                  <option key={idx} value={cls}>
                    {cls}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {kitAddedMsg && (
        <div style={{ background: '#eef2e6', color: '#586a3b', padding: '14px 20px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 600 }}>{kitAddedMsg}</span>
        </div>
      )}

      {/* Books Display */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading prescribed book kit...</div>
      ) : books.length > 0 ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px' }}>
              Prescribed Booklist for {selectedSchoolObj ? selectedSchoolObj.name : ''} - {selectedClass}
            </h2>
            <button className="btn-primary-green" onClick={handleAddFullKit}>
              <ShoppingCart size={18} /> Buy Complete Book Kit (${books.reduce((s, b) => s + b.price, 0).toFixed(2)})
            </button>
          </div>

          <div className="grid-2">
            {books.map((book) => (
              <div
                key={book.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: '#f0f4ea', padding: '14px', borderRadius: '10px', color: '#6c804b' }}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{book.book_title}</h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                      Subject: {book.subject} | Publisher: {book.publisher}
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: 800, color: '#22252a', marginTop: '6px' }}>
                      ${parseFloat(book.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  className="btn-outline-grey"
                  style={{ padding: '8px 14px', fontSize: '13px' }}
                  onClick={() =>
                    addToCart({
                      id: `book-${book.id}`,
                      name: book.book_title,
                      category: 'School Books',
                      price: book.price,
                      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80'
                    })
                  }
                >
                  + Add Book
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="form-card" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <BookOpen size={48} color="#d1d5db" style={{ marginBottom: '12px' }} />
          <p>No prescribed booklist found for the selected school and class.</p>
        </div>
      )}
    </div>
  );
};
