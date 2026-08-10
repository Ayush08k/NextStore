import React from 'react';
import { ProductGrid } from '../components/ProductGrid';

export const SportsPage = () => {
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Sports Equipment & Gear</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            High-grade sports gear, rackets, athletic shoes, protective pads, and training balls.
          </p>
        </div>
      </div>

      <ProductGrid title="Featured Sports Products" filterCategory="Sports" />
    </div>
  );
};
