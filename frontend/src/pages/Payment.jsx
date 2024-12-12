import React, { useState } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { useLocation } from 'react-router-dom';
import Stripe from '../components/Stripe';
import Header2 from '../components/Header2';

const Payment = () => {
    const { state: {price,items,orderId}} = useLocation()
    const [paymentMethod, setPaymentMethod] = useState('stripe')

    return (
        <div>
            <Header2/>
            <section className='bg-[#eeeeee]'>
                <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 mt-4'>
                    <div className='flex flex-wrap md:flex-col-reverse'>
                        <div className='w-7/12 md:w-full'>
                            <div className='pr-2 md:pr-0'>
                                <div className='bg-white p-6'>
                                    <div className='flex items-center justify-center mb-8'>
                                        <div className='flex flex-col items-center gap-2'>
                                            <img 
                                                src="http://localhost:3000/images/payment/stripe.png" 
                                                alt="Stripe" 
                                                className="h-12"
                                            />
                                            <span className='text-slate-600 font-medium'>Secure Payment via Stripe</span>
                                        </div>
                                    </div>
                                    <Stripe orderId={orderId} price={price} />
                                </div>
                            </div>
                        </div>

                        <div className='w-5/12 md:w-full'>
                            <div className='pl-2 md:pl-0 md:mb-0'>
                                <div className='bg-white shadow p-5 text-slate-600 flex flex-col gap-3'>
                                    <h2 className='font-bold text-lg'>Order Summary</h2>
                                    <div className='flex justify-between items-center'>
                                        <span>{items} Items and Shipping Fee Included</span>
                                        <span>{price} INR</span>
                                    </div>
                                    <div className='flex justify-between items-center font-semibold'>
                                        <span>Total Amount</span>
                                        <span className='text-lg text-green-600'>{price} INR</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default Payment;