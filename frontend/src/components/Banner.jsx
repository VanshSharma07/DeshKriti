import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Banner = () => {
    const banners = [
        'https://img.freepik.com/premium-vector/illustration-man-playing-tutari-sit-elephant-with-sketching-famous-monuments-yellow-turquoise-background-incredible-india_1302-23043.jpg?w=1380',
        '/images/banner/1.jpg',
        '/images/banner/2.jpg',
        // Add more banners as needed
    ];

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <div>
            <div className='w-full md-lg:mt-6'>
                <div className='w-[85%] lg:w-[90%] mx-auto'>
                    <div className='w-full flex flex-wrap md-lg:gap-8'>
                        <div className='w-full'>
                            <div className='my-8'>
                                <Carousel
                                    autoPlay={true}
                                    infinite={true}
                                    arrows={true}
                                    showDots={true}
                                    responsive={responsive}
                                >
                                    {banners.map((banner, i) => (
                                        <div key={i}>
                                            <img
                                                src={banner}
                                                alt={`Banner ${i + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover' // Ensures the image covers the container
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
