import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headset } from 'lucide-react';

export const ValueProps = () => {
  return (
    <div className="container">
      <div className="value-props">
        <div className="vp-item">
          <div className="vp-icon">
            <Truck size={22} />
          </div>
          <div>
            <h4 className="vp-title">Free Shipping</h4>
            <p className="vp-desc">On orders over $50</p>
          </div>
        </div>

        <div className="vp-item">
          <div className="vp-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 className="vp-title">Secure Payment</h4>
            <p className="vp-desc">100% secure payment</p>
          </div>
        </div>

        <div className="vp-item">
          <div className="vp-icon">
            <RefreshCw size={22} />
          </div>
          <div>
            <h4 className="vp-title">Easy Returns</h4>
            <p className="vp-desc">30 days return policy</p>
          </div>
        </div>

        <div className="vp-item">
          <div className="vp-icon">
            <Headset size={22} />
          </div>
          <div>
            <h4 className="vp-title">24/7 Support</h4>
            <p className="vp-desc">Dedicated support</p>
          </div>
        </div>
      </div>
    </div>
  );
};
