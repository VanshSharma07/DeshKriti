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

import { useDispatch, useSelector } from "react-redux";
import {
  get_card_products,
  get_wishlist_products,
} from "../store/reducers/cardReducer";

const Header = () => {
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

  const redirect_card_page = () => {
    if (userInfo) {
      navigate("/card");
    } else {
      navigate("/login");
    }
  };
  const search = () => {
    navigate(`/products/search?category=${category}&&value=${searchValue}`);
  };
  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id));
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [userInfo]);
  return (
    <div className="w-full bg-white">
      <div className="w-white">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="h-[80px] md-lg:h-[100px] flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <Link to="/">
                <img
                  src="http://localhost:3000/images/logo.png"
                  alt="Logo"
                  className="w-24 h-auto"
                />
              </Link>
              <div
                className="justify-center items-center w-[30px] h-[30px] bg-white text-slate-600 border border-slate-600 rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden"
                onClick={() => setShowSidebar(false)}>
                <span>
                  <FaListUl />
                </span>
              </div>
            </div>

            {/* Navigation and User Actions */}
            <div className="flex items-center justify-between flex-1">
              {/* Navigation Menu */}
              <ul className="flex items-center gap-8 text-sm font-bold uppercase md-lg:hidden mx-8">
                <li>
                  <Link
                    className={`p-2 ${
                      pathname === "/" ? "text-[#059473]" : "text-slate-600"
                    }`}
                    to="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className={`p-2 ${
                      pathname === "/shops"
                        ? "text-[#059473]"
                        : "text-slate-600"
                    }`}
                    to="/shops">
                    Shop
                  </Link>
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
                      pathname === "/about"
                        ? "text-[#059473]"
                        : "text-slate-600"
                    }`}
                    to="/about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    className={`p-2 ${
                      pathname === "/contact"
                        ? "text-[#059473]"
                        : "text-slate-600"
                    }`}
                    to="/contact">
                    Contact Us
                  </Link>
                </li>
              </ul>

              {/* User Actions */}
              <div className="flex  items-center gap-4">
                {/* Login/Profile Button */}
                {userInfo ? (
                  <Link
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-black border rounded-full hover:bg-gray-100"
                    to="/dashboard">
                    <FaUserCog />
                    <span>{userInfo.name}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-black border rounded-full hover:bg-gray-100">
                    <IoIosLock />
                    <span>Login / Signup</span>
                  </Link>
                )}

                {/* Register as Seller Button */}
                <a
                  target="_blank"
                  href="http://localhost:3001/register"
                  rel="noopener noreferrer">
                  <div className="px-6 py-2 bg-[#ad2cc4] shadow hover:shadow-red-500/50 text-white rounded-md flex justify-center items-center gap-2">
                    Join As a Seller
                  </div>
                </a>
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
                  to="/dashboard">
                  <span>
                    {" "}
                    <FaUserCog />{" "}
                  </span>
                  <span>{userInfo.name}</span>
                </Link>
              ) : (
                <Link
                  className="flex cursor-pointer justify-center items-center gap-2 text-sm text-black"
                  to="/login">
                  <span>
                    {" "}
                    <IoIosLock />{" "}
                  </span>
                  <span>Login </span>
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
              <li>
                <Link
                  to="/shops"
                  className={`py-2 block ${
                    pathname === "/shops" ? "text-[#059473]" : "text-slate-600"
                  }`}>
                  Shop
                </Link>
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
              <li>
                <Link
                  to="/about"
                  className={`py-2 block ${
                    pathname === "/about" ? "text-[#059473]" : "text-slate-600"
                  }`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`py-2 block ${
                    pathname === "/contact"
                      ? "text-[#059473]"
                      : "text-slate-600"
                  }`}>
                  Contact Us
                </Link>
              </li>
            </ul>

            <div className="flex justify-start items-center gap-4 text-black">
              <a href="https://www.facebook.com/fourat.toumi.71/">
                <FaFacebook />
              </a>
              <a href="https://x.com/fourat_toumi_">
                <FaSquareXTwitter />{" "}
              </a>
              <a href="https://www.linkedin.com/in/fourat-toumi-7679232a7/">
                <FaLinkedin />
              </a>
              <a href="https://github.com/ToumiFourat">
                <FaGithub />{" "}
              </a>
            </div>

            <div className="w-full flex justify-end md-lg:justify-start gap-3 items-center">
              <div className="w-[48px] h-[48px] rounded-full flex bg-[#f5f5f5] justify-center items-center ">
                <span>
                  <FaPhoneAlt />
                </span>
              </div>
              <div className="flex justify-end flex-col gap-1">
                <h2 className="text-sm font-medium text-slate-700">
                  +216 70 295 460
                </h2>
                <span className="text-xs">Support 24/7</span>
              </div>
            </div>

            <ul className="flex flex-col justify-start items-start gap-3 text-[#1c1c1c]">
              <li className="flex justify-start items-center gap-2 text-sm">
                <span>
                  <MdMarkEmailUnread />
                </span>
                <span>support@bimastore.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-[85%] lg:w-[90%] mx-auto mt-8">
        <div className="flex w-full flex-wrap md-lg:gap-8">
          <div className="w-3/12 md-lg:w-full">
            <div className="bg-white relative">
              <div
                onClick={() => setCategoryShow(!categoryShow)}
                className="h-[50px] bg-[#059473] text-white flex justify-center md-lg:justify-between md-lg:px-6 items-center gap-3 font-bold text-md cursor-pointer">
                <div className="flex justify-center items-center gap-3">
                  <span>
                    <FaListUl />
                  </span>
                  <span>All Category </span>
                </div>
                <span className="pt-1">
                  <IoMdArrowDropdown />
                </span>
              </div>

              <div
                className={`${
                  categoryShow ? "h-0" : "h-[400px]"
                } overflow-hidden transition-all md-lg:relative duration-500 absolute z-[99999] bg-[#dbf3ed] w-full border-x`}>
                <ul className="py-2 text-slate-600 font-medium">
                  {categorys.map((c, i) => {
                    return (
                      <li
                        key={i}
                        className="flex justify-start items-center gap-2 px-[24px] py-[6px]">
                        <img
                          src={c.image}
                          className="w-[30px] h-[30px]
                            rounded-full overflow-hidden"
                          alt=""
                        />
                        <Link
                          to={`/products?category=${c.name}`}
                          className="text-sm block">
                          {c.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div className="w-9/12 pl-8 md-lg:pl-0 md-lg:w-full">
            <div className="flex flex-wrap w-full justify-between items-center md-lg:gap-6">
              <div className="w-8/12 md:w-full">
                <div className="flex items-center h-[50px] rounded-full bg-[#f8f8f8] shadow-inner pl-4 pr-2 relative">
                  {/* Category Dropdown */}
                  <div className="relative md:hidden after:absolute after:h-[25px] after:w-[1px] after:bg-[#afafaf] after:right-0 after:top-1/2 after:-translate-y-1/2 pr-4">
                    <select
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-[150px] text-slate-600 font-semibold bg-transparent outline-none border-none"
                      name=""
                      id="">
                      <option value="">Select Category</option>
                      {categorys.map((c, i) => (
                        <option key={i} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Search Input */}
                  <input
                    className="w-full bg-transparent text-slate-500 outline-none px-3 h-full"
                    onChange={(e) => setSearchValue(e.target.value)}
                    type="text"
                    name=""
                    id=""
                    placeholder="Search for Product"
                  />
                  {/* Search Button with Icon */}
                  <button
                    onClick={search}
                    className="text-gray-500 h-full flex items-center justify-center pr-3 pl-2 outline-none border-none bg-transparent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 10.5 18a7.5 7.5 0 0 0 6.15-3.35l4.35 4.35z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Icons Container */}
              <div className="flex mr-8 items-center gap-4">
                {/* Wishlist Icon */}
                <div
                  onClick={() =>
                    navigate(userInfo ? "/dashboard/my-wishlist" : "/login")
                  }
                  className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2] hover:bg-gray-300">
                  <span className="text-xl text-green-500">
                    <FaHeart />
                  </span>
                  {wishlist_count !== 0 && (
                    <div className="w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                      {wishlist_count}
                    </div>
                  )}
                </div>

                {/* Cart Icon */}
                <div
                  onClick={redirect_card_page}
                  className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2] hover:bg-gray-300 ml-1">
                  <span className="text-xl text-green-500">
                    <PiShoppingCartFill />
                  </span>
                  {card_product_count !== 0 && (
                    <div className="w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                      {card_product_count}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
