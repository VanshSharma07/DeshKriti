import { lazy, Suspense } from "react";   
import LoanManagement from "../../views/seller/LoanManagement";
import LoanRequest from "../../views/seller/MicroLoan/LoanRequest";
import LoanDetails from "../../views/seller/LoanDetails";
import LoanRepayment from "../../views/seller/LoanRepayment";

const SellerDashboard = lazy(()=> import('../../views/seller/SellerDashboard'))   
const AddProduct = lazy(()=> import('../../views/seller/AddProduct'))   
const Products = lazy(()=> import('../../views/seller/Products')) 

const Orders = lazy(()=> import('../../views/seller/Orders')) 
const Payments = lazy(()=> import('../../views/seller/Payments'))
const SellerToAdmin = lazy(()=> import('../../views/seller/SellerToAdmin'))
const SellerToCustomer = lazy(()=> import('../../views/seller/SellerToCustomer'))
const Profile = lazy(()=> import('../../views/seller/Profile'))
const EditProduct = lazy(()=> import('../../views/seller/EditProduct'))
const OrderDetails = lazy(()=> import('../../views/seller/OrderDetails'))
const Pending = lazy(()=> import('./../../views/Pending')) 
const Deactive = lazy(()=> import('./../../views/Deactive')) 
const AddBanner = lazy(()=> import('../../views/seller/AddBanner')) 
const AddStory = lazy(()=> import('../../views/seller/AddStory'));
const ManageStories = lazy(()=> import('../../views/seller/ManageStories'));
const EditStory = lazy(()=> import('../../views/seller/EditStory'));

const PostOffices = lazy(() => import('../../views/seller/PostOffices'));

export const sellerRoutes = [
    
    {
        path: '/seller/account-pending',
        element : <Pending/>,
        ability : 'seller' 
    },
    {
        path: '/seller/account-deactive',
        element : <Deactive/>,
        ability : 'seller' 
    },
    {
        path: '/seller/dashboard',
        element : <SellerDashboard/>,
        role : 'seller',
        status : 'active'
    },
    {
        path: '/seller/dashboard/add-product',
        element : <AddProduct/>,
        role : 'seller',
        status : 'active'
    },
    {
        path: '/seller/dashboard/edit-product/:productId',
        element : <EditProduct/>,
        role : 'seller',
        status : 'active'
    },
    {
        path: '/seller/dashboard/products',
        element : <Products/>,
        role : 'seller',
        status : 'active'
    },
    
    {
        path: '/seller/dashboard/orders',
        element : <Orders/>,
        role : 'seller',
        visibility : ['active','deactive']
    },
    {
        path: '/seller/dashboard/order/details/:orderId',
        element : <OrderDetails/>,
        role : 'seller',
        visibility : ['active','deactive']
    },
    {
        path: '/seller/dashboard/payments',
        element : <Payments/>,
        role : 'seller',
        status : 'active'
    },
    {
        path: '/seller/dashboard/chat-support',
        element : <SellerToAdmin/>,
        role : 'seller',
        visibility : ['active','deactive','pending']
    },
    {
        path: '/seller/dashboard/chat-customer/:customerId',
        element : <SellerToCustomer/>,
        role : 'seller',
        status : 'active'
    },
    {
        path: '/seller/dashboard/chat-customer',
        element : <SellerToCustomer/>,
        role : 'seller',
        status : 'active'
    },
    {
        path: '/seller/dashboard/profile',
        element : <Profile/>,
        role : 'seller',
        visibility : ['active','deactive','pending']
    },
    {
        path: '/seller/dashboard/add-banner/:productId',
        element : <AddBanner/>,
        role : 'seller',
        status : 'active'
    },
    {
        path: '/seller/dashboard/loans',
        element: <LoanManagement />,
        role: 'seller'
    },
    {
        path: '/seller/dashboard/loan/request',
        element: <LoanRequest />,
        role: 'seller'
    },
    {
        path: '/seller/dashboard/loan/:loanId',
        element: <LoanDetails />,
        role: 'seller'
    },
    {
        path: '/seller/dashboard/loan/repayment',
        element: <LoanRepayment />,
        role: 'seller'
    },
    {
        path: '/seller/dashboard/stories',
        element: <ManageStories />,
        role: 'seller'
    },
    {
        path: '/seller/dashboard/add-story',
        element: <AddStory />,
        role: 'seller'
    },
    {
        path: '/seller/dashboard/edit-story/:storyId',
        element: <EditStory />,
        role: 'seller'
    },
    {
        path: '/seller/dashboard/post-offices',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <PostOffices />
            </Suspense>
        ),
        role: 'seller',
        status: 'active'
    }


]