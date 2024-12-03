import React, { useEffect } from 'react';
import { FaEye } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_card,add_to_wishlist,messageClear } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';


const FeatureProducts = ({products}) => {


    const {errorMessage,successMessage } = useSelector(state => state.card)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {userInfo } = useSelector(state => state.auth)
    const add_card = (id) => {
        if (userInfo) {
            dispatch(add_to_card({
                userId: userInfo.id,
                quantity : 1,
                productId : id
            }))
        } else {
            navigate('/login')
        }
    }

    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())  
        } 
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        
    },[successMessage,errorMessage])

    const add_wishlist = (pro) => {
        dispatch(add_to_wishlist({
            userId: userInfo.id,
            productId: pro._id,
            name: pro.name,
            price: pro.price,
            image: pro.images[0],
            discount: pro.discount,
            rating: pro.rating,
            slug: pro.slug
        }))
    }
    return (
        <div className='bg-gradient-to-b from-gray-50 to-white py-14'>
            <div className='max-w-[1400px] mx-auto px-8'>
                {/* Enhanced Header Section */}
                <div className='mb-12 text-center'>
                    <div className='inline-block mb-3'>
                        <div className='flex items-center justify-center space-x-2 bg-[#059473]/10 px-4 py-1.5 rounded-full
                            hover:bg-[#059473]/20 transition-all duration-300 cursor-pointer'>
                            <span className='text-[#059473] text-xs font-bold tracking-[0.2em] uppercase'>
                                Premium Collection
                            </span>
                        </div>
                    </div>
                    <h2 className='text-3xl font-bold text-gray-800 mb-3 hover:text-[#059473] transition-colors duration-300'>
                        Featured Products
                    </h2>
                    <div className='w-16 h-0.5 bg-[#059473] mx-auto mb-3 transform hover:scale-x-150 transition-transform duration-300'></div>
                    <p className='text-gray-500 max-w-lg mx-auto text-sm'>
                        Discover our handpicked selection of premium Indian products
                    </p>
                </div>
                {/* Enhanced Products Grid */}
                <div className='grid grid-cols-4 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6'>
                    {products.map((p, i) => (
                        <div key={i} className='group relative bg-white rounded-xl overflow-hidden 
                            hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 
                            hover:-translate-y-1 border border-gray-100'>
                            {/* Enhanced Discount Badge */}
                            {p.discount && (
                                <div className='absolute top-3 left-3 z-10'>
                                    <div className='bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full
                                        shadow-lg transform hover:scale-110 transition-transform duration-300'>
                                        {p.discount}% OFF
                                    </div>
                                </div>
                            )}

                            {/* Image Container with Reduced Height */}
                            <div className='relative aspect-[3/3.5] overflow-hidden bg-gray-100'>
                                <img 
                                    className='w-full h-full object-cover transform transition-all duration-700 
                                        group-hover:scale-105 group-hover:brightness-[1.02]' 
                                    src={p.images[0]} 
                                    alt={p.name} 
                                />
                                
                                {/* Enhanced Overlay with Actions */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent 
                                    opacity-0 group-hover:opacity-100 transition-all duration-300'>
                                    <div className='absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 
                                        transform translate-y-10 group-hover:translate-y-0 transition-all duration-500'>
                                        <button onClick={() => add_wishlist(p)} 
                                            className='w-8 h-8 bg-white/90 rounded-full flex items-center justify-center 
                                                text-gray-700 hover:bg-[#059473] hover:text-white transition-all duration-300 
                                                hover:scale-110 shadow-[0_2px_10px_rgba(0,0,0,0.1)]'>
                                            <FaRegHeart className='text-sm' />
                                        </button>
                                        <Link to={`/product/details/${p.slug}`} 
                                            className='w-8 h-8 bg-white/90 rounded-full flex items-center justify-center 
                                                text-gray-700 hover:bg-[#059473] hover:text-white transition-all duration-300 
                                                hover:scale-110 shadow-[0_2px_10px_rgba(0,0,0,0.1)]'>
                                            <FaEye className='text-sm' />
                                        </Link>
                                        <button onClick={() => add_card(p._id)} 
                                            className='w-8 h-8 bg-white/90 rounded-full flex items-center justify-center 
                                                text-gray-700 hover:bg-[#059473] hover:text-white transition-all duration-300 
                                                hover:scale-110 shadow-[0_2px_10px_rgba(0,0,0,0.1)]'>
                                            <FiShoppingCart className='text-sm' />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Product Info */}
                            <div className='p-4'>
                                <Link to={`/product/details/${p.slug}`}>
                                    <h3 className='font-medium text-gray-700 text-sm mb-2 hover:text-[#059473] 
                                        transition-colors duration-300 line-clamp-1'>
                                        {p.name}
                                    </h3>
                                </Link>
                                
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-1.5'>
                                        <span className='text-[#059473] font-bold text-base'>
                                            ₹{p.price}
                                        </span>
                                        {p.discount && (
                                            <span className='text-gray-400 line-through text-xs'>
                                                ₹{Math.round(p.price * (1 + p.discount/100))}
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Rating ratings={p.rating} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeatureProducts;