
import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Shops from './pages/Shops';
import Card from './pages/Card';
import Shipping from './pages/Shipping';
import Details from './pages/Details';
import Register from './pages/Register';
import Login from './pages/Login';
import { useEffect } from 'react';
import { get_category } from './store/reducers/homeReducer';
import { useDispatch } from 'react-redux';
import CategoryShop from './pages/CategoryShop';
import SearchProducts from './pages/SearchProducts';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import ProtectUser from './utils/ProtectUser';
import Index from './components/dashboard/Index';
import Orders from './components/dashboard/Orders';
import ChangePassword from './components/dashboard/ChangePassword';
import Wishlist from './components/dashboard/Wishlist';
import OrderDetails from './components/dashboard/OrderDetails';
import Chat from './components/dashboard/Chat';
import ConfirmOrder from './pages/ConfirmOrder';
import ScrollToTop from './components/FixTopPage/ScrollToTop';
import Blog from './pages/Blog';

function App() {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(get_category())
   

},[])

// Custom component to conditionally render ScrollToTop
const ScrollToTopOnlyForDetails = () => {
  const location = useLocation();

  // Use startsWith to check for dynamic routes
  return location.pathname.startsWith('/product/details/') ? <ScrollToTop /> : null;
};
  return (
    <BrowserRouter>
    <ScrollToTopOnlyForDetails /> 
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/blog' element={<Blog />} />
      <Route path='/register' element={<Register/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/shops' element={<Shops/>} />
      <Route path='/card' element={<Card/>} />
      <Route path='/shipping' element={<Shipping/>} />
      <Route path='/products?' element={<CategoryShop/>} />
      <Route path='/product/details/:slug' element={<Details/>} />
      <Route path='/order/confirm?' element={<ConfirmOrder/>} /> 
      
      <Route path='/products/search?' element={<SearchProducts/>} />
      <Route path='/payment' element={<Payment/>} />
      <Route path='/dashboard' element={<ProtectUser/>} >
      <Route path='' element={<Dashboard/>} >        
      <Route path='' element={<Index/>} />
      <Route path='my-orders' element={<Orders/>} /> 
      <Route path='change-password' element={<ChangePassword/>} />
      <Route path='my-wishlist' element={<Wishlist/>} /> 
      <Route path='order/details/:orderId' element={<OrderDetails/>} /> 
      <Route path='chat' element={<Chat/>} /> 
      <Route path='chat/:sellerId' element={<Chat/>} /> 
      </Route> 
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
