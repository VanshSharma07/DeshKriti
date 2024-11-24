import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCloudUploadAlt, FaImages, FaFileUpload } from 'react-icons/fa';
import { getCampaign, updateCampaign, updateCampaignImages } from '../../../store/Reducers/campaignReducer';
import { toast } from 'react-hot-toast';

const EditCampaign = () => {
    const { campaignId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { campaign, loading } = useSelector(state => state.campaign);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        targetAmount: '',
        startDate: new Date(),
        endDate: new Date(),
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

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const result = await dispatch(getCampaign(campaignId)).unwrap();
                if (!result.campaign) {
                    toast.error('Campaign not found');
                    navigate('/admin/dashboard/campaigns');
                }
            } catch (error) {
                toast.error(error || 'Failed to fetch campaign');
                navigate('/admin/dashboard/campaigns');
            }
        };
        
        if (campaignId) {
            fetchCampaign();
        }
    }, [dispatch, campaignId, navigate]);

    useEffect(() => {
        if (campaign) {
            setFormData({
                title: campaign.title,
                description: campaign.description,
                shortDescription: campaign.shortDescription,
                targetAmount: campaign.targetAmount,
                startDate: new Date(campaign.startDate),
                endDate: new Date(campaign.endDate),
                category: campaign.category,
                beneficiaryInfo: campaign.beneficiary
            });

            setImagesPreviews({
                mainImage: campaign.images.main,
                galleryImages: campaign.images.gallery,
                documentProof: campaign.beneficiary.documentProof
            });
        }
    }, [campaign]);

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

    const handleImageChange = async (e) => {
        const { name, files } = e.target;
        
        // Create form data for image update
        const imageForm = new FormData();
        
        if (name === 'galleryImages') {
            Array.from(files).forEach(file => {
                imageForm.append('galleryImages', file);
            });
        } else {
            imageForm.append(name, files[0]);
        }

        try {
            await dispatch(updateCampaignImages({ campaignId, imageForm }));
            dispatch(getCampaign(campaignId)); // Refresh campaign data
        } catch (error) {
            console.error('Image update failed:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'beneficiaryInfo') {
                    form.append(key, JSON.stringify(formData[key]));
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

            await dispatch(updateCampaign({ campaignId, formData: form }));
            navigate('/admin/dashboard/campaigns');
        } catch (error) {
            console.error('Campaign update failed:', error);
        }
    };

    const handleCancel = () => {
        navigate('/admin/dashboard/campaigns');
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    if (!campaign) {
        return <div className="text-white">Campaign not found</div>;
    }

    return (
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4 bg-[#283046] rounded-md">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold text-white">Edit Campaign</h2>
                </div>
                
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
                                <option value="Education">Education</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Disaster Relief">Disaster Relief</option>
                                <option value="Cultural Preservation">Cultural Preservation</option>
                                <option value="Community Development">Community Development</option>
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
                    </div>

                    {/* Beneficiary Information */}
                    <div className="mb-4">
                        <h3 className="text-white text-lg mb-2">Beneficiary Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-white block mb-1">Name</label>
                                <input
                                    type="text"
                                    name="beneficiary.name"
                                    value={formData.beneficiaryInfo.name}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-gray-700 text-white rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-white block mb-1">Location</label>
                                <input
                                    type="text"
                                    name="beneficiary.location"
                                    value={formData.beneficiaryInfo.location}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-gray-700 text-white rounded"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label className="text-white block mb-1">Description</label>
                            <textarea
                                name="beneficiary.description"
                                value={formData.beneficiaryInfo.description}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 text-white rounded"
                                rows="3"
                                required
                            />
                        </div>
                    </div>

                    {/* Image Upload Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="text-white block mb-1">Main Image</label>
                            <div className="border-2 border-dashed border-gray-500 p-4 rounded">
                                {imagesPreviews.mainImage && (
                                    <img
                                        src={imagesPreviews.mainImage}
                                        alt="Main"
                                        className="w-full h-32 object-cover mb-2"
                                    />
                                )}
                                <label className="flex flex-col items-center cursor-pointer">
                                    <FaCloudUploadAlt className="text-4xl text-gray-400" />
                                    <span className="text-gray-400">Update Image</span>
                                    <input
                                        type="file"
                                        name="mainImage"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-white block mb-1">Gallery Images</label>
                            <div className="border-2 border-dashed border-gray-500 p-4 rounded">
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    {imagesPreviews.galleryImages.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-16 object-cover"
                                        />
                                    ))}
                                </div>
                                <label className="flex flex-col items-center cursor-pointer">
                                    <FaImages className="text-4xl text-gray-400" />
                                    <span className="text-gray-400">Update Gallery</span>
                                    <input
                                        type="file"
                                        name="galleryImages"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-white block mb-1">Document Proof</label>
                            <div className="border-2 border-dashed border-gray-500 p-4 rounded">
                                {imagesPreviews.documentProof ? (
                                    <div className="text-green-500 mb-2">
                                        <FaFileUpload className="text-4xl mx-auto" />
                                        <p className="text-sm text-center">Document uploaded</p>
                                    </div>
                                ) : null}
                                <label className="flex flex-col items-center cursor-pointer">
                                    <FaFileUpload className="text-4xl text-gray-400" />
                                    <span className="text-gray-400">Update Document</span>
                                    <input
                                        type="file"
                                        name="documentProof"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Update Campaign
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCampaign;