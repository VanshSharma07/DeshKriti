import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";




export const place_order = createAsyncThunk(
    'order/place_order',
    async( {price,products,shipping_fee,items,shippingInfo,userId,navigate}) => { 
        try {
            const { data } = await api.post('/home/order/place-order',{
                price,products,shipping_fee,items,shippingInfo,userId,navigate
            })
            navigate('/payment',{
                state: {
                    price:price + shipping_fee,
                    items,
                    orderId: data.orderId 
                }
            })
            console.log(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)
// END METHOD


export const get_orders = createAsyncThunk(
    'order/get_orders',
    async({customerId,status},{rejectWithValue, fulfillWithValue}) => { 
        try {
            const {data} = await api.get(`/home/customer/get-orders/${customerId}/${status}`)
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// END METHOD

export const get_order_details = createAsyncThunk(
    'order/get_order_details',
    async(orderId , { rejectWithValue,fulfillWithValue }) => {
        try {
            const {data} = await api.get(`/home/customer/get-order-details/${orderId}`) 
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End Method 

export const get_seller_order = createAsyncThunk(
    'order/get_seller_order',
    async(orderId, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get(`/seller/order/get-order/${orderId}`);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const seller_order_status_update = createAsyncThunk(
    'order/seller_order_status_update',
    async({orderId, info}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.put(`/seller/order/order-status-update/${orderId}`, info);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const orderReducer = createSlice({
    name: 'order',
    initialState:{
        myOrders : [],
        errorMessage: '',
        successMessage: '',
        shipping_fee: 0,
        myOrder : {},
        order: null

    },
    reducers : {
        messageClear : (state,_) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(get_orders.fulfilled, (state, { payload }) => { 
            state.myOrders = payload.orders;
            
        })
        .addCase(get_order_details.fulfilled, (state, { payload }) => { 
            state.myOrder = payload.order; 
        })
        .addCase(get_seller_order.fulfilled, (state, {payload}) => {
            state.order = payload.order;
        })
        .addCase(seller_order_status_update.fulfilled, (state, {payload}) => {
            state.successMessage = payload.message;
        })
        .addCase(seller_order_status_update.rejected, (state, {payload}) => {
            state.errorMessage = payload.message;
        })
 

    }
})
export const {messageClear} = orderReducer.actions
export default orderReducer.reducer