import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Shops from './pages/Shops';
import Card from './pages/Card';
import Shipping from './pages/Shipping';
import Details from './pages/Details';
import Register from './pages/Register';
import Login from './pages/Login';
import { useEffect, useMemo } from 'react';
import { get_category } from './store/reducers/homeReducer';
import { useDispatch, useSelector } from 'react-redux';
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
import { StateDataProvider } from './3dmap/context/StateDataContext';
import React, { Suspense } from 'react';
import StoriesPage from './pages/Stories/StoriesPage';
import ChatBot from './components/chat/ChatBot';
import StateGroupDetail from './components/community/groups/StateGroupDetail';
import StateGroupDiscussion from './components/community/groups/StateGroupDiscussion';
import { get_products } from './store/reducers/homeReducer';
import SocialHome from './social/pages/SocialHome';
import Profile from './social/pages/Profile';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './social/theme';
import { ChatProvider } from './social/context/ChatContext';
import EditProfilePage from './social/pages/EditProfilePage';
import StateGroupsPage from './components/community/StateGroupsPage';
import MapViewPage from './components/community/MapViewPage';
import News from './pages/News';
import DiscussionPage from './components/community/groups/DiscussionPage';
import ARGallery from './pages/ARGallery';

// Import MainPage using lazy loading
const MainPage = React.lazy(() => import('./3dmap/pages/MainPage'));

// Add loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Custom component to conditionally render ScrollToTop
const ScrollToTopOnlyForDetails = () => {
  const location = useLocation();
  return location.pathname.startsWith('/product/details/') ? <ScrollToTop /> : null;
};

const SocialRoutes = [
  { path: "/social", element: <SocialHome /> },
  { path: "/social/profile/:userId", element: <Profile /> },
];

function App() {
  const dispatch = useDispatch()
  const mode = useSelector((state) => state.theme.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  useEffect(() => {
    // Load both categories and products when the app initializes
    dispatch(get_category());
    dispatch(get_products({
      categoryId: '',
      pageNumber: 1,
      perPage: 12,    // Adjust this number based on your needs
      searchValue: '',
      sortPrice: ''
    }));
  }, [dispatch])

  return (
    <ChatProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StateDataProvider>
          <BrowserRouter>
            <ScrollToTopOnlyForDetails />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* All your existing routes */}
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
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/community/groups/:groupId" element={<StateGroupDetail />} />
                <Route path="/community/groups/:groupId/discussion" element={<StateGroupDiscussion />} />
                <Route path="/social" element={<SocialHome />} />
                <Route path="/social/profile/:userId" element={<Profile />} />
                <Route path="/social/profile/edit/:userId" element={<EditProfilePage />} />
                <Route path='/state-groups' element={<StateGroupsPage />} />
                <Route path='/map-view' element={<MapViewPage />} />
                <Route path="/news" element={<News />} />
                <Route path="/discussions/:subgroupName" element={<DiscussionPage />} />
                <Route path='/ar-gallery' element={<ARGallery />} />
              </Routes>
            </Suspense>
            <ChatBot />
          </BrowserRouter>
        </StateDataProvider>
      </ThemeProvider>
    </ChatProvider>
  );
}

export default App;