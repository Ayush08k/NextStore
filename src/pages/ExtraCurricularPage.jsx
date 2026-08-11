import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Trophy, Star, Calendar, Clock, CheckCircle, UserCheck } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

export const ExtraCurricularPage = () => {
  const { coaches, addToCart, isLoadingCoaches } = useContext(ShopContext);
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [bookingDate, setBookingDate] = useState('2026-08-15');
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  const sportsList = ['All', 'Cricket', 'Football', 'Tennis', 'Swimming', 'Badminton', 'Chess'];

  const filteredCoaches = coaches.filter(
    (c) => selectedSport === 'All' || c.sport.toLowerCase() === selectedSport.toLowerCase()
  );

  const handleBookSession = (e) => {
    e.preventDefault();
    if (!selectedCoach || !bookingSlot) return;

    addToCart({
      id: `coach-${selectedCoach.id}-${Date.now()}`,
      name: `1-on-1 ${selectedCoach.sport} Coaching with ${selectedCoach.name} (${bookingDate} at ${bookingSlot})`,
      category: 'Extra-Curricular',
      price: selectedCoach.hourly_rate,
      image: selectedCoach.image
    });

    setBookingSuccess(`Session booked with ${selectedCoach.name} for ${bookingDate} at ${bookingSlot}!`);
    setSelectedCoach(null);
    setTimeout(() => setBookingSuccess(''), 5000);
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Extra-Curricular Activity &amp; Coach Booking</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Book certified personal sports coaches for 1-on-1 private training sessions.
          </p>
        </div>
      </div>

      {/* Sport Category Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {sportsList.map((sport) => (
          <button
            key={sport}
            className={selectedSport === sport ? 'btn-primary-green' : 'btn-outline-grey'}
            onClick={() => setSelectedSport(sport)}
            style={{ borderRadius: '20px', padding: '8px 18px', fontSize: '14px' }}
          >
            {sport}
          </button>
        ))}
      </div>



      {/* Coaches Grid */}
      <div className="store-products-grid coaches-grid" style={{ marginBottom: '40px' }}>
        {isLoadingCoaches ? (
          <SkeletonLoader type="list" count={4} />
        ) : (
          filteredCoaches.map((coach) => (
            <div
              key={coach.id}
              className="product-card coach-card"
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '8px' }}>
                  <img
                    src={coach.image}
                    alt={coach.name}
                    style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px', border: '2px solid #f0f4ea' }}
                  />
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>{coach.name}</h3>
                  <span style={{ color: '#6c804b', fontWeight: 700, fontSize: '11.5px', marginTop: '2px' }}>{coach.sport} Coach</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', background: '#fffbeb', padding: '2px 8px', borderRadius: '12px', margin: '4px auto 8px', width: 'fit-content' }}>
                  <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1f2937' }}>{coach.rating}</span>
                </div>

                <p style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center', margin: '6px 0 10px', height: '28px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {coach.specialization} ({coach.experience_years} Yrs Exp)
                </p>

                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#22252a' }}>
                    ₹{parseFloat(coach.hourly_rate).toFixed(2)} / hr
                  </span>
                </div>
              </div>

              {/* RESERVE SLOT BUTTON AT THE VERY BOTTOM OF THE CARD */}
              <button
                className="btn-primary-green"
                style={{ width: '100%', padding: '8px 10px', fontSize: '11.5px', borderRadius: '8px', justifyContent: 'center', marginTop: '4px' }}
                onClick={() => {
                  setSelectedCoach(coach);
                  const slots = coach.available_slots ? coach.available_slots.split(',') : ['10:00 AM'];
                  setBookingSlot(slots[0].trim());
                }}
              >
                <Calendar size={13} /> Reserve Slot
              </button>
            </div>
          ))
        )}
      </div>

      {/* Booking Slot Modal */}
      {selectedCoach && (
        <div className="modal-overlay" onClick={() => setSelectedCoach(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', marginBottom: '6px' }}>Book Session with {selectedCoach.name}</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
              Sport: <strong>{selectedCoach.sport}</strong> | Rate: <strong>₹{selectedCoach.hourly_rate}/hr</strong>
            </p>

            <form onSubmit={handleBookSession}>
              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Available Time Slot</label>
                <select
                  className="form-control"
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                >
                  {(selectedCoach.available_slots || '09:00 AM, 11:00 AM, 04:00 PM')
                    .split(',')
                    .map((slot, idx) => (
                      <option key={idx} value={slot.trim()}>
                        {slot.trim()}
                      </option>
                    ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary-green" style={{ flex: 1 }}>
                  Confirm Booking (₹{selectedCoach.hourly_rate})
                </button>
                <button
                  type="button"
                  className="btn-outline-grey"
                  onClick={() => setSelectedCoach(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
