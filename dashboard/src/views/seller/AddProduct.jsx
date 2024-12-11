import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { add_product,messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';
const AddProduct = () => {
    const dispatch = useDispatch()
    const {categorys} = useSelector(state => state.category)
    const { shopInfo } = useSelector(state => state.auth.userInfo);
    const shopName = shopInfo.shopName; // Correct access to the shop name
    

    const { loader,successMessage,errorMessage } = useSelector(state => state.product)
    
    useEffect(()=>{
        dispatch(get_category({
            searchValue: "",
            page: "",
            parPage: ""

        }))
    },[])

    const [state, setState] = useState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: ""
    
    })

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name] : e.target.value
        })

    }
    
    const [cateShow, setCateShow] = useState(false)
    const [category, setCategory] = useState('')
    const [allCategory, setAllCategory] = useState([])
    const [searchValue, setSearchValue] = useState('') 

    const categorySearch = (e) => {
        const value = e.target.value
        setSearchValue(value)
        if (value) {
            let srcValue = allCategory.filter(c => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
            setAllCategory(srcValue)
        } else {
            setAllCategory(categorys)
        }

    }

    const [images, setImages] = useState([])
    const [imageShow, setImageShow] = useState([])

    const imageHandle = (e) => {
        const files = e.target.files 
        const length = files.length;
        if (length > 0) {
            setImages([...images, ...files])
            let imageUrl = []
            for (let i = 0; i < length; i++) {
                imageUrl.push({url: URL.createObjectURL(files[i])}) 
            }
            setImageShow([...imageShow, ...imageUrl])
        }
    }
    // console.log(images)
    // console.log(imageShow)
    useEffect(() => {

        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear()) 
            setState({
                name: "",
                description: '',
                discount: '',
                price: "",
                brand: "",
                stock: ""
            }) 
            setImageShow([])
            setImages([])
            setCategory('')

        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }


    },[successMessage,errorMessage])


    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow
            let tempImages = images

            tempImages[index] = img
            tempUrl[index] = {url : URL.createObjectURL(img)}
            setImageShow([...tempUrl])
            setImages([...tempImages])

        }
    }

    const removeImage = (i) => {
        const filterImage = images.filter((img,index) => index !== i)
        const filterImageUrl = imageShow.filter((img, index) => index !== i )

        setImages(filterImage)
        setImageShow(filterImageUrl)
    }

    useEffect(()=>{
        setAllCategory(categorys)
    },[categorys])

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const states = {
        North: [
            'Delhi',
            'Haryana',
            'Himachal Pradesh',
            'Jammu and Kashmir',
            'Ladakh',
            'Punjab',
            'Rajasthan',
            'Uttarakhand',
            'Uttar Pradesh'
        ],
        South: [
            'Andhra Pradesh',
            'Karnataka',
            'Kerala',
            'Lakshadweep',
            'Puducherry',
            'Tamil Nadu',
            'Telangana'
        ],
        East: [
            'Arunachal Pradesh',
            'Assam',
            'Bihar',
            'Manipur',
            'Meghalaya',
            'Mizoram',
            'Nagaland',
            'Odisha',
            'Sikkim',
            'Tripura',
            'West Bengal',
            'Jharkhand'
        ],
        West: [
            'Dadra and Nagar Haveli',
            'Daman and Diu',
            'Goa',
            'Gujarat',
            'Maharashtra'
        ],
        Central: [
            'Chhattisgarh',
            'Madhya Pradesh'
        ]
    };

    const add = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', state.name)
        formData.append('description', state.description)
        formData.append('price', state.price)
        formData.append('stock', state.stock)
        formData.append('discount', state.discount)
        formData.append('brand', state.brand)
        formData.append('shopName', shopName)
        formData.append('categories', JSON.stringify(selectedCategories))
        formData.append('region', selectedRegion)
        formData.append('state', selectedState)
        
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i])
        }
        
        dispatch(add_product(formData))
    }

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full bg-white p-6 rounded-lg shadow-md'>
                <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-100'>
                    <h1 className='text-2xl font-semibold text-gray-700'>Add Product</h1>
                    <Link 
                        to='/seller/dashboard/products' 
                        className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all'
                    >
                        All Products
                    </Link>
                </div>

                <form onSubmit={add}>
                    {/* Product Info Section */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        <div className='flex flex-col'>
                            <label className='text-gray-600 mb-2'>Product Name</label>
                            <input 
                                className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                onChange={inputHandle}
                                value={state.name}
                                type="text"
                                name='name'
                                placeholder='Product Name'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-gray-600 mb-2'>Brand</label>
                            <input 
                                className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                onChange={inputHandle}
                                value={state.brand}
                                type="text"
                                name='brand'
                                placeholder='Brand Name'
                            />
                        </div>
                    </div>

                    {/* Category & Stock Section */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        <div className='flex flex-col relative'>
                            <label className='text-gray-600 mb-2'>Category</label>
                            <input 
                                readOnly
                                onClick={() => setCateShow(!cateShow)}
                                className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 cursor-pointer'
                                value={category}
                                placeholder='Select Category'
                            />
                            {/* Category Dropdown */}
                            <div className={`absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10 ${cateShow ? 'block' : 'hidden'}`}>
                                <div className='p-2'>
                                    <input 
                                        value={searchValue}
                                        onChange={categorySearch}
                                        className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                        placeholder='Search categories...'
                                    />
                                </div>
                                <div className='max-h-48 overflow-y-auto'>
                                    {allCategory.map((c, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => {
                                                setCateShow(false)
                                                setCategory(c.name)
                                                setSearchValue('')
                                                setAllCategory(categorys)
                                            }}
                                            className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${category === c.name ? 'bg-blue-50' : ''}`}
                                        >
                                            {c.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-gray-600 mb-2'>Stock</label>
                            <input 
                                className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                onChange={inputHandle}
                                value={state.stock}
                                type="number"
                                name='stock'
                                placeholder='Stock quantity'
                            />
                        </div>
                    </div>

                    {/* Price & Discount Section */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        {/* Similar styling for price and discount inputs */}
                    </div>

                    {/* Description Section */}
                    <div className='mb-6'>
                        <label className='text-gray-600 mb-2 block'>Description</label>
                        <textarea 
                            className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                            onChange={inputHandle}
                            value={state.description}
                            name='description'
                            rows="4"
                            placeholder='Product description'
                        />
                    </div>

                    {/* Images Section */}
                    <div className='mb-6'>
                        <label className='text-gray-600 mb-2 block'>Product Images</label>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            {imageShow.map((img, i) => (
                                <div key={i} className='relative rounded-lg overflow-hidden'>
                                    <img 
                                        src={img.url} 
                                        alt="" 
                                        className='w-full h-40 object-cover'
                                    />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
                                    >
                                        <IoMdCloseCircle size={20} />
                                    </button>
                                </div>
                            ))}
                            <label className='flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer'>
                                <IoMdImages size={30} className='text-gray-400' />
                                <span className='mt-2 text-sm text-gray-500'>Add Images</span>
                                <input 
                                    type="file"
                                    multiple
                                    onChange={imageHandle}
                                    className='hidden'
                                />
                            </label>
                        </div>
                    </div>

                    {/* Region & State Section */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        {/* Similar styling for region and state selects */}
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-end'>
                        <button 
                            disabled={loader}
                            className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all disabled:bg-blue-300'
                        >
                            {loader ? (
                                <PropagateLoader color='#fff' cssOverride={overrideStyle} />
                            ) : (
                                'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;