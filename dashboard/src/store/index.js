import {configureStore} from '@reduxjs/toolkit'
import rootReducer from './rootReducers'

const store = configureStore({

    reducer : rootReducer,
    middleware : getDefaultMiddleware => {
        return getDefaultMiddleware({
            serializableCheck : {
                ignoredActions : [
                    'campaign/createCampaign/fulfilled',
                    'campaign/updateCampaign/fulfilled',
                    'campaign/updateCampaignImages/fulfilled',
                    'dashboard/get_admin_dashboard_data/fulfilled',
                    'dashboard/get_seller_dashboard_data/fulfilled'
                ],
                ignoredPaths : [
                    'campaign.formData',
                    'campaign.images',
                    'dashboard.recentMessage'
                ]
            }
        })
    },
    devTools : process.env.NODE_ENV !== 'production'

})
export default store