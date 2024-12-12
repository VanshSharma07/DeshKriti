import React from 'react';
import Header2 from '../components/Header2';
import { motion } from 'framer-motion';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const ARGallery = () => {
  const products = [
    {
      id: 1,
      name: 'Himachali Caps (Kullu Caps)',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfbiqA772HkvJE7o24Qnd7PK9Pi5tx_F9PsQ&s',
      qrCode: '/images/ar/Himachali Cap.png',
      description: 'Experience the intricate details of Banarasi weaving in AR'
    },
    {
      id: 2,
      name: 'Handcrafted Pottery',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsBV7IOlPziHPGxPgJ8jILafg3XBxE6JuUmA&s',
      qrCode: '/images/ar/Diya.png',
      description: 'View this authentic Indian pottery in your space'
    },
    {
      id: 3,
      name: 'Ganesha',
      image: 'https://panchakritya.com/cdn/shop/articles/lord_ganesha_painting.jpg?v=1713711271',
      qrCode: '/images/ar/Ganesha.png',
      description: 'Bring the Hindu deity Ganesha into your space'
    },
    {
      id: 4,
      name: 'Athangudi Tiles',
      image: 'https://www.joinpaperplanes.com/wp-content/uploads/2022/04/Untitled-design.png',
      qrCode: '/images/ar/Athangudi Tiles.png',
      description: 'Explore the beauty of traditional Athangudi tiles'
    },
    {
      id: 5,
      name: 'Necklace',
      image: 'https://st4.depositphotos.com/6056438/27543/i/450/depositphotos_275439654-stock-photo-indian-traditional-gold-necklace-lakshmi.jpg',
      qrCode: '/images/ar/Necklace.png',
      description: 'Visualize this intricate Indian necklace in your space'
    },
    {
      id: 6,
      name: 'Sitar',
      image: 'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2017/12/27/Pictures/_01fa79a8-eaf9-11e7-ba01-0264b08f54bd.jpg',
      qrCode: '/images/ar/Sitar.png',
      description: 'Experience the classic Indian musical instrument, the Sitar'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header2 />

      {/* Hero Section */}
      <section className="relative h-[220px] mt-6 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/banner/arbanner.png")' }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
          <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold"
            >
              AR Product Gallery
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center items-center gap-2 text-2xl w-full"
            >
              <Link to="/" className="hover:text-blue-300 transition-colors">Home</Link>
              <span className="pt-1">
                <IoIosArrowForward />
              </span>
              <span>AR Gallery</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="w-[85%] mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Experience Products in Augmented Reality
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Scan the QR code next to each product to view it in your space through AR technology
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="w-[85%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: product.id * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="grid grid-cols-2">
                  {/* Product Image */}
                  <div className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <h3 className="text-xl font-semibold mt-4 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                  </div>
                  
                  {/* QR Code */}
                  <div className="p-4 flex flex-col contain items-center justify-center bg-gray-50">
                    <img
                      src={product.qrCode}
                      alt={`QR code for ${product.name}`}
                      className="w-78 h-78"
                    />
                    <p className="text-center mt-4 text-sm text-gray-600">
                      Scan to view in AR
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-16 bg-white">
        <div className="w-[85%] mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How to Use AR View</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Scan QR Code",
                description: "Use your phone's camera to scan the QR code next to the product"
              },
              {
                step: 2,
                title: "Point Camera",
                description: "Point your camera at a flat surface where you want to see the product"
              },
              {
                step: 3,
                title: "Explore in AR",
                description: "Move around to view the product from different angles in your space"
              }
            ].map((step) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step.step * 0.2 }}
                className="text-center p-6 rounded-lg bg-gray-50"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ARGallery;