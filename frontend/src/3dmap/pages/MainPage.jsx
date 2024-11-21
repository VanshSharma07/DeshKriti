import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Model from '../components/Model';
import StateInfo from '../components/StateInfo';
import { FaSpinner } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Html } from '@react-three/drei';
import Header2 from '../../components/Header2';
import Footer from '../../components/Footer';

// Loading component with animation
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-full bg-white/80 rounded-lg p-8">
    <div className="text-center">
      <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
      <p className="text-xl text-gray-600">Loading India's Beauty...</p>
    </div>
  </div>
);

// Main content component
const MainContent = () => {
  return (
    <div className="relative w-full h-[calc(100vh-180px)] flex items-center justify-center px-4">
      <Suspense fallback={<LoadingScreen />}>
        <div className="w-full h-full max-h-[600px] bg-[#f5f5f5]/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <Canvas
            camera={{
              position: [0, 0, 100],
              fov: 35,
              near: 1,
              far: 1000,
              zoom: 0.8,
            }}
            className="rounded-3xl"
          >
            <color attach="background" args={['#f8fafc']} />
            {/* Lighting */}
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#ffeedd" />
            <Model position={[20, -30, 0]} scale={[0.5, 0.5, 0.5]} />
            <OrbitControls
              enableRotate={true}
              enablePan={false}
              minDistance={60}
              maxDistance={140}
              target={[0, 0, 0]}
              zoomSpeed={0.8}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
              minAzimuthAngle={-Math.PI / 6}
              maxAzimuthAngle={Math.PI / 6}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Canvas>
        </div>
      </Suspense>
    </div>
  );
};

// Header component
const Header = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="pt-4 pb-2 text-center relative z-10"
  >
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1 font-serif">
      Explore the Beauty of India
    </h1>
    <p className="text-base md:text-lg text-gray-600">
      Click on any state to discover its unique heritage and culture
    </p>
  </motion.div>
);

// Footer component


// Layout component
const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
            <p className="text-gray-600 mb-6">Something went wrong.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// MainPage component
const MainPage = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={
            <>
            <Header2 />
              <Header />
              <MainContent />
              <Footer />
            </>
          } />
          <Route path="/state/:stateId" element={<StateInfo />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
};

export default MainPage;
