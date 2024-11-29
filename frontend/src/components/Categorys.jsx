import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css'
import { useSelector } from 'react-redux';
const Categorys = () => {

    const {categorys} = useSelector(state => state.home)

    
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    }

    return (
        <div className='bg-[#f8fafc] py-16'>
            <div className='max-w-[1600px] mx-auto px-6'>
                <div className='mb-12 text-center'>
                    <div className='inline-block mb-4'>
                        <div className='flex items-center justify-center space-x-3 bg-[#059473]/10 px-4 py-1.5 rounded-full'>
                            <span className='text-[#059473] text-xs font-bold tracking-[0.2em] uppercase'>
                                Authentic Indian Heritage
                            </span>
                        </div>
                    </div>
                    <h2 className='text-4xl font-bold text-gray-800 leading-tight mb-3'>
                        Traditional Treasures
                    </h2>
                    <div className='flex flex-col gap-2'>
                        <p className='text-gray-600 max-w-2xl mx-auto text-base font-medium'>
                            Bringing the essence of India to your doorstep
                        </p>
                        <p className='text-gray-500 max-w-2xl mx-auto text-sm'>
                            Curated collection of authentic Indian ethnic wear, crafts, and traditional products, 
                            carefully sourced from artisans across India
                        </p>
                    </div>
                </div>

                <div className='relative px-4'>
                    <Carousel
                        autoPlay={true}
                        infinite={true}
                        arrows={true}
                        responsive={responsive}
                        transitionDuration={500}
                        autoPlaySpeed={4000}
                        className='py-8'
                        customLeftArrow={<CustomArrow direction="left" />}
                        customRightArrow={<CustomArrow direction="right" />}
                    >
                        {categorys.map((c, i) => (
                            <Link 
                                key={i} 
                                to={`/products?category=${c.name}`}
                                className='block px-2'
                            >
                                <div className='relative group cursor-pointer'>
                                    <div className='relative h-[320px] rounded-xl overflow-hidden transform transition-all duration-500 
                                        group-hover:shadow-[0_15px_35px_rgba(5,148,115,0.2)]'>
                                        <img 
                                            src={c.image} 
                                            alt={c.name}
                                            className='w-full h-full object-cover transform transition-transform duration-700 
                                                group-hover:scale-105 filter brightness-100 group-hover:brightness-105'
                                        />
                                        
                                        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 
                                            opacity-80 group-hover:opacity-90 transition-opacity duration-500'></div>
                                        
                                        <div className='absolute bottom-0 left-0 right-0 p-6'>
                                            <span className='inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white 
                                                text-xs mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 
                                                group-hover:opacity-100 transition-all duration-500 border border-white/30
                                                hover:bg-white/30'>
                                                Explore Heritage →
                                            </span>
                                            
                                            <h3 className='text-white text-xl font-bold transform transition-all duration-500 
                                                group-hover:translate-y-[-8px] drop-shadow-lg'>
                                                {c.name}
                                            </h3>
                                            
                                            <div className='w-0 h-0.5 bg-white transition-all duration-500 group-hover:w-1/4'></div>
                                        </div>

                                        <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent 
                                            via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 
                                            transition-transform duration-500'></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </Carousel>        
                </div>
            </div>
        </div>
    );
};

const CustomArrow = ({ direction, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`
                absolute ${direction === 'left' ? 'left-0' : 'right-0'} 
                top-1/2 -translate-y-1/2 
                w-14 h-14 
                bg-white/95
                rounded-full 
                shadow-lg 
                flex items-center justify-center 
                transition-all duration-300
                hover:bg-[#059473] hover:text-white
                hover:scale-110
                hover:shadow-[0_0_25px_rgba(5,148,115,0.35)]
                ${direction === 'left' ? '-left-7' : '-right-7'}
                z-10
                border border-gray-100
            `}
        >
            {direction === 'left' ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                : 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            }
        </button>
    );
};

export default Categorys;