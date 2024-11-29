import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getConnectedUsers = createAsyncThunk(
    'communityMessage/getConnectedUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/api/community/connections/accepted');
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getChatMessages = createAsyncThunk(
    'communityMessage/getChatMessages',
    async (receiverId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/api/community/messages/${receiverId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const sendMessage = createAsyncThunk(
    'communityMessage/sendMessage',
    async ({ receiverId, message }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/api/community/messages/send', {
                receiverId,
                message
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const communityMessageSlice = createSlice({
    name: 'communityMessage',
    initialState: {
        connectedUsers: [],
        messages: [],
        currentChat: null,
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        updateMessages: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getConnectedUsers.fulfilled, (state, action) => {
                state.connectedUsers = action.payload.connections;
            })
            .addCase(getChatMessages.fulfilled, (state, action) => {
                state.messages = action.payload.messages;
                state.currentChat = action.payload.receiver;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages = [...state.messages, action.payload.message];
            });
    }
});

export const { updateMessages, setCurrentChat } = communityMessageSlice.actions;
export default communityMessageSlice.reducer;