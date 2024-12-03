// frontend/src/components/survey/UserSurvey.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitSurvey } from '../../store/reducers/surveyReducer';

const UserSurvey = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        originRegion: '',
        originState: '',
        currentCountry: '',
        annualIncome: '',
        productPreferences: [],
        festivals: [],
        budgetRange: '',
        shoppingFrequency: ''
    });

    const regions = {
        North: ['Delhi', 'Haryana', 'Punjab', /* ... */],
        South: ['Karnataka', 'Kerala', 'Tamil Nadu', /* ... */],
        East: ['West Bengal', 'Odisha', 'Bihar', /* ... */],
        West: ['Maharashtra', 'Gujarat', 'Goa', /* ... */],
        Central: ['Madhya Pradesh', 'Chhattisgarh']
    };

    const productCategories = [
        'Indian Arts',
        'Indian Spices',
        'Pooja Items',
        'Regional Products',
        'Festival Special'
    ];

    const festivals = [
        'Diwali',
        'Holi',
        'Navratri',
        'Durga Puja',
        'Onam',
        'Pongal',
        'Ganesh Chaturthi'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(submitSurvey(formData));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Help us personalize your experience</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Region Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Origin Region in India</label>
                        <select 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.originRegion}
                            onChange={(e) => setFormData({...formData, originRegion: e.target.value})}
                            required
                        >
                            <option value="">Select Region</option>
                            {Object.keys(regions).map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Country</label>
                        <input 
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.currentCountry}
                            onChange={(e) => setFormData({...formData, currentCountry: e.target.value})}
                            required
                        />
                    </div>
                </div>

                {/* Income Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Annual Income Range (USD)</label>
                    <select 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={formData.annualIncome}
                        onChange={(e) => setFormData({...formData, annualIncome: e.target.value})}
                        required
                    >
                        <option value="">Select Income Range</option>
                        <option value="0-30000">Under $30,000</option>
                        <option value="30000-60000">$30,000 - $60,000</option>
                        <option value="60000-100000">$60,000 - $100,000</option>
                        <option value="100000+">Above $100,000</option>
                    </select>
                </div>

                {/* Product Preferences */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Categories of Interest</label>
                    <div className="grid grid-cols-2 gap-2">
                        {productCategories.map(category => (
                            <div key={category} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={category}
                                    value={category}
                                    checked={formData.productPreferences.includes(category)}
                                    onChange={(e) => {
                                        const updatedPreferences = e.target.checked
                                            ? [...formData.productPreferences, category]
                                            : formData.productPreferences.filter(p => p !== category);
                                        setFormData({...formData, productPreferences: updatedPreferences});
                                    }}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={category} className="ml-2 text-sm text-gray-700">{category}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Submit Survey
                </button>
            </form>
        </div>
    );
};

export default UserSurvey;