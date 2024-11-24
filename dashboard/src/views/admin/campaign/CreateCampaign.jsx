import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCampaign } from '../../../store/Reducers/campaignReducer';
import { FaCloudUploadAlt, FaImages, FaFileUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCampaign = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        targetAmount: '',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        category: '',
        beneficiaryInfo: {
            name: '',
            description: '',
            location: ''
        }
    });

    const [images, setImages] = useState({
        mainImage: null,
        galleryImages: [],
        documentProof: null
    });

    const [imagesPreviews, setImagesPreviews] = useState({
        mainImage: '',
        galleryImages: [],
        documentProof: ''
    });

    const categories = [
        'Education',
        'Healthcare',
        'Disaster Relief',
        'Cultural Preservation',
        'Community Development'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('beneficiary.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                beneficiaryInfo: {
                    ...prev.beneficiaryInfo,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        
        if (name === 'galleryImages') {
            setImages(prev => ({
                ...prev,
                [name]: [...Array.from(files)]
            }));

            const previews = Array.from(files).map(file => URL.createObjectURL(file));
            setImagesPreviews(prev => ({
                ...prev,
                [name]: previews
            }));
        } else {
            setImages(prev => ({
                ...prev,
                [name]: files[0]
            }));
            setImagesPreviews(prev => ({
                ...prev,
                [name]: URL.createObjectURL(files[0])
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            
            // Convert targetAmount to number and validate
            const targetAmount = parseFloat(formData.targetAmount);
            if (isNaN(targetAmount) || targetAmount <= 0) {
                toast.error('Please enter a valid target amount');
                return;
            }

            // Append form data with validated amount
            Object.keys(formData).forEach(key => {
                if (key === 'beneficiaryInfo') {
                    form.append(key, JSON.stringify(formData[key]));
                } else if (key === 'targetAmount') {
                    form.append(key, targetAmount.toString());
                } else {
                    form.append(key, formData[key]);
                }
            });

            // Append images
            if (images.mainImage) {
                form.append('mainImage', images.mainImage);
            }
            images.galleryImages.forEach(image => {
                form.append('galleryImages', image);
            });
            if (images.documentProof) {
                form.append('documentProof', images.documentProof);
            }

            await dispatch(createCampaign(form)).unwrap();
            toast.success('Campaign created successfully!');
            navigate('/admin/dashboard/campaigns');
        } catch (error) {
            console.error('Campaign creation failed:', error);
            toast.error(error.message || 'Campaign creation failed');
        }
    };

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <input
            value={value}
            className="w-full p-2 bg-gray-700 text-white rounded"
            onClick={onClick}
            ref={ref}
            readOnly
        />
    ));

    const handleDateChange = (field, date) => {
        setFormData(prev => ({
            ...prev,
            [field]: date
        }));
    };

    const renderCampaignDuration = () => (
        <div>
            <label className="text-white block mb-1">Campaign Duration</label>
            <div className="grid grid-cols-2 gap-2">
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange({
                        target: {
                            name: 'startDate',
                            value: new Date(e.target.value)
                        }
                    })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    required
                />
                <input
                    type="date"
                    name="endDate"
                    value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange({
                        target: {
                            name: 'endDate',
                            value: new Date(e.target.value)
                        }
                    })}
                    min={formData.startDate ? formData.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    required
                />
            </div>
        </div>
    );

    return (
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4 bg-[#283046] rounded-md">
                <h2 className="text-xl font-semibold text-white mb-5">Create Campaign</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-white block mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 text-white rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-white block mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 text-white rounded"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-white block mb-1">Target Amount (₹)</label>
                            <input
                                type="number"
                                name="targetAmount"
                                value={formData.targetAmount}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 text-white rounded"
                                min="0"
                                required
                            />
                        </div>
                        {renderCampaignDuration()}
                    </div>

                    {/* Continue with more form fields */}
                    <div className="mb-4">
                        <label className="text-white block mb-1">Short Description</label>
                        <textarea
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-700 text-white rounded"
                            maxLength={200}
                            rows={2}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-white block mb-1">Full Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-700 text-white rounded"
                            rows={4}
                            required
                        />
                    </div>

                    {/* Image upload sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Main Image Upload */}
                        <div className="text-center">
                            <label className="text-white block mb-1">Main Image</label>
                            <div className="border-2 border-dashed border-gray-500 p-4 rounded">
                                <input
                                    type="file"
                                    name="mainImage"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="mainImage"
                                    accept="image/*"
                                    required
                                />
                                <label htmlFor="mainImage" className="cursor-pointer">
                                    {imagesPreviews.mainImage ? (
                                        <img
                                            src={imagesPreviews.mainImage}
                                            alt="Main preview"
                                            className="max-h-32 mx-auto"
                                        />
                                    ) : (
                                        <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto" />
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Gallery Images Upload */}
                        <div className="text-center">
                            <label className="text-white block mb-1">Gallery Images</label>
                            <div className="border-2 border-dashed border-gray-500 p-4 rounded">
                                <input
                                    type="file"
                                    name="galleryImages"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="galleryImages"
                                    accept="image/*"
                                    multiple
                                />
                                <label htmlFor="galleryImages" className="cursor-pointer">
                                    {imagesPreviews.galleryImages.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {imagesPreviews.galleryImages.map((preview, idx) => (
                                                <img
                                                    key={idx}
                                                    src={preview}
                                                    alt={`Gallery ${idx + 1}`}
                                                    className="h-16 w-16 object-cover"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <FaImages className="text-4xl text-gray-400 mx-auto" />
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Document Proof Upload */}
                        <div className="text-center">
                            <label className="text-white block mb-1">Document Proof</label>
                            <div className="border-2 border-dashed border-gray-500 p-4 rounded">
                                <input
                                    type="file"
                                    name="documentProof"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="documentProof"
                                    accept=".pdf,.doc,.docx"
                                />
                                <label htmlFor="documentProof" className="cursor-pointer">
                                    {images.documentProof ? (
                                        <div className="text-green-500">
                                            <FaFileUpload className="text-4xl mx-auto" />
                                            <p className="text-sm">Document uploaded</p>
                                        </div>
                                    ) : (
                                        <FaFileUpload className="text-4xl text-gray-400 mx-auto" />
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard/campaigns')}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Create Campaign
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaign;