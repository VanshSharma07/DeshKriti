import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';
import { FaSpinner, FaArrowUp, FaSearch } from 'react-icons/fa';
import { detailedStateData } from '../data/stateData';
import Header2 from '../../components/Header2';

// Fallback images with remote URLs
const FALLBACK_IMAGES = {
  banner: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQu3gBB7SFMDzGhF1EJtCXFZQ9HmvFkSR_DA&s",
  product: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQu3gBB7SFMDzGhF1EJtCXFZQ9HmvFkSR_DA&s",
  food: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQu3gBB7SFMDzGhF1EJtCXFZQ9HmvFkSR_DA&s",
  place: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQu3gBB7SFMDzGhF1EJtCXFZQ9HmvFkSR_DA&s",
  culture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQu3gBB7SFMDzGhF1EJtCXFZQ9HmvFkSR_DA&s",
  heritage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQu3gBB7SFMDzGhF1EJtCXFZQ9HmvFkSR_DA&s"
};

// Add this custom event function at the top of the file, outside the component
const triggerGlobalSearch = (searchQuery) => {
  const searchEvent = new CustomEvent('deshkriti-search', {
    detail: { searchQuery }
  });
  window.dispatchEvent(searchEvent);
};

// Reusable Card Component
const Card = ({ image, title, description, category, className = "" }) => {
  const handleProductSearch = () => {
    if (category === 'product') {
      // Create a search query with product name
      const searchQuery = `${title}`;
      triggerGlobalSearch(searchQuery);
    }
  };

  return (
    <motion.div 
      className={`group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 cursor-pointer ${className}`}
      onClick={category === 'product' ? handleProductSearch : undefined}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
          width={400}
          height={300}
          onError={(e) => {
            e.target.src = FALLBACK_IMAGES[category];
            e.target.onerror = null;
          }}
        />
        {category === 'product' && (
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white flex items-center gap-2">
              <FaSearch className="text-xl" />
              <span>Search to Buy</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        {category === 'product' && (
          <div className="mt-4 flex items-center text-blue-500 text-sm font-medium">
            <FaSearch className="mr-2" />
          
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Section Title Component
const SectionTitle = ({ children }) => (
  <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-blue-500 pb-2 inline-block">
    {children}
  </h2>
);

const StateInfo = () => {
  const { stateId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateInfo, setStateInfo] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch state data
  useEffect(() => {
    const fetchStateData = async () => {
      try {
        setLoading(true);
        const modelId = `model_${stateId}`;
        const stateDetails = detailedStateData[modelId];

        if (!stateDetails) {
          throw new Error(`State not found for ID: ${stateId}`);
        }

        setStateInfo(stateDetails);
      } catch (err) {
        console.error('Error fetching state data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStateData();
  }, [stateId]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error || !stateInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          {error || 'State information not available'}
        </h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Map
        </button>
      </div>
    );
  }
  return (
    <AnimatePresence>
      <Header2 />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-50"
      >
        {/* Banner Image */}
        <div 
          className="h-[50vh] w-full bg-cover bg-center relative"
          style={{ 
            backgroundImage: `url(${stateInfo.images?.state_banner || FALLBACK_IMAGES.banner})`,
            minHeight: '400px'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-6xl font-bold text-white text-center px-4">{stateInfo.name}</h1>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/3dmap')}
          className="fixed top-4 left-4 z-[100] flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <IoArrowBack />
          <span>Back to Map</span>
        </button>

        {/* Main Content - Updated container */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Products Section */}
          {stateInfo.products?.details?.length > 0 && (
            <div className="mb-20">
              <SectionTitle>Traditional Products</SectionTitle>
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2rem',
                }}
              >
                {stateInfo.products.details.map((product, index) => (
                  <Card
                    key={index}
                    image={product.imageUrl}
                    title={product.name}
                    description={product.description}
                    category="product"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Culture Section */}
          {(stateInfo.culture?.festivals?.length > 0 || stateInfo.culture?.traditions?.length > 0) && (
            <div className="mb-20">
              <SectionTitle>Culture & Traditions</SectionTitle>
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2rem',
                }}
              >
                {[...(stateInfo.culture?.festivals || []), ...(stateInfo.culture?.traditions || [])].map((item, index) => (
                  <Card
                    key={index}
                    image={item.imageUrl}
                    title={item.name}
                    description={item.description}
                    category="culture"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Food Section */}
          {stateInfo.food?.dishes?.length > 0 && (
            <div className="mb-20">
              <SectionTitle>Traditional Cuisine</SectionTitle>
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2rem',
                }}
              >
                {stateInfo.food.dishes.map((dish, index) => (
                  <Card
                    key={index}
                    image={dish.imageUrl}
                    title={dish.name}
                    description={dish.description}
                    category="food"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Places Section */}
          {stateInfo.places?.tourist_spots?.length > 0 && (
            <div className="mb-20">
              <SectionTitle>Places to Visit</SectionTitle>
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2rem',
                }}
              >
                {stateInfo.places.tourist_spots.map((place, index) => (
                  <Card
                    key={index}
                    image={place.imageUrl}
                    title={place.name}
                    description={place.description}
                    category="place"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Heritage Section */}
          {stateInfo.heritage?.sites?.length > 0 && (
            <div className="mb-20">
              <SectionTitle>Heritage</SectionTitle>
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2rem',
                }}
              >
                {stateInfo.heritage.sites.map((site, index) => (
                  <Card
                    key={index}
                    image={site.imageUrl}
                    title={site.name}
                    description={site.description}
                    category="heritage"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 z-[100] p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StateInfo;