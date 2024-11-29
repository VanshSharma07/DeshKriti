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
import VirtualEventPage from './pages/VirtualEventPage';
import CommunityPage from './components/community/CommunityPage';
import TopicDetailPage from './components/community/TopicDetailPage';
import MainPage from './3dmap/pages/MainPage';
import DonateIndia from './pages/DonateIndia';
import CampaignDetails from './pages/CampaignDetails';
import Authors from './pages/Authors';
import BanarasiSaree from './pages/BanarasiSaree';
import IndianSpices from './pages/IndianSpices';
import MonthArchive from './pages/MonthArchive';
import Pottery from './pages/Pottery';
import Tags from './pages/Tags';
import TribalJewellery from './pages/TribalJewellery';
import WoodenToys from './pages/WoodenToys';
import YearArchive from './pages/YearArchive';
import RegionalProducts from './pages/RegionalProducts';
import ConnectionRequests from './components/community/connections/ConnectionRequests';
import CommunityChat from './components/community/CommunityChat';
import ConnectionsList from './components/community/ConnectionsList';
import CategoryPage from './pages/CategoryPage';

function App() {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(get_category())
  }, [dispatch])

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
      <Route path='/authors' element={<Authors />} />
      <Route path='/banarasi-saree' element={<BanarasiSaree />} />
      <Route path='/indian-spices' element={<IndianSpices />} />
      <Route path='/month-archive' element={<MonthArchive />} />
      <Route path='/indian-pottery' element={<Pottery />} />
      <Route path='/category' element={<CategoryPage />} />
      <Route path='/tags' element={<Tags />} />
      <Route path='/tribal-jewelry' element={<TribalJewellery />} />
      <Route path='/wooden-toys' element={<WoodenToys />} />
      <Route path='/year-archive' element={<YearArchive />} />
      <Route path='/register' element={<Register/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/shops' element={<Shops/>} />
      <Route path='/card' element={<Card/>} />
      <Route path='/shipping' element={<Shipping/>} />
      <Route path='/products?' element={<CategoryShop/>} />
      <Route path='/product/details/:slug' element={<Details/>} />
      <Route path='/order/confirm?' element={<ConfirmOrder/>} /> 
      <Route path='/virtualevents' element={<VirtualEventPage/>} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/community/topic/:topicId" element={<TopicDetailPage />} />
      <Route path="/community/connections/requests" element={<ConnectionRequests />} />
      <Route path="/community/chat/:receiverId" element={<CommunityChat />} />
      <Route path="/community/connections" element={<ConnectionsList />} />
      
      <Route path='/products/search?' element={<SearchProducts/>} />
      <Route path='/payment' element={<Payment/>} />
      <Route path="/3dmap/*" element={<MainPage />} />
      <Route path="/donate-india" element={<DonateIndia />} />
      <Route path="/campaign/:slug" element={<CampaignDetails />} />
      <Route path='/dashboard' element={<ProtectUser/>}>
        <Route path='' element={<Dashboard/>}>
          <Route path='' element={<Index/>} />
          <Route path='my-orders' element={<Orders/>} />
          <Route path='change-password' element={<ChangePassword/>} />
          <Route path='my-wishlist' element={<Wishlist/>} />
          <Route path='order/details/:orderId' element={<OrderDetails/>} />
          <Route path='chat' element={<Chat/>} />
          <Route path='chat/:sellerId' element={<Chat/>} />
        </Route>
      </Route>
      <Route path='/regional-products' element={<RegionalProducts />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;