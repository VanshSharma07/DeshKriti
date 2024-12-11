import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; 
import Sidebar from './Sidebar';
import {socket} from '../utils/utils'
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer, updateSellers } from '../store/Reducers/chatReducer';

const MainLayout = () => {

    const {userInfo} = useSelector(state =>state.auth)
    const dispatch = useDispatch()
    useEffect(() => {
        socket.on('activeCustomer',(customers)=>{
            dispatch(updateCustomer(customers))
        })
        socket.on('activeSeller',(sellers)=>{
            dispatch(updateSellers(sellers))
        })
    })
    

    useEffect(() =>{
        if (userInfo && userInfo.role ==='seller') {
            socket.emit('add_seller',userInfo._id,userInfo)
        }else{
            socket.emit('add_admin',userInfo)
        }
    },[userInfo])
    const [showSidebar, setShowSidebar] = useState(false)
    return ( 
        <div className='bg-[#F5F5F5] w-full min-h-screen'>
            <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
            <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

           <div className='ml-0 lg:ml-[260px] pt-[95px] transition-all'>
           <Outlet/>
           </div>
        </div>
    );
};

export default MainLayout;