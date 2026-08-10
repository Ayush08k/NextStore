import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ArrowRight, BookOpen, Shirt, PenTool, Trophy, Dumbbell, ShoppingBag } from 'lucide-react';

export const Categories = () => {
  const { setActiveSection } = useContext(ShopContext);

  const categories = [
    { name: 'School Books', section: 'Books', icon: <BookOpen size={36} color="#6c804b" /> },
    { name: 'Dress & Uniforms', section: 'Dress', icon: <Shirt size={36} color="#5a6d3c" /> },
    { name: 'Stationary', section: 'Stationary', icon: <PenTool size={36} color="#748c54" /> },
    { name: 'Coaching & Activities', section: 'Personal coatches', icon: <Trophy size={36} color="#4a5d30" /> },
    { name: 'Sports Gear', section: 'Sports', icon: <Dumbbell size={36} color="#6c804b" /> },
    { name: 'Customized Bags', section: 'Stationary', icon: <ShoppingBag size={36} color="#89a164" /> },
  ];

  return (
    <section className="container">
      <div className="section-header">
        <h2 className="section-title">Shop by Categories</h2>
        <div className="view-all-link" onClick={() => setActiveSection('Books')}>
          View All Categories <ArrowRight size={16} />
        </div>
      </div>

      <div className="categories-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="category-circle-card" onClick={() => setActiveSection(cat.section)}>
            <div className="circle-img-wrap">
              {cat.icon}
            </div>
            <span className="category-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
