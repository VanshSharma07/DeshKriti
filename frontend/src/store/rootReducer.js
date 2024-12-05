import authReducer from "./reducers/authReducer";
import cardReducer from "./reducers/cardReducer";
import chatReducer from "./reducers/chatReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import homeReducer from "./reducers/homeReducer";
import orderReducer from "./reducers/orderReducer";
import communityReducer from "./reducers/communityReducer";
import campaignReducer from "./reducers/campaignReducer";
import communityMapReducer from "./reducers/communityMapReducer";
import communityMessageReducer from './reducers/communityMessageSlice';
import communityConnectionReducer from './reducers/communityConnectionReducer';
import storyReducer from './reducers/storyReducer';
import surveyReducer from "./reducers/surveyReducer";
import themeReducer from './slices/themeSlice';
import socialReducer from "../state/social/socialSlice";

const rootReducer = {
    home: homeReducer,
    auth: authReducer,
    card: cardReducer,
    order: orderReducer,
    dashboard: dashboardReducer,
    chat: chatReducer,
    community: communityReducer,
    campaign: campaignReducer,
    communityMap: communityMapReducer,
    communityMessage: communityMessageReducer,
    communityConnection: communityConnectionReducer,
    story: storyReducer,
    survey: surveyReducer,
    theme: themeReducer,
    social: socialReducer
}   

export default rootReducer;