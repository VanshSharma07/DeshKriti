import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header2 from '../components/Header2';
import Footer from '../components/Footer';

const CategoryPage = () => {
    const { categorys } = useSelector(state => state.home);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header2/>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#059473] to-[#07b18d] text-white py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Shop By Category
                    </h1>
                    <p className="text-center text-lg max-w-2xl mx-auto">
                        Explore our wide range of categories and find exactly what you're looking for
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="container mx-auto px-8 md:px-16 lg:px-32 py-8">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    {categorys.map((category, index) => (
                        <Link 
                            to={`/products?category=${category.name}`}
                            key={index}
                            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mx-auto w-full max-w-2xl"
                        >
                            <div className="h-[calc(100vh-300px)] md:h-[calc(100vh-350px)] lg:h-[calc(100vh-250px)] overflow-hidden">
                                <img 
                                    src={category.image} 
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-white text-2xl font-bold mb-3">
                                            {category.name}
                                        </h3>
                                        <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-base">
                                            Shop Now →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default CategoryPage;
