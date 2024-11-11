import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { admin_order_status_update, decreaseProductStock, get_admin_order, increaseProductStock, messageClear } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';
import { get_seller } from '../../store/Reducers/sellerReducer';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const { order, errorMessage, successMessage } = useSelector(state => state.order);
    
    const [sellers, setSellers] = useState({});
    const [adjustedProducts, setAdjustedProducts] = useState({});
    useEffect(() => {
        setStatus(order?.delivery_status);
    }, [order]);

    useEffect(() => {
        dispatch(get_admin_order(orderId));
    }, [orderId, dispatch]);

    useEffect(() => {
        if (order?.products) {
            const sellerIds = [...new Set(order.products.map(product => product.sellerId))];
    
            Promise.all(sellerIds.map(id => dispatch(get_seller(id))))
                .then((results) => {
                    const sellerData = results.reduce((acc, action) => {
                        if (action.type === "seller/get_seller/fulfilled") {
                            const seller = action.payload.seller; // Accédez correctement à l'objet vendeur
                            acc[seller._id] = seller; // Utilisez _id pour l'identifier
                        }
                        return acc;
                    }, {});
                    setSellers(sellerData);
                    console.log('Sellers:', sellerData); // Vérifiez les données des vendeurs ici
                })
                .catch((error) => {
                    console.error('Erreur lors de la récupération des vendeurs:', error);
                });
        }
    }, [order]);
    

    const status_update = (e) => {
        const newStatus = e.target.value;
        dispatch(admin_order_status_update({ orderId, info: { status: newStatus } }));
        setStatus(newStatus);

        order?.products?.forEach(product => {
            const alreadyAdjusted = adjustedProducts[product._id];

            if ((newStatus === 'processing' || newStatus === 'placed') && !alreadyAdjusted) {
                dispatch(decreaseProductStock({ productId: product._id, quantity: product.quantity }));
                setAdjustedProducts(prev => ({ ...prev, [product._id]: true }));
            }

            if (newStatus !== 'processing' && newStatus !== 'placed' && alreadyAdjusted) {
                dispatch(increaseProductStock({ productId: product._id, quantity: product.quantity }));
                setAdjustedProducts(prev => ({ ...prev, [product._id]: false }));
            }
        });
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='flex justify-between items-center p-4'>
                    <h2 className='text-xl text-[#d0d2d6]'>Order Details</h2>
                    <select onChange={status_update} value={status} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#475569] border border-slate-700 rounded-md text-[#d0d2d6]'>
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="warehouse">warehouse</option>
                        <option value="placed">placed</option>
                        <option value="cancelled">cancelled</option>
                    </select>
                </div>
                <div className='p-4'>
                    <div className='flex gap-2 text-lg text-[#d0d2d6]'>
                        <h2>#{order?._id}</h2>
                        <span>{order?.date}</span>
                    </div>
                    <div className='flex flex-wrap'>
    <div className='w-[30%]'>
        <div className='pr-3 text-[#d0d2d6] text-lg'>
            <h2 className='pb-2 font-semibold'>Deliver To: {order?.shippingInfo?.name}</h2>
            <p>{order?.shippingInfo?.address} {order?.shippingInfo?.province} {order?.shippingInfo?.city} {order?.shippingInfo?.area}</p>
            <div className='flex justify-start items-center gap-3'>
                <h2>Payment Status:</h2>
                <span className='text-base'>{order?.payment_status}</span>
            </div>
            <span>Price: {order?.price} TND</span>
            <div className='mt-4 flex flex-col gap-4 bg-[#82888ed] rounded-md'>
                <div className='text-[#d0d2d6]'>
                    {order?.products?.map((p, i) => (
                        <div key={i} className='flex items-center gap-3 text-md'>
                            <img className='w-[70px] h-[70px]' src={p.images[0]} alt="" /> {/* Augmenter la taille ici */}
                            <div className='flex flex-col justify-between'> {/* Utiliser flex pour égaliser la taille */}
                                <h2 className='text-lg font-medium'>{p.name}</h2> {/* Taille du texte ajustée */}
                                <p className='flex items-center'>
                                    <span>Brand: </span>
                                    <span className='ml-1'>{p.brand}</span>
                                    <span className='text-lg ml-2'>Quantity: {p.quantity}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    <div className='w-[70%]'>
        <div className='pl-3'>
            <div className='mt-4 flex flex-col bg-[#82888ed] rounded-md p-4'>
                {order?.suborder?.map((o, i) => (
                    <div key={i + 20} className='text-[#d0d2d6] mt-2'>
                        <div className='flex justify-start items-center gap-3'>
                            <h2>Suborder Status: {o.delivery_status}</h2>
                        </div>
                        {o.products?.map((p, j) => (
                            <div key={j} className='flex items-center gap-3 text-md mt-2'>
                                <img className='w-[70px] h-[70px]' src={p.images[0]} alt="" /> {/* Augmenter la taille ici aussi */}
                                <div className='flex flex-col justify-between'>
                                    <h2 className='text-lg font-medium'>{p.name}</h2>
                                    <p className='flex items-center'>
                                        <span>Brand: </span>
                                        <span className='ml-1'>{p.brand}</span>
                                        <span className='text-lg ml-2'>Quantity: {p.quantity}</span>
                                    </p>
                                    <p>
                                        Seller Name: {sellers[p.sellerId] ? sellers[p.sellerId].name : 'Loading...'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
</div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
