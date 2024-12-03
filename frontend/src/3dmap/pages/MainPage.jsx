import React, { Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Model from "../components/Model";
import StateInfo from "../components/StateInfo";
import { FaSpinner } from "react-icons/fa";
import Title3D from '../components/Title3D';
import Base3D from '../components/Base3D';
import { useStateData } from '../context/StateDataContext';

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
  const [isExploreMode, setIsExploreMode] = useState(false);
  const { loadStateData, isLoading } = useStateData();

  const handleExploreClick = async () => {
    await loadStateData(); // Load data when user clicks explore
    setIsExploreMode(true);
  };

  return (
    <div className="relative w-full bg-[#FFF5EE] h-screen flex items-center justify-center px-4">
      <Suspense fallback={<LoadingScreen />}>
        <div className={`transition-all duration-500 ease-in-out ${
          isExploreMode 
            ? "w-full h-screen" 
            : "w-[80%] h-[80vh]"
          } bg-[#f5f5f5]/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden relative`}>
          
          {!isExploreMode && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40">
              <button
                onClick={handleExploreClick}
                disabled={isLoading}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg 
                         hover:bg-white hover:text-black transition-all duration-300 
                         text-2xl font-semibold tracking-wider
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Explore the Beauty of India'}
              </button>
            </div>
          )}

          {isExploreMode && (
            <button
              onClick={() => setIsExploreMode(false)}
              className="absolute top-4 right-4 z-20 px-4 py-2 
                       bg-black/40 text-white border border-white/50 rounded-lg
                       hover:bg-white hover:text-black transition-all duration-300
                       text-sm font-medium"
            >
              Back to Home
            </button>
          )}

          <Base3D showControls={isExploreMode}>
            <Title3D 
              position={[50, 20, 10]}
              scale={[0.8, 0.8, 0.8]}
              rotation={[0.1, 0, 0]}
            />
            <Model 
              position={[20, -30, 0]} 
              scale={[0.45, 0.45, 0.45]} 
              isExploreMode={isExploreMode}
            />
          </Base3D>
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
    className="pt-12 pb-12 mt-0 text-center bg-[#fff6f0]">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1 font-serif">
      Explore the Beauty of India
    </h1>
    <p className="text-base md:text-lg text-gray-600">
      Click on any state to discover its unique heritage and culture
    </p>
  </motion.div>
);

// Layout component
const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <AnimatePresence mode="wait">{children}</AnimatePresence>
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
    console.error("Error:", error, errorInfo);
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
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
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
          <Route
            path="/"
            element={
              <>
                <Header />
                <MainContent />
              </>
            }
          />
          <Route path="/state/:stateId" element={<StateInfo />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
};

export default MainPage;