import React from 'react';
import FeatureCard from './FeatureCard';

const FeatureSection = () => {
  const features = [
    {
      title: "Virtual Cultural Events",
      description: "Join live cultural events and celebrations from across India",
      image: "/images/banner/1.jpg",
      route: "/virtualevents"
    },
    {
      title: "Community Forum",
      description: "Connect with fellow Indians and share your experiences",
      image: "/images/banner/2.jpg",
      route: "/community"
    },
    {
      title: "3D Cultural Map",
      description: "Explore India's rich cultural heritage through an interactive 3D map",
      image: "/images/banner/3.jpg",
      route: "/3dmap"
    },
    {
      title: "Feature 4",
      description: "Description for feature 4",
      image: "/images/banner/4.jpg",
      route: "/feature4"
    }
  ];

  return (
    <section className="container mx-auto px-2 py-8 mt-0 mb-4">
      <h1 className="text-4xl font-bold text-slate-600 py-6 mb-8 text-center">
        Explore Your India, Relive Your Roots
      </h1>
      <div className="flex justify-between gap-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            image={feature.image}
            route={feature.route}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
