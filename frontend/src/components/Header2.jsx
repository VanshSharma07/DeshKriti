import React, { useEffect, useState } from "react";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import { FaListUl } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { PiShoppingCartFill } from "react-icons/pi";
import { FaPhoneAlt } from "react-icons/fa";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHandsHelping } from "react-icons/fa";
import { useTheme } from '@mui/material';

import { useDispatch, useSelector } from "react-redux";
import {
  get_card_products,
  get_wishlist_products,
} from "../store/reducers/cardReducer";

const Header2 = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card
  );
  const navigate = useNavigate();
  const { categorys } = useSelector((state) => state.home);
  const { pathname } = useLocation();

  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("");
  const [showShidebar, setShowSidebar] = useState(true);
  const [categoryShow, setCategoryShow] = useState(true);
  const theme = useTheme();

  const displayName = userInfo ? 
    `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || userInfo.name || 'User' 
    : 'Guest';

  const redirect_card_page = () => {
    if (userInfo) {
      navigate("/card");
    } else {
      navigate("/login");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      search();
    }
  };

  const search = () => {
    if (searchValue.trim()) {
      navigate(`/products/search?category=${category || ''}&value=${searchValue.trim()}`);
    }
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id));
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    const handleGlobalSearch = (event) => {
      const { searchQuery } = event.detail;
      
      // First clear any existing search
      setSearchValue('');
      setCategory('');
      
      // Small timeout to ensure state is cleared before setting new value
      setTimeout(() => {
        setSearchValue(searchQuery); // Update with new search query
        navigate(`/products/search?category=${category || ''}&value=${searchQuery}`);
      }, 50);
    };

    // Add event listener
    window.addEventListener('deshkriti-search', handleGlobalSearch);

    // Cleanup
    return () => {
      window.removeEventListener('deshkriti-search', handleGlobalSearch);
    };
  }, [category, navigate]);

  return (
    <div className={`w-full ${theme.palette.mode === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="w-full relative z-10">
        <div className="mx-auto">
          <div className={`h-[80px] md-h-[100px] flex justify-between items-center px-8 ${theme.palette.mode === 'dark' ? 'text-white' : 'text-black'}`}>
            {/* Logo Section */}
            <div className="flex mt-3 items-center gap-8">
              <Link to="/">
                <img
                  src="http://localhost:3000/images/logo.png"
                  alt="Logo"
                  className="w-20 h-auto"
                />
              </Link>
              {/* <span
                onClick={() => setShowSidebar(false)}
                className={`justify-center items-center w-[30px] h-[30px] ${
                  theme.palette.mode === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-slate-100 text-slate-600'
                } border border-slate-300 rounded-sm md:hidden lg:flex xl:flex xs:hidden`}>
                <FaListUl />
              </span> */}
            </div>

            {/* Navigation and User Actions */}
            <div className="flex items-center justify-between flex-1 px-4">
              {/* Navigation Menu */}
              <ul className={`flex items-center gap-8 text-sm font-bold uppercase mx-8 md:hidden lg:flex ${
                theme.palette.mode === 'dark' ? 'text-gray-300' : 'text-slate-600'
              }`}>
                <li>
                  <Link
                    className={`p-2 ${
                      pathname === "/" 
                        ? "text-[#059473]" 
                        : theme.palette.mode === 'dark' 
                          ? "text-gray-300" 
                          : "text-slate-600"
                    }`}
                    to="/">
                    Home
                  </Link>
                </li>
                <li className="relative group">
                  <div className="flex items-center gap-1 cursor-pointer p-2 text-slate-600">
                    Store
                    <IoMdArrowDropdown />
                  </div>
                  <ul className="absolute invisible group-hover:visible w-48 py-2 rounded-md backdrop-blur-md">
                    <li>
                      <Link to="/shops" className="block px-4 py-2 text-slate-600 hover:bg-slate-100/50 transition-colors">
                        All Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/regional-products" className="block px-4 py-2 text-slate-600 hover:bg-slate-100/50 transition-colors">
                        Regional Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/category" className="block px-4 py-2 text-slate-600 hover:bg-slate-100/50 transition-colors">
                        Shop by Category
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    className={`p-2 ${
                      pathname === "/blog" ? "text-[#059473]" : "text-slate-600"
                    }`}
                    to="/blog">
                    Blog
                  </Link>
                </li>
                 <li>
                  <Link
                    className={`p-2 ${
                      pathname === "/social" ? "text-[#059473]" : "text-slate-600"
                    }`}
                    to="/social">
                    Community
                  </Link>
                </li> 
                {/* <li className="relative group">
                  <div className="flex items-center gap-1 cursor-pointer p-2 text-slate-600">
                    Community
                    <IoMdArrowDropdown />
                  </div>
                  <ul className="absolute invisible group-hover:visible w-48 py-2 rounded-md backdrop-blur-md">
                    <li>
                      <Link to="/community" className="block px-4 py-2 text-slate-600 hover:bg-slate-100/50 transition-colors">
                        Community Groups
                      </Link>
                    </li>
                    <li>
                      <Link to="/virtualevents" className="block px-4 py-2 text-slate-600 hover:bg-slate-100/50 transition-colors">
                        Virtual Events
                      </Link>
                    </li>
                  </ul>
                </li> */}
                {/* <li>
                  <Link
                    className={`p-2 ${
                      pathname === "/stories" ? "text-[#059473]" : "text-slate-600"
                    }`}
                    to="/stories">
                    Stories
                  </Link>
                </li> */}
              </ul>

              {/* Icons and Buttons Section - Aligned Right */}
              <div className="flex items-center gap-4 justify-end w-full">
                {/* Wishlist Icon */}
                <div
                  onClick={() =>
                    navigate(userInfo ? "/dashboard/my-wishlist" : "/login")
                  }
                  className={`relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full ${
                    theme.palette.mode === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-[#e2e2e2] hover:bg-gray-300'
                  }`}>
                  <span className="text-xl text-green-500">
                    <FaHeart />
                  </span>
                  {wishlist_count !== 0 && (
                    <div className="w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                      {wishlist_count}
                    </div>
                  )}
                </div>

                {/* Cart Icon - Replaced with Truck Logo */}
                <div
                  onClick={redirect_card_page}
                  className={`relative flex justify-center items-center cursor-pointer w-[100px] h-[100px] rounded-full`}>
                  <img 
                    src="/images/truckLogo.png" 
                    alt="Delivery Truck" 
                    className="w-[70px] h-[70px] object-contain transition-transform duration-300 hover:scale-110"
                  />
                  {card_product_count !== 0 && (
                    <div className="w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center top-3 right-2">
                      {card_product_count}
                    </div>
                  )}
                </div>

                {/* User Profile Section */}
                {userInfo ? (
                  <Link
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-base border rounded-full ${
                      theme.palette.mode === 'dark'
                        ? 'text-white border-gray-700 hover:bg-gray-800'
                        : 'text-black border-gray-300 hover:bg-blue-500 hover:text-white'
                    }`}
                    to="/dashboard">
                    <FaUserCog />
                    <span>{displayName}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-base border rounded-full ${
                      theme.palette.mode === 'dark'
                        ? 'text-white border-gray-700 hover:bg-gray-800'
                        : 'text-white border-gray-300 hover:bg-gray-100'
                    }`}>
                    <IoIosLock />
                    <span>Login / Signup</span>
                  </Link>
                )}

                {/* Register as Seller Button */}
                <a
                  target="_blank"
                  href="http://localhost:3001/register"
                  rel="noopener noreferrer">
                  <div className="px-6 py-2 bg-[#f07b28] shadow hover:shadow-red-500/50 text-white rounded-full flex justify-center items-center gap-2 hover:bg-red-600">
                    Join As a Seller
                  </div>
                </a>

                <Link
                  to="/donate-india"
                  className="flex items-center gap-2 text-slate-600 hover:text-[#059473] transition-all"
                >
                  <div className="px-6 py-2 bg-green-500 shadow hover:shadow-red-500/50 text-white rounded-full flex justify-center items-center gap-2 hover:bg-red-600">
                    <FaHandsHelping className="text-2xl" />
                    <span className="text-sm font-medium">Help India</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* mobile design */}
      <div className="hidden md-lg:block">
        <div
          onClick={() => setShowSidebar(true)}
          className={`fixed duration-200 transition-all ${
            showShidebar ? "invisible" : "visible"
          } hidden md-lg:block w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20 `}>
          {" "}
        </div>
        <div
          className={`w-[300px] z-[9999] transition-all duration-200 fixed ${
            showShidebar ? "-left-[300px]" : "left-0 top-0"
          } overflow-y-auto bg-white h-screen py-6 px-8 `}>
          <div className="flex justify-start flex-col gap-6">
            <Link to="/">
              <img src="http://localhost:3000/images/logo.png" alt="" />
            </Link>
            <div className="flex justify-start items-center gap-10">
              <div className="flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] after:absolute ">
                <img src="http://localhost:3000/images/language.png" alt="" />
                <span>
                  <IoMdArrowDropdown />
                </span>
                <ul className="absolute invisible transition-all top-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10">
                  <li>Arabic</li>
                  <li>English</li>
                </ul>
              </div>
              {userInfo ? (
                <Link
                  className="flex cursor-pointer justify-center items-center gap-2 text-sm text-black"
                  to="/dashboard"
                >
                  <span><FaUserCog /></span>
                  <span>{displayName}</span>
                </Link>
              ) : (
                <Link
                  className="flex cursor-pointer justify-center items-center gap-2 text-sm text-black"
                  to="/login"
                >
                  <span><IoIosLock /></span>
                  <span>Login</span>
                </Link>
              )}
            </div>

            <ul className="flex flex-col justify-start items-start text-sm font-bold uppercase">
              <li>
                <Link
                  to="/"
                  className={`py-2 block ${
                    pathname === "/" ? "text-[#059473]" : "text-slate-600"
                  }`}>
                  Home
                </Link>
              </li>
              <li className="w-full">
                <div className="py-2 text-slate-600">Store</div>
                <ul className="pl-4">
                  <li>
                    <Link
                      to="/shops"
                      className="py-2 block text-slate-600">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/regional-products"
                      className="py-2 block text-slate-600">
                      Regional Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category"
                      className="py-2 block text-slate-600">
                      Shop by Category
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  to="/blog"
                  className={`py-2 block ${
                    pathname === "/blog" ? "text-[#059473]" : "text-slate-600"
                  }`}>
                  Blog
                </Link>
              </li>
              <li className="w-full">
                <div className="py-2 text-slate-600">Community</div>
                <ul className="pl-4">
                  <li>
                    <Link
                      to="/community"
                      className="py-2 block text-slate-600">
                      Community Groups
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/virtualevents"
                      className="py-2 block text-slate-600">
                      Virtual Events
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  to="/stories"
                  className={`py-2 block ${
                    pathname === "/stories" ? "text-[#059473]" : "text-slate-600"
                  }`}>
                  Stories
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header2;
