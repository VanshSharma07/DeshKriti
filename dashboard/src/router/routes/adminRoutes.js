import { lazy } from "react";         
import LoanRequests from "../../views/admin/LoanRequests";
const AdminDashboard = lazy(()=> import('../../views/admin/AdminDashboard'))  
const Orders = lazy(()=> import('../../views/admin/Orders')) 
const Category = lazy(()=> import('../../views/admin/Category'))  
const Sellers = lazy(()=> import('../../views/admin/Sellers'))
const PaymentRequest = lazy(()=> import('../../views/admin/PaymentRequest'))  
const DeactiveSellers = lazy(()=> import('../../views/admin/DeactiveSellers'))  
const SellerRequest = lazy(()=> import('../../views/admin/SellerRequest'))   
const SellerDetails = lazy(()=> import('../../views/admin/SellerDetails'))   
const ChatSeller = lazy(()=> import('../../views/admin/ChatSeller'))   
const OrderDetails = lazy(()=> import('../../views/admin/OrderDetails'))  
const VirtualEvents = lazy(()=> import('../../views/admin/VirtualEvents'))  
const Campaigns = lazy(() => import('../../views/admin/campaign/Campaigns'))
const CreateCampaign = lazy(() => import('../../views/admin/campaign/CreateCampaign'))
const CampaignDonations = lazy(() => import('../../views/admin/campaign/CampaignDonations'))
const EditCampaign = lazy(() => import('../../views/admin/campaign/EditCampaign'))

export const adminRoutes = [
    {
        path: 'admin/dashboard',
        element : <AdminDashboard/>,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/orders',
        element : <Orders/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/category',
        element : <Category/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/sellers',
        element : <Sellers/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/payment-request',
        element : <PaymentRequest/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/deactive-sellers',
        element : <DeactiveSellers/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/sellers-request',
        element : <SellerRequest/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/seller/details/:sellerId',
        element : <SellerDetails/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/chat-sellers',
        element : <ChatSeller/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/chat-sellers/:sellerId',
        element : <ChatSeller/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/order/details/:orderId',
        element : <OrderDetails/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/virtual-events',
        element : <VirtualEvents/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/loan-requests',
        element: <LoanRequests />,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/campaigns',
        element: <Campaigns />,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/campaigns/create',
        element: <CreateCampaign />,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/campaigns/edit/:campaignId',
        element: <EditCampaign />,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/campaigns/donations',
        element: <CampaignDonations />,
        role: 'admin'
    }
]