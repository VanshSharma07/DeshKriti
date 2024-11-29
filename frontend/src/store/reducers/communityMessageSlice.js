import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchConnectedUsers = createAsyncThunk(
    'communityMessage/getConnectedUsers',
    async (_, { rejectWithValue }) => {
        try {
            console.log('🔵 Attempting to fetch connected users');
            const response = await api.get('/community/messages/connected-users');
            console.log('✅ API Response:', response.data);
            return response.data.connections;
        } catch (error) {
            console.error('❌ Error details:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'communityMessage/getMessages',
    async (receiverId, { rejectWithValue }) => {
        try {
            console.log('🔵 Attempting to fetch messages for receiver:', receiverId);
            const response = await api.get(`/community/messages/get-messages/${receiverId}`);
            console.log('✅ Messages Response:', response.data);
            return response.data.messages;
        } catch (error) {
            console.error('❌ Error fetching messages:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const sendMessage = createAsyncThunk(
    'communityMessage/sendMessage',
    async ({ receiverId, message }, { rejectWithValue }) => {
        try {
            const response = await api.post('/community/messages/add-message', {
                receiverId,
                message
            });
            return response.data.message;
        } catch (error) {
            console.error('❌ Error sending message:', error);
            return rejectWithValue(error.response?.data || error.message);
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
        error: null
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        updateMessageStatus: (state, action) => {
            const { messageId, status } = action.payload;
            const message = state.messages.find(m => m._id === messageId);
            if (message) {
                message.status = status;
            }
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchConnectedUsers states
            .addCase(fetchConnectedUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConnectedUsers.fulfilled, (state, action) => {
                state.connectedUsers = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchConnectedUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle fetchMessages states
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle sendMessage states
            .addCase(sendMessage.pending, (state) => {
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
                state.error = null;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { addMessage, updateMessageStatus, setCurrentChat } = communityMessageSlice.actions;
export default communityMessageSlice.reducer;