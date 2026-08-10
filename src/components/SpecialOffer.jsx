import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const SpecialOffer = () => {
  const { setActiveSection } = useContext(ShopContext);

  return (
    <section className="container">
      <div className="special-offer-card">
        <div className="offer-content">
          <p className="offer-tag">Special Offer</p>
          <h2 className="offer-heading">Up to 50% Off</h2>
          <p className="offer-subtext">
            Limited time offer on selected educational items, uniforms, and sports gear. Hurry up and grab the best deals!
          </p>
          <button className="btn-primary-green" onClick={() => setActiveSection('Stationary')}>
            Shop the Sale <ArrowRight size={16} />
          </button>
        </div>

        <div className="offer-img-wrap">
          <img
            src="/images/promo_banner.png"
            alt="Up to 50% Off Special Offer"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80";
            }}
          />
        </div>
      </div>
    </section>
  );
};
