import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  const reviews = [
    {
      text: "Amazing products and fast delivery! NextStore is my go-to store for all my children's school book kits and sports gear.",
      name: "John D.",
      role: "Parent",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80",
      rating: 5
    },
    {
      text: "Great quality at affordable prices. The customized bag printing came out so clear, and customer support is also very responsive.",
      name: "Sarah M.",
      role: "Teacher",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
      rating: 5
    },
    {
      text: "Very happy with my purchase. We booked a tennis coach for our son, and the process was super smooth. Highly recommend NextStore to everyone!",
      name: "Michael T.",
      role: "Sports Enthusiast",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&q=80",
      rating: 5
    }
  ];

  return (
    <section className="container">
      <div className="section-header" style={{ justifyContent: 'center' }}>
        <h2 className="section-title">What Our Customers Say</h2>
      </div>

      <div className="testimonials-grid">
        {reviews.map((rev, idx) => (
          <div key={idx} className="testimonial-card">
            <div>
              <Quote className="quote-icon" size={28} />
              <p className="testimonial-text">{rev.text}</p>
            </div>

            <div className="testimonial-user">
              <img className="user-avatar" src={rev.avatar} alt={rev.name} />
              <div>
                <div className="user-name">{rev.name}</div>
                <div className="user-stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="star-icon" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
