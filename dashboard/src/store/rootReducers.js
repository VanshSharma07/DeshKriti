import { combineReducers } from '@reduxjs/toolkit';
import campaignReducer from './Reducers/campaignReducer';
import authReducer from './Reducers/authReducer';
import categoryReducer from "./Reducers/categoryReducer";
import chatReducer from "./Reducers/chatReducer";
import productReducer from "./Reducers/productReducer";
import sellerReducer from "./Reducers/sellerReducer";
import OrderReducer from "./Reducers/OrderReducer";
import PaymentReducer from "./Reducers/PaymentReducer";
import dashboardReducer from "./Reducers/dashboardReducer";
import bannerReducer from "./Reducers/bannerReducer";
import loanReducer from "./Reducers/loanReducer";

const rootReducer = combineReducers({
    campaign: campaignReducer,
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    seller: sellerReducer,
    chat: chatReducer,
    order: OrderReducer,
    payment: PaymentReducer,
    dashboard: dashboardReducer,
    banner: bannerReducer,
    loan: loanReducer
});

export default rootReducer;