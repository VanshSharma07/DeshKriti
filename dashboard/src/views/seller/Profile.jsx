import React, { useEffect, useState } from 'react';
import { FaImages } from "react-icons/fa6";
import { FadeLoader } from 'react-spinners';
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { profile_image_upload, messageClear, profile_info_add } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { create_stripe_connect_account } from '../../store/Reducers/sellerReducer';

const Profile = () => {
    const [isEditing1, setIsEditing1] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [state, setState] = useState({
        division: '',
        district: '',
        shopName: '',
        sub_district: ''
    });

    const dispatch = useDispatch();
    const { userInfo, loader, successMessage } = useSelector(state => state.auth);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage, dispatch]);

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const imageHandle = (e) => {
        if (e.target.files.length > 0) {
            const formData = new FormData();
            formData.append('image', e.target.files[0]);
            dispatch(profile_image_upload(formData));
        }
    };

    const add = (e) => {
        e.preventDefault();
        dispatch(profile_info_add(state));
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Profile Information */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-100'>
                        <h2 className='text-xl font-semibold text-gray-700'>Profile Information</h2>
                        <button 
                            onClick={() => setIsEditing1(!isEditing1)}
                            className='text-blue-500 hover:text-blue-600'
                        >
                            <FaRegEdit size={20} />
                        </button>
                    </div>
                    {/* Profile Image Section */}
                    <div className='flex flex-col items-center mb-6'>
                        <div className='relative w-32 h-32 mb-4'>
                            <img 
                                src={userInfo?.image} 
                                alt='profile' 
                                className='w-full h-full rounded-full object-cover border-4 border-blue-100'
                            />
                            <label htmlFor='image' className='absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-all'>
                                <FaImages className='text-white' />
                            </label>
                            <input 
                                type='file' 
                                id='image' 
                                className='hidden' 
                                onChange={imageHandle}
                            />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-700'>{userInfo?.name}</h3>
                        <p className='text-gray-500'>{userInfo?.email}</p>
                    </div>
                    {/* Profile Form */}
                    <form onSubmit={add}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex flex-col'>
                                <label className='text-gray-600 mb-2'>Division</label>
                                <input 
                                    type='text'
                                    name='division'
                                    value={state.division}
                                    onChange={inputHandle}
                                    className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                    placeholder='Your division'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-gray-600 mb-2'>District</label>
                                <input 
                                    type='text'
                                    name='district'
                                    value={state.district}
                                    onChange={inputHandle}
                                    className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                    placeholder='Your district'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-gray-600 mb-2'>Shop Name</label>
                                <input 
                                    type='text'
                                    name='shopName'
                                    value={state.shopName}
                                    onChange={inputHandle}
                                    className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                    placeholder='Your shop name'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-gray-600 mb-2'>Sub District</label>
                                <input 
                                    type='text'
                                    name='sub_district'
                                    value={state.sub_district}
                                    onChange={inputHandle}
                                    className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                    placeholder='Your sub district'
                                />
                            </div>
                        </div>
                        <button 
                            type='submit'
                            className='mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-all'
                        >
                            {loader ? (
                                <PropagateLoader color='#fff' cssOverride={overrideStyle} />
                            ) : (
                                'Update Profile'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
