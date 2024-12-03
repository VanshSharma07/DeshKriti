import React from "react";
import Carousel from "react-multi-carousel";
import { Link, useNavigate } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Products = ({ title, products }) => {
  const navigate = useNavigate();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const handleProductClick = (slug) => {
    navigate(`/product/details/${slug}`);
  };

  const ButtonGroup = ({ next, previous }) => {
    return (
      <div className='flex justify-between items-center mb-6'>
        <div className='relative'>
          <h2 className='text-xl font-bold text-gray-800 hover:text-[#059473] transition-colors duration-300'>
            {title}
          </h2>
          <div className='w-1/2 h-0.5 bg-[#059473] mt-1 transform origin-left scale-x-0 group-hover:scale-x-100 
            transition-transform duration-300'></div>
        </div>
        <div className='flex justify-center items-center gap-2'>
          <button
            onClick={() => previous()}
            className='w-8 h-8 flex justify-center items-center rounded-full bg-gray-100 
              hover:bg-[#059473] hover:text-white transition-all duration-300 
              hover:scale-110 text-gray-600'>
            <IoIosArrowBack />
          </button>
          <button
            onClick={() => next()}
            className='w-8 h-8 flex justify-center items-center rounded-full bg-gray-100 
              hover:bg-[#059473] hover:text-white transition-all duration-300 
              hover:scale-110 text-gray-600'>
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className='flex gap-6 flex-col-reverse group'>
      <Carousel
        autoPlay={true}
        infinite={true}
        arrows={false}
        responsive={responsive}
        transitionDuration={500}
        renderButtonGroupOutside={true}
        customButtonGroup={<ButtonGroup />}>
        {products.map((p, i) => (
          <div key={i} className='flex flex-col justify-start gap-3'>
            {p.map((pl, j) => (
              <div key={j} 
                className='flex justify-start items-center p-3 rounded-xl hover:bg-gray-50 
                  transition-all duration-300 group/item cursor-pointer' 
                onClick={() => handleProductClick(pl.slug)}>
                <div className='relative w-[100px] h-[100px] rounded-lg overflow-hidden'>
                  <img
                    className='w-full h-full object-cover transform transition-transform 
                      duration-500 group-hover/item:scale-110'
                    src={pl.images[0]}
                    alt={pl.name}
                  />
                </div>
                <div className='px-4 flex justify-start items-start gap-1 flex-col'>
                  <h3 className='text-gray-700 font-medium line-clamp-2 group-hover/item:text-[#059473] 
                    transition-colors duration-300'>
                    {pl.name}
                  </h3>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg font-bold text-[#059473]'>
                      ₹{pl.price}
                    </span>
                    {pl.discount && (
                      <span className='text-sm text-gray-400 line-through'>
                        ₹{Math.round(pl.price * (1 + pl.discount/100))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Products;
