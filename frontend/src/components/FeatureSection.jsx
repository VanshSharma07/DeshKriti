import React from 'react';
import FeatureCard from './FeatureCard';

const FeatureSection = () => {
  return (
    <section className="container mx-auto px-2 py-8 mt-0 mb-4">
      <h1 className="text-4xl font-bold text-slate-600 py-6 mb-8 text-center">
        Explore Your India, Relive Your Roots
      </h1>
      <div className="flex justify-between gap-4">
        <FeatureCard />
        <FeatureCard />
        <FeatureCard />
        <FeatureCard />
      </div>
    </section>
  );
};

export default FeatureSection;
