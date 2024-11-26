import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { Range } from "react-range";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import Products from "../components/products/Products";
import { BsFillGridFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import ShopProducts from "../components/products/ShopProducts";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  price_range_product,
  query_products,
} from "../store/reducers/homeReducer";
import Header2 from "../components/Header2";

const Shops = () => {
  const dispatch = useDispatch();

  const {
    products,
    categorys,
    priceRange,
    latest_product,
    totalProduct,
    parPage,
  } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(price_range_product());
  }, []);

  useEffect(() => {
    setState({
      values: [priceRange.low, priceRange.high],
    });
  }, [priceRange]);

  const [state, setState] = useState({
    values: [priceRange.low, priceRange.high],
  });
  const [rating, setRating] = useState("");
  const [styles, setStyles] = useState("grid");

  const [pageNumber, setPageNumber] = useState(1);
  const [filter, setFilter] = useState(true);
  const [sortPrice, setsortPrice] = useState("");
  const [category, setCategory] = useState("");
  const queryCategory = (e, value) => {
    if (e.target.checked) {
      setCategory(value);
      dispatch(query_products({
        low: state.values[0],
        high: state.values[1],
        category: value,
        rating,
        sortPrice,
        pageNumber: 1,
        region: selectedRegion,
        state: selectedState
      }));
    } else {
      setCategory('');
      dispatch(query_products({
        low: state.values[0],
        high: state.values[1],
        category: '',
        rating,
        sortPrice,
        pageNumber: 1,
        region: selectedRegion,
        state: selectedState
      }));
    }
  };

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const states = {
    North: [
      'Delhi',
      'Haryana',
      'Himachal Pradesh',
      'Jammu and Kashmir',
      'Ladakh',
      'Punjab',
      'Rajasthan',
      'Uttarakhand',
      'Uttar Pradesh'
    ],
    South: [
      'Andhra Pradesh',
      'Karnataka',
      'Kerala',
      'Lakshadweep',
      'Puducherry',
      'Tamil Nadu',
      'Telangana'
    ],
    East: [
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Odisha',
      'Sikkim',
      'Tripura',
      'West Bengal',
      'Jharkhand'
    ],
    West: [
      'Dadra and Nagar Haveli',
      'Daman and Diu',
      'Goa',
      'Gujarat',
      'Maharashtra'
    ],
    Central: [
      'Chhattisgarh',
      'Madhya Pradesh'
    ]
  };

  useEffect(() => {
    dispatch(query_products({
      low: state.values[0],
      high: state.values[1],
      category,
      rating,
      sortPrice,
      pageNumber,
      region: selectedRegion,
      state: selectedState
    }))
  }, [state.values[0], state.values[1], category, rating, sortPrice, pageNumber, selectedRegion, selectedState])

  const resetRating = () => {
    setRating("");
    dispatch(
      query_products({
        low: state.values[0],
        high: state.values[1],
        category,
        rating: "",
        sortPrice,
        pageNumber,
        region: selectedRegion,
        state: selectedState,
      })
    );
  };
  return (
    <div>
      <Header2 />
      <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className="absolute left-0 top-0 w-full h-full bg-[#2422228a]">
          <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
              <h2 className="text-3xl font-bold">Shop Page </h2>
              <div className="flex justify-center items-center gap-2 text-2xl w-full">
                <Link to="/">Home</Link>
                <span className="pt-1">
                  <IoIosArrowForward />
                </span>
                <span>Shop </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
          <div className={` md:block hidden ${!filter ? "mb-6" : "mb-0"} `}>
            <button
              onClick={() => setFilter(!filter)}
              className="text-center w-full py-2 px-3 bg-indigo-500 text-white">
              Filter Product
            </button>
          </div>

          <div className="w-full flex flex-wrap">
            <div
              className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 ${
                filter
                  ? "md:h-0 md:overflow-hidden md:mb-6"
                  : "md:h-auto md:overflow-auto md:mb-0"
              } `}>
              <div className='mb-8'>
                <h2 className='text-2xl font-bold mb-4 text-slate-600'>Filters</h2>
                
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold mb-3 text-slate-600'>Categories</h3>
                  <div className='flex flex-col gap-2'>
                    {categorys.map((c, i) => (
                      <div key={i} className='flex items-center gap-2'>
                        <input
                          type="checkbox"
                          id={c.name}
                          checked={category === c.name}
                          onChange={(e) => queryCategory(e, c.name)}
                          className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                        />
                        <label htmlFor={c.name} className='text-slate-600 cursor-pointer'>
                          {c.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mb-6'>
                  <h3 className='text-lg font-semibold mb-3 text-slate-600'>Location Filter</h3>
                  <div className='space-y-4'>
                    {/* Region Dropdown */}
                    <div className='relative'>
                      <select 
                        value={selectedRegion}
                        onChange={(e) => {
                          setSelectedRegion(e.target.value)
                          setSelectedState('')
                        }}
                        className='w-full px-4 py-3 appearance-none bg-white border border-slate-300 rounded-lg 
                        text-slate-600 font-medium shadow-sm hover:border-indigo-500 focus:border-indigo-500 
                        focus:ring-1 focus:ring-indigo-500 outline-none transition-all duration-200'
                      >
                        <option value="">Select Region</option>
                        {regions.map((r, i) => (
                          <option key={i} value={r.toLowerCase()} className='py-2'>
                            {r}
                          </option>
                        ))}
                      </select>
                      <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/>
                        </svg>
                      </div>
                    </div>

                    {/* State Dropdown - Shows only when region is selected */}
                    {selectedRegion && (
                      <div className='relative animate-fadeIn'>
                        <select
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className='w-full px-4 py-3 appearance-none bg-white border border-slate-300 rounded-lg 
                          text-slate-600 font-medium shadow-sm hover:border-indigo-500 focus:border-indigo-500 
                          focus:ring-1 focus:ring-indigo-500 outline-none transition-all duration-200'
                        >
                          <option value="">Select State</option>
                          {states[selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)]?.map((s, i) => (
                            <option key={i} value={s.toLowerCase()} className='py-2'>
                              {s}
                            </option>
                          ))}
                        </select>
                        <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                          <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/>
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Selected Location Display */}
                    {(selectedRegion || selectedState) && (
                      <div className='flex flex-wrap gap-2 mt-3'>
                        {selectedRegion && (
                          <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800'>
                            {selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)}
                            <button 
                              onClick={() => {
                                setSelectedRegion('')
                                setSelectedState('')
                              }}
                              className='ml-2 text-indigo-600 hover:text-indigo-800'
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {selectedState && (
                          <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800'>
                            {selectedState.charAt(0).toUpperCase() + selectedState.slice(1)}
                            <button 
                              onClick={() => setSelectedState('')}
                              className='ml-2 text-indigo-600 hover:text-indigo-800'
                            >
                              ×
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className='mb-6'>
                  <h3 className='text-lg font-semibold mb-3 text-slate-600'>Price Range</h3>
                  <Range
                    step={5}
                    min={priceRange.low}
                    max={priceRange.high}
                    values={state.values}
                    onChange={(values) => setState({values})}
                    renderTrack={({props, children}) => (
                      <div {...props} className='w-full h-[6px] bg-slate-200 rounded-full cursor-pointer'>
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div className='w-[15px] h-[15px] bg-indigo-500 rounded-full' {...props} />
                    )}
                  />
                  <div className='mt-2'>
                    <span className='text-slate-600 font-medium'>
                      {Math.floor(state.values[0])} INR - {Math.floor(state.values[1])} INR
                    </span>
                  </div>
                </div>

                <div className='mb-6'>
                  <h3 className='text-lg font-semibold mb-3 text-slate-600'>Rating</h3>
                  <div className='flex flex-col gap-2'>
                    {[5,4,3,2,1].map((r) => (
                      <div key={r} 
                        onClick={() => setRating(r.toString())}
                        className={`flex gap-2 cursor-pointer ${rating === r.toString() ? 'text-orange-500' : 'text-slate-600'}`}
                      >
                        {[...Array(r)].map((_, i) => (
                          <span key={i}><AiFillStar /></span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-9/12 md-lg:w-8/12 md:w-full">
              <div className="pl-8 md:pl-0">
                <div className="py-4 bg-white mb-10 px-3 rounded-md flex justify-between items-start border">
                  <h2 className="text-lg font-medium text-slate-600">
                    14 Products{" "}
                  </h2>
                  <div className="flex justify-center items-center gap-3">
                    <select
                      onChange={(e) => setsortPrice(e.target.value)}
                      className="p-1 border outline-0 text-slate-600 font-semibold"
                      name=""
                      id="">
                      <option value="">Sort By</option>
                      <option value="low-to-high">Low to High Price</option>
                      <option value="high-to-low">High to Low Price </option>
                    </select>
                    <div className="flex justify-center items-start gap-4 md-lg:hidden">
                      <div
                        onClick={() => setStyles("grid")}
                        className={`p-2 ${
                          styles === "grid" && "bg-slate-300"
                        } text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm `}>
                        <BsFillGridFill />
                      </div>
                      <div
                        onClick={() => setStyles("list")}
                        className={`p-2 ${
                          styles === "list" && "bg-slate-300"
                        } text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm `}>
                        <FaThList />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pb-8">
                  <ShopProducts products={products} styles={styles} />
                </div>
                <div>
                  {totalProduct > parPage && (
                    <Pagination
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                      totalItem={totalProduct}
                      parPage={parPage}
                      showItem={Math.floor(totalProduct / parPage)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shops;
