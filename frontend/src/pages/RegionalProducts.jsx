import React, { useEffect, useState } from 'react';
import Header2 from '../components/Header2';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { query_products } from '../store/reducers/homeReducer';
import ShopProducts from '../components/products/ShopProducts';

const RegionalProducts = () => {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.home);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [stateProducts, setStateProducts] = useState({});

    const regions = {
        'North': [
            'Delhi', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
            'Punjab', 'Rajasthan', 'Uttarakhand', 'Uttar Pradesh','Ladakh'
        ],
        'South': [
            'Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana'
        ],
        'East': [
            'Bihar', 'Jharkhand', 'Odisha', 'West Bengal'
        ],
        'West': [
            'Gujarat', 'Goa', 'Maharashtra'
        ],
        'Central': [
            'Madhya Pradesh', 'Chhattisgarh'
        ],
        'Northeast': [
            'Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya',
            'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'
        ]
    };

    useEffect(() => {
        dispatch(query_products({
            region: selectedRegion.toLowerCase(),
            state: selectedState.toLowerCase()
        }));
    }, [selectedRegion, selectedState]);

    useEffect(() => {
        const groupProductsByState = () => {
            const grouped = {};
            products.forEach(product => {
                const state = product.state?.toLowerCase();
                if (state) {
                    if (!grouped[state]) {
                        grouped[state] = [];
                    }
                    grouped[state].push(product);
                }
            });
            setStateProducts(grouped);
        };
        groupProductsByState();
    }, [products]);

    const filteredProducts = (products) => {
        if (!searchQuery) return products;
        return products.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    return (
        <div>
            <Header2 />
            <div className="w-[85%] mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Regional Products of India</h1>
                
                {/* Search and Filter Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Box */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                🔍
                            </span>
                        </div>

                        {/* Region Dropdown */}
                        <select 
                            value={selectedRegion}
                            onChange={(e) => {
                                setSelectedRegion(e.target.value);
                                setSelectedState('');
                            }}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Regions</option>
                            {Object.keys(regions).map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>

                        {/* State Dropdown */}
                        <select 
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={!selectedRegion}
                        >
                            <option value="">All States</option>
                            {selectedRegion && regions[selectedRegion].map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Products Display Section */}
                {Object.entries(regions)
                    .filter(([region]) => !selectedRegion || region === selectedRegion)
                    .map(([region, states]) => {
                        const statesWithProducts = states.filter(state => 
                            (!selectedState || state === selectedState) &&
                            stateProducts[state.toLowerCase()]?.length > 0
                        );

                        return statesWithProducts.length > 0 ? (
                            <div key={region} className="mb-12">
                                <h2 className="text-2xl font-bold mb-6 text-indigo-600">{region} India</h2>
                                <div className="space-y-8">
                                    {statesWithProducts.map(state => {
                                        const stateKey = state.toLowerCase();
                                        const stateProds = filteredProducts(stateProducts[stateKey] || []);
                                        
                                        return stateProds.length > 0 ? (
                                            <div key={state} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                <h3 className="text-xl font-semibold mb-4">{state}</h3>
                                                <div className="w-full">
                                                    <ShopProducts 
                                                        products={stateProds}
                                                        styles="grid"
                                                    />
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        ) : null;
                    })}
            </div>
            <Footer />
        </div>
    );
};

export default RegionalProducts;