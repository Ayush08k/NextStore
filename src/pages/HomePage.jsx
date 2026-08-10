import React from 'react';
import { Hero } from '../components/Hero';
import { ValueProps } from '../components/ValueProps';
import { Categories } from '../components/Categories';
import { ProductGrid } from '../components/ProductGrid';
import { SpecialOffer } from '../components/SpecialOffer';
import { Testimonials } from '../components/Testimonials';

export const HomePage = () => {
  return (
    <main>
      <Hero />
      <ValueProps />
      <Categories />
      <ProductGrid title="Best Selling Products" />
      <SpecialOffer />
      <Testimonials />
    </main>
  );
};
