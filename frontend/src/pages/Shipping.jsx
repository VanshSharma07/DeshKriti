import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { place_order } from "../store/reducers/orderReducer";
import Header2 from "../components/Header2";

const COUNTRY_SHIPPING_RATES = {
  'Afghanistan': 1395,
  'Albania': 1840,
  'Algeria': 1510,
  'Argentina': 1510,
  'Armenia': 1115,
  'Australia': 1340,
  'Austria': 2250,
  'Azerbaijan': 1115,
  'Bahrain': 880,
  'Bangladesh': 750,
  'Belarus': 1340,
  'Belgium': 2250,
  'Bhutan': 750,
  'Brazil': 1510,
  'Brunei': 1175,
  'Bulgaria': 1840,
  'Cambodia': 850,
  'Canada': 1820,
  'Chile': 1510,
  'China': 850,
  'Colombia': 1510,
  'Croatia': 1840,
  'Cyprus': 1340,
  'Czech Republic': 2250,
  'Denmark': 2250,
  'Egypt': 1395,
  'Estonia': 2250,
  'Ethiopia': 1510,
  'Fiji': 1340,
  'Finland': 2250,
  'France': 2250,
  'Georgia': 1115,
  'Germany': 2250,
  'Ghana': 1510,
  'Greece': 2250,
  'Hong Kong': 850,
  'Hungary': 2250,
  'Iceland': 2250,
  'Indonesia': 850,
  'Iran': 880,
  'Iraq': 880,
  'Ireland': 2250,
  'Israel': 1340,
  'Italy': 2250,
  'Japan': 1175,
  'Jordan': 880,
  'Kazakhstan': 1115,
  'Kenya': 1510,
  'Kuwait': 880,
  'Kyrgyzstan': 1115,
  'Laos': 850,
  'Latvia': 2250,
  'Lebanon': 880,
  'Lithuania': 2250,
  'Luxembourg': 2250,
  'Malaysia': 850,
  'Maldives': 750,
  'Malta': 2250,
  'Mauritius': 1510,
  'Mexico': 1820,
  'Moldova': 1840,
  'Mongolia': 1175,
  'Morocco': 1510,
  'Myanmar': 850,
  'Nepal': 750,
  'Netherlands': 2250,
  'New Zealand': 1340,
  'Niger': 1510,
  'Nigeria': 1510,
  'North Macedonia': 1265,
  'Norway': 2250,
  'Oman': 1395,
  'Pakistan': 880,
  'Panama': 1810,
  'Papua New Guinea': 1585,
  'Philippines': 1180,
  'Poland': 2250,
  'Portugal': 1115,
  'Qatar': 1340,
  'Romania': 1840,
  'Russian Federation': 1340,
  'Rwanda': 1340,
  'Saudi Arabia': 1535,
  'Senegal': 1270,
  'Singapore': 1175,
  'South Africa': 1510,
  'Spain (Canary Island)': 2760,
  'Spain (Rest of Spain)': 2425,
  'Sri Lanka': 750,
  'Sudan': 1420,
  'Sweden': 2250,
  'Switzerland': 1910,
  'Taiwan': 910,
  'Tanzania': 1090,
  'Thailand': 1095,
  'Tunisia': 1345,
  'Turkey': 1030,
  'Uganda': 1420,
  'Ukraine': 1895,
  'United Arab Emirates': 1420,
  'United States of America': 1820,
  'Vietnam': 850,
  'Yemen': 880,
  'Zimbabwe': 1510
};

const CUSTOMS_RATE = 0.18; // 18% customs duty
const WEIGHT_RATE = 500; // Additional cost per kg in INR
const INSURANCE_RATE = 0.01; // 1% of declared value

const Shipping = () => {
  const dispatch = useDispatch();
  const {
    state: { products, price, shipping_fee, items },
  } = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [res, setRes] = useState(false);
  const [state, setState] = useState({
    name: "",
    address: "",
    phone: "",
    post: "",
    province: "",
    city: "",
    area: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    email: "",
    country: "India",
    packageDescription: "",
    weight: "",
    hsnCode: "",
    declaredValue: "",
    shippingService: "",
    tin: "",
    alternateContact: "",
    specialInstructions: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdditionalInfo = (e) => {
    setAdditionalInfo({
      ...additionalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const save = (e) => {
    e.preventDefault();
    const { name, address, phone, post, province, city, area } = state;
    if (name && address && phone && post && province && city && area) {
      setRes(true);
    }
  };

  const placeOrder = () => {
    dispatch(
      place_order({
        price,
        products,
        shipping_fee,
        items,
        shippingInfo: state,
        userId: userInfo.id,
        navigate,
      })
    );
  };

  const calculateShippingCharges = () => {
    const weight = parseFloat(additionalInfo.weight) || 0;
    const declaredValue = parseFloat(additionalInfo.declaredValue) || price;
    
    const baseShipping = COUNTRY_SHIPPING_RATES[additionalInfo.country] || 1500;
    const weightCharge = weight > 1 ? (weight - 1) * WEIGHT_RATE : 0;
    const customsDuty = declaredValue * CUSTOMS_RATE;
    const insurance = declaredValue * INSURANCE_RATE;
    
    return {
      baseShipping,
      weightCharge,
      customsDuty,
      insurance,
      total: baseShipping + weightCharge + customsDuty + insurance
    };
  };

  return (
    <div className="w-full">
      <Header2 />
      <section className='bg-[#f8f9fa] h-[220px] mt-6 relative'>
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-[#f26522] to-[#004a8f]">
          <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className="flex flex-col justify-center items-center h-full w-full text-white space-y-4">
              <div className="flex items-center gap-5">
                <img 
                  src="/images/logoDk.png" 
                  alt="DeshKriti Logo" 
                  className="h-12 md:h-10 sm:h-8"
                />
                <div className="h-10 w-0.5 bg-white/30"></div>
                <h1 className="text-4xl md:text-3xl sm:text-2xl font-bold tracking-wide">DeshKriti</h1>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <h2 className="text-3xl md:text-2xl sm:text-xl font-semibold">International Shipping</h2>
                
                <div className="flex items-center gap-3 text-base sm:text-sm">
                  <Link to="/" className="hover:text-orange-200 transition-colors">
                    Home
                  </Link>
                  <span className="pt-1">
                    <IoIosArrowForward />
                  </span>
                  <span>Shipping</span>
                </div>
              </div>

              <p className="text-base sm:text-sm text-orange-100 font-light">
                Trusted Worldwide Delivery by India Post
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="h-2 bg-[#f26522]"></div>
          <div className="h-1 bg-[#004a8f]"></div>
        </div>
      </section>

      <section className="bg-[#eeeeee]">
        <div className="w-[85%] lg:w[90%] md:w-[90%] sm:w-[90%] mx-auto py-16">
          <div className="w-full flex flex-wrap">
            <div className="w-[67%] md-lg:w-full">
              <div className="flex flex-col gap-3">
                <div className="bg-white p-6 shadow-sm rounded-md">
                  <h2 className="text-slate-600 font-bold text-xl pb-3">
                    Shipping Information
                  </h2>

                  {!res && (
                    <>
                      <form onSubmit={save}>
                        <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="name">Name </label>
                            <input
                              onChange={inputHandle}
                              value={state.name}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200
                                            outline-none focus:border-green-500 rounded-md"
                              name="name"
                              id="name"
                              placeholder="Name"
                            />
                          </div>

                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="address">Address </label>
                            <input
                              onChange={inputHandle}
                              value={state.address}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200
                                            outline-none focus:border-green-500 rounded-md"
                              name="address"
                              id="address"
                              placeholder="Address"
                            />
                          </div>
                        </div>

                        <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="phone">Phone </label>
                            <input
                              onChange={inputHandle}
                              value={state.phone}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200
                                            outline-none focus:border-green-500 rounded-md"
                              name="phone"
                              id="phone"
                              placeholder="Phone"
                            />
                          </div>

                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="post">Postal code </label>
                            <input
                              onChange={inputHandle}
                              value={state.post}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200
                                            outline-none focus:border-green-500 rounded-md"
                              name="post"
                              id="post"
                              placeholder="Postal code"
                            />
                          </div>
                        </div>

                        <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="province">Governorate </label>
                            <input
                              onChange={inputHandle}
                              value={state.province}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200
                                            outline-none focus:border-green-500 rounded-md"
                              name="province"
                              id="province"
                              placeholder="Governorate"
                            />
                          </div>

                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="city">City </label>
                            <input
                              onChange={inputHandle}
                              value={state.city}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200
                                            outline-none focus:border-green-500 rounded-md"
                              name="city"
                              id="city"
                              placeholder="City"
                            />
                          </div>
                        </div>

                        <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="area">Neighborhood </label>
                            <input
                              onChange={inputHandle}
                              value={state.area}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200
                                            outline-none focus:border-green-500 rounded-md"
                              name="area"
                              id="area"
                              placeholder="Neighborhood"
                            />
                          </div>

                          <div className="flex flex-col gap-1 mt-7 mb-2 w-full">
                            <button
                              className="px-3 py-2 rounded-sm hover:shadow-green-500/50
                                            hover:shadow-lg bg-green-500 text-white">
                              Save Changes
                            </button>
                          </div>
                        </div>

                        <div className="mt-6 border-t pt-4">
                          <h3 className="text-slate-600 font-semibold mb-3">Additional Shipping Details</h3>
                          
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="email">Email Address</label>
                              <input
                                onChange={handleAdditionalInfo}
                                value={additionalInfo.email}
                                type="email"
                                className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                                name="email"
                                placeholder="Email for tracking updates"
                              />
                            </div>

                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="country">Country</label>
                              <select
                                onChange={handleAdditionalInfo}
                                value={additionalInfo.country}
                                className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                                name="country"
                              >
                                {Object.keys(COUNTRY_SHIPPING_RATES).sort().map((country) => (
                                  <option key={country} value={country}>
                                    {country}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="packageDescription">Package Description</label>
                              <textarea
                                onChange={handleAdditionalInfo}
                                value={additionalInfo.packageDescription}
                                className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                                name="packageDescription"
                                placeholder="Detailed description of contents"
                                rows="2"
                              />
                            </div>
                          </div>

                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="weight">Weight (kg)</label>
                              <input
                                onChange={handleAdditionalInfo}
                                value={additionalInfo.weight}
                                type="number"
                                step="0.01"
                                className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                                name="weight"
                                placeholder="Package weight in kg"
                              />
                            </div>

                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="hsnCode">HSN Code</label>
                              <input
                                onChange={handleAdditionalInfo}
                                value={additionalInfo.hsnCode}
                                type="text"
                                className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md"
                                name="hsnCode"
                                placeholder="HSN Code for commercial shipments"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </>
                  )}

                  {res && (
                    <div className="flex flex-col gap-1">
                      <h2 className="text-slate-600 font-semibold pb-2">
                        Deliver To {state.name}
                      </h2>
                      <p>
                        <span
                          className="bg-blue-200 text-blue-800 text-sm font-medium mr-2 px-2
                        py-1 rounded">
                          Home
                        </span>
                        <span>
                          Phone: {state.phone} , Postal code: {state.post} ,
                          Governorate: {state.province}, City: {state.city} ,
                          Neighborhood: {state.area}{" "}
                        </span>
                        <span
                          onClick={() => setRes(false)}
                          className="text-indigo-500 cursor-pointer">
                          Change{" "}
                        </span>
                      </p>
                      <p className="text-slate-600 text-sm">
                        Email To fourat.toumi@gmail.com
                      </p>
                    </div>
                  )}
                </div>

                {products.map((p, i) => (
                  <div key={i} className="flex bg-white p-4 flex-col gap-2">
                    <div className="flex justify-start items-center">
                      <h2 className="text-md text-slate-600 font-bold">
                        {p.shopName}
                      </h2>
                    </div>
                    {p.products.map((pt, i) => (
                      <div className="w-full flex flex-wrap">
                        <div className="flex sm:w-full gap-2 w-7/12">
                          <div className="flex gap-2 justify-start items-center">
                            <img
                              className="w-[80px] h-[80px]"
                              src={pt.productInfo.images[0]}
                              alt=""
                            />
                            <div className="pr-4 text-slate-600">
                              <h2 className="text-md font-semibold">
                                {pt.productInfo.name}
                              </h2>
                              <span className="text-sm">
                                {pt.productInfo.brand}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between w-5/12 sm:w-full sm:mt-3">
                          <div className="pl-4 sm:pl-0">
                            <h2 className="text-lg text-orange-500">
                              {pt.productInfo.price -
                                Math.floor(
                                  (pt.productInfo.price *
                                    pt.productInfo.discount) /
                                    100
                                )}{" "}
                              INR
                            </h2>
                            <p className="line-through">
                              {pt.productInfo.price} INR
                            </p>
                            <p>-{pt.productInfo.discount}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[33%] md-lg:w-full">
              <div className="pl-3 md-lg:pl-0 md-lg:mt-5">
                <div className="bg-white p-6 text-slate-600 flex flex-col gap-3 rounded-md shadow-sm">
                  <h2 className="text-xl font-bold border-b pb-3">Order Summary</h2>
                  
                  <div className="flex justify-between items-center">
                    <span>Items Subtotal ({items})</span>
                    <span>{price.toFixed(2)} INR</span>
                  </div>

                  <div className="border-t pt-3">
                    <h3 className="font-semibold mb-2">Shipping & Handling</h3>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>Base International Shipping</span>
                      <span>{calculateShippingCharges().baseShipping.toFixed(2)} INR</span>
                    </div>

                    {additionalInfo.weight > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span>Weight Charge ({additionalInfo.weight} kg)</span>
                        <span>{calculateShippingCharges().weightCharge.toFixed(2)} INR</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-3">
                    <h3 className="font-semibold mb-2">Estimated Taxes & Duties</h3>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>Customs Duty (18%)</span>
                      <span>{calculateShippingCharges().customsDuty.toFixed(2)} INR</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span>Insurance (1%)</span>
                      <span>{calculateShippingCharges().insurance.toFixed(2)} INR</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 mt-2">
                    <div className="flex justify-between items-center font-bold">
                      <span>Order Total</span>
                      <span className="text-lg text-[#059473]">
                        {(price + calculateShippingCharges().total).toFixed(2)} INR
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      * Final charges may vary based on actual weight and customs assessment
                    </p>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={res ? false : true}
                    className={`mt-4 px-5 py-3 rounded-md hover:shadow-red-500/50 hover:shadow-lg ${
                      res ? "bg-red-500" : "bg-red-300"
                    } text-sm text-white uppercase font-semibold`}>
                    Place Order
                  </button>
                </div>

                <div className="bg-white p-6 mt-4 text-slate-600 rounded-md shadow-sm">
                  <h3 className="font-semibold mb-2">Shipping Information</h3>
                  <ul className="text-sm space-y-2">
                    <li>• Delivery time: 7-14 business days</li>
                    <li>• Tracking available</li>
                    <li>• Insurance included for declared value</li>
                    <li>• Customs documentation provided</li>
                  </ul>
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

export default Shipping;
