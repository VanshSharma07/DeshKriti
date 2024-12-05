import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        // other reducers...
    }
});

export const { updateUserInfo } = authSlice.actions;
export default authSlice.reducer; 