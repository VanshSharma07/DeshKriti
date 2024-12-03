import React, { useEffect } from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Categorys from "../components/Categorys";
import FeatureProducts from "../components/products/FeatureProducts";
import Products from "../components/products/Products";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from "../store/reducers/homeReducer";
import { useNavigate } from "react-router-dom";
import FeatureSection from "../components/FeatureSection";
import MainPage from "../3dmap/pages/MainPage";

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();

  const { products, latest_product, topRated_product, discount_product } =
    useSelector((state) => state.home);

  useEffect(() => {
    dispatch(get_products());
  }, []);

  // Handler for product click
  const handleProductClick = (slug) => {
    navigate(`/product/details/${slug}`);
  };

  return (
    <div className="w-full">
      <Header />
      <MainPage />
      {/* <FeatureSection /> */}
      <Categorys />
      <div className="py-[45px]">
        <FeatureProducts products={products} />
      </div>

      <div className='bg-gradient-to-b from-white to-gray-50 py-16'>
        <div className='max-w-[1500px] mx-auto px-6'>
          <div className='grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-8'>
            <div className='bg-white rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                transition-all duration-300 hover:-translate-y-1'>
              <Products 
                title="Latest Product" 
                products={latest_product} 
                onProductClick={handleProductClick}
              />
            </div>

            <div className='bg-white rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                transition-all duration-300 hover:-translate-y-1'>
              <Products 
                title="Top Rated Product" 
                products={topRated_product} 
                onProductClick={handleProductClick}
              />
            </div>

            <div className='bg-white rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                transition-all duration-300 hover:-translate-y-1'>
              <Products 
                title="Discount Product" 
                products={discount_product} 
                onProductClick={handleProductClick}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Home;
