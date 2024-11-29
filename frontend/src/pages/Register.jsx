import React, { useEffect, useState } from "react";
import Header2 from "../components/Header2";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { customer_register, messageClear } from "../store/reducers/authReducer";
import toast from "react-hot-toast";
import FadeLoader from "react-spinners/FadeLoader";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Country } from 'country-state-city';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage, userInfo } = useSelector(
    (state) => state.auth
  );

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    phoneNumber: ''
  });

  const [countries] = useState(Country.getAllCountries());
  const [coordinates, setCoordinates] = useState([0, 0]);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (value) => {
    setState({
      ...state,
      phoneNumber: value
    });
  };

  const validateForm = () => {
    const { firstName, email, password, confirmPassword, country, phoneNumber } = state;
    
    if (!firstName.trim()) {
      toast.error("First Name is required");
      return false;
    }
    
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return false;
    }
    
    if (!country) {
      toast.error("Please select your country");
      return false;
    }
    
    if (!phoneNumber) {
      toast.error("Phone number is required");
      return false;
    }
    
    return true;
  };

  useEffect(() => {
    // Get user's geolocation when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates([
            position.coords.longitude,
            position.coords.latitude
          ]);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Location access denied. Using default location.');
        }
      );
    }
  }, []);

  const register = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const { confirmPassword, ...registerData } = state;
    dispatch(customer_register({
      ...registerData,
      coordinates
    }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate('/login');
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  return (
    <div>
      {loader && (
        <div className="w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]">
          <FadeLoader />
        </div>
      )}

      <Header2 />

      <div className="bg-slate-200 mt-4">
        <div className="w-full justify-center items-center p-10">
          <div className="grid grid-cols-2 w-[60%] mx-auto bg-white rounded-md">
            <div className="px-8 py-8">
              <h2 className="text-center w-full text-xl text-slate-600 font-bold">
                Register
              </h2>

              <div>
                <form onSubmit={register} className="text-slate-600">
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1 mb-2 w-full">
                      <label htmlFor="firstName">First Name*</label>
                      <input
                        onChange={inputHandle}
                        value={state.firstName}
                        className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1 mb-2 w-full">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        onChange={inputHandle}
                        value={state.lastName}
                        className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="email">Email*</label>
                    <input
                      onChange={inputHandle}
                      value={state.email}
                      className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="password">Password*</label>
                    <input
                      onChange={inputHandle}
                      value={state.password}
                      className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                      type="password"
                      name="password"
                      placeholder="Password"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="confirmPassword">Confirm Password*</label>
                    <input
                      onChange={inputHandle}
                      value={state.confirmPassword}
                      className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="country">Country*</label>
                    <select
                      onChange={inputHandle}
                      value={state.country}
                      className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                      name="country"
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 mb-4">
                    <label htmlFor="phoneNumber">Phone Number*</label>
                    <PhoneInput
                      country={'us'}
                      value={state.phoneNumber}
                      onChange={handlePhoneChange}
                      inputClass="!w-full"
                      containerClass="phone-input"
                    />
                  </div>

                  <button className="px-8 w-full py-2 bg-[#059473] shadow-lg hover:shadow-green-500/40 text-white rounded-md">
                    Register
                  </button>
                </form>

                <div className="flex justify-center items-center py-2">
                  <div className="h-[1px] bg-slate-300 w-[95%]"></div>
                  <span className="px-3 text-slate-600">Or</span>
                  <div className="h-[1px] bg-slate-300 w-[95%]"></div>
                </div>

                <div className="text-center text-slate-600 pt-1">
                  <p>
                    Already have an account?{" "}
                    <Link className="text-blue-500" to="/login">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-full py-4 pr-4">
              <img src="http://localhost:3000/images/login.jpg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
