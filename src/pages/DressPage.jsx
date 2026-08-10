import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ShoppingCart, Shirt, MapPin, School, SlidersHorizontal, ImageOff } from 'lucide-react';

const GENDER_FILTERS = ['All', 'Boys', 'Girls', 'Unisex'];

const DRESS_TYPE_ICONS = {
  'Suit Salwar':       '👘',
  'White Suit Salwar': '🤍',
  'Skirt':             '👗',
  'White Skirt':       '🤍',
  'Shirt':             '👔',
  'White Shirt':       '🤍',
  'White T-Shirt':     '🤍',
  'Boys Pant':         '👖',
  'White Pant':        '🤍',
  'Half Pant':         '🩳',
  'White Half Pant':   '🤍',
  'Tracksuit':         '🏃',
  'Sports Shorts':     '🩳',
  'Blazer':            '🧥',
  'Tie':               '👔',
  'Belt':              '🔗',
  'Socks':             '🧦',
  'Shoes':             '👟',
};

const GENDER_COLORS = {
  Boys:   { bg: '#eff6ff', color: '#1d4ed8' },
  Girls:  { bg: '#fdf2f8', color: '#9d174d' },
  Unisex: { bg: '#f0f4ea', color: '#3d6117' },
};

export const DressPage = () => {
  const { addToCart } = useContext(ShopContext);

  const [cities, setCities]             = useState([]);
  const [schools, setSchools]           = useState([]);
  const [uniforms, setUniforms]         = useState([]);

  const [selectedCity, setSelectedCity]       = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedGender, setSelectedGender]   = useState('All');
  const [addedId, setAddedId]                 = useState(null);
  const [loading, setLoading]                 = useState(false);

  // Load cities
  useEffect(() => {
    fetch('/api/schools/cities')
      .then(r => r.json())
      .then(data => {
        setCities(data);
        // Don't auto-select: start blank
      });
  }, []);

  // Load schools when city changes
  useEffect(() => {
    if (!selectedCity) { setSchools([]); setSelectedSchoolId(''); setUniforms([]); return; }
    fetch(`/api/schools?city=${encodeURIComponent(selectedCity)}`)
      .then(r => r.json())
      .then(data => {
        setSchools(data);
        setSelectedSchoolId('');
        setUniforms([]);
      });
  }, [selectedCity]);

  // Load uniforms when school changes
  useEffect(() => {
    if (!selectedSchoolId) { setUniforms([]); return; }
    setLoading(true);
    fetch(`/api/uniforms?school_id=${selectedSchoolId}`)
      .then(r => r.json())
      .then(data => { setUniforms(data); setLoading(false); });
  }, [selectedSchoolId]);

  const filtered = uniforms.filter(u =>
    selectedGender === 'All' || u.gender === selectedGender || u.gender === 'Unisex'
  );

  const selectedSchoolObj = schools.find(s => s.id === parseInt(selectedSchoolId));
  const hasSchool = Boolean(selectedSchoolId && selectedSchoolObj);

  const handleAdd = (uniform) => {
    addToCart({
      id:       `uniform-${uniform.id}`,
      name:     `${uniform.name} — ${selectedSchoolObj?.name}`,
      category: 'Dress',
      price:    uniform.price,
      image:    uniform.image || ''
    });
    setAddedId(uniform.id);
    setTimeout(() => setAddedId(null), 2500);
  };

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>

      {/* Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title">School Uniform Catalog</h1>
          <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
            Select your city and school to browse all available uniform items.
          </p>
        </div>
      </div>

      {/* Filter Card */}
      <div className="form-card" style={{ background: '#f8f8f4', marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* City */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#6c804b" /> 1. Select City
            </label>
            <select
              className="form-control"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              <option value="">— Choose City —</option>
              {cities.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>

          {/* School */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <School size={14} color="#6c804b" /> 2. Select School
            </label>
            <select
              className="form-control"
              value={selectedSchoolId}
              onChange={e => setSelectedSchoolId(e.target.value)}
              disabled={!selectedCity}
            >
              <option value="">— Choose School —</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Sub-filters: only show when school is selected */}
        {hasSchool && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <SlidersHorizontal size={15} color="#6c804b" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>Filter by:</span>
            {GENDER_FILTERS.map(g => (
              <button
                key={g}
                className={selectedGender === g ? 'btn-primary-green' : 'btn-outline-grey'}
                style={{ borderRadius: '20px', padding: '6px 16px', fontSize: '12.5px' }}
                onClick={() => setSelectedGender(g)}
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── BLANK STATE: no city/school selected ─── */}
      {!selectedCity && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏫</div>
          <h3 style={{ fontSize: '18px', color: '#6b7280', fontWeight: 700 }}>Select a City to Get Started</h3>
          <p style={{ fontSize: '14px', marginTop: '6px' }}>Choose your city and school above to browse the official uniform catalog.</p>
        </div>
      )}

      {selectedCity && !selectedSchoolId && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏫</div>
          <h3 style={{ fontSize: '18px', color: '#6b7280', fontWeight: 700 }}>Now Select Your School</h3>
          <p style={{ fontSize: '14px', marginTop: '6px' }}>Pick the school name from the dropdown above to see its uniform items.</p>
        </div>
      )}

      {/* ─── LOADING ─── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>Loading uniform catalog…</div>
      )}

      {/* ─── UNIFORM GRID ─── */}
      {hasSchool && !loading && (
        <>
          {/* School badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>🏫</span>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800 }}>{selectedSchoolObj.name}</h2>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{selectedSchoolObj.city} — {filtered.length} uniform item{filtered.length !== 1 ? 's' : ''} found</p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
              No items match the selected filter.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
              {filtered.map(uniform => {
                const gc = GENDER_COLORS[uniform.gender] || GENDER_COLORS['Unisex'];
                const icon = DRESS_TYPE_ICONS[uniform.dress_type] || '👕';
                const isAdded = addedId === uniform.id;

                return (
                  <div
                    key={uniform.id}
                    style={{
                      background: '#ffffff',
                      border: `1.5px solid ${isAdded ? '#6c804b' : '#e5e7eb'}`,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: isAdded ? '0 0 0 3px rgba(108,128,75,0.15)' : '0 4px 16px rgba(0,0,0,0.04)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Image placeholder area */}
                    <div style={{
                      background: '#f5f7f2',
                      height: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '8px',
                      borderBottom: '1px solid #ececec',
                      position: 'relative'
                    }}>
                      {uniform.image ? (
                        <img
                          src={uniform.image}
                          alt={uniform.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <>
                          <span style={{ fontSize: '52px', lineHeight: 1 }}>{icon}</span>
                          <span style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ImageOff size={11} /> Image coming soon
                          </span>
                        </>
                      )}

                      {/* Gender badge */}
                      <span style={{
                        position: 'absolute', top: '10px', left: '10px',
                        fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                        borderRadius: '20px', background: gc.bg, color: gc.color
                      }}>
                        {uniform.gender}
                      </span>
                    </div>

                    {/* Info body */}
                    <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1a1c1e', lineHeight: 1.3 }}>
                        {uniform.name}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{uniform.description}</p>

                      {uniform.applicable_classes && (
                        <span style={{ fontSize: '11px', color: '#6c804b', fontWeight: 600 }}>
                          📚 For: {uniform.applicable_classes}
                        </span>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <div>
                          <span style={{ fontSize: '18px', fontWeight: 900, color: '#22252a' }}>
                            ₹{parseFloat(uniform.price).toFixed(2)}
                          </span>
                          {uniform.price_range && (
                            <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>{uniform.price_range}</span>
                          )}
                        </div>

                        <button
                          className={isAdded ? 'btn-primary-green' : 'btn-outline-grey'}
                          style={{ padding: '8px 14px', fontSize: '12.5px', borderRadius: '10px' }}
                          onClick={() => handleAdd(uniform)}
                        >
                          {isAdded ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>✓ Added</span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <ShoppingCart size={14} /> Add
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
