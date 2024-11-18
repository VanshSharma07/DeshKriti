import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

const initialState = {
    topics: [],
    currentTopic: {
        comments: [],
        likes: [],
        tags: [],
        images: [],
        userId: {
            name: '',
            image: ''
        },
        title: '',
        content: '',
        views: 0,
        createdAt: null
    },
    loading: false,
    error: null,
    success: '',
    totalPages: 1,
    currentPage: 1
};

export const createTopic = createAsyncThunk(
    'community/createTopic',
    async (formData, { rejectWithValue }) => {
        try {
            const form = new FormData();
            form.append('title', formData.title);
            form.append('content', formData.content);
            form.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim())));
            
            // Append each image file
            if (formData.images && formData.images.length > 0) {
                formData.images.forEach(image => {
                    form.append('images', image);
                });
            }

            const { data } = await api.post('/community/create-topic', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { 
                    error: 'Failed to create topic. Please try again.' 
                }
            );
        }
    }
);
export const getTopics = createAsyncThunk(
    'community/getTopics',
    async ({ page = 1, limit = 10, tag = '', search = '' }, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/community/topics', {
                params: { page, limit, tag, search }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to fetch topics' });
        }
    }
);

export const getTopic = createAsyncThunk(
    'community/getTopic',
    async (topicId, { rejectWithValue }) => {
        try {
            // Change from /topics/:id to /topic/:id to match backend route
            const { data } = await api.get(`/community/topic/${topicId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to fetch topic' });
        }
    }
);

export const addComment = createAsyncThunk(
    'community/addComment',
    async ({ topicId, commentData }, { rejectWithValue }) => {
        try {
            // Change the endpoint to match backend route
            const { data } = await api.post(`/community/topic/${topicId}/comment`, commentData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to add comment' });
        }
    }
);

export const toggleLike = createAsyncThunk(
    'community/toggleLike',
    async (topicId, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/community/topic/${topicId}/like`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to toggle like' });
        }
    }
);

export const toggleCommentLike = createAsyncThunk(
    'community/toggleCommentLike',
    async ({ topicId, commentId }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/community/topic/${topicId}/comment/${commentId}/like`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const communitySlice = createSlice({
    name: 'community',
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.error = null;
            state.success = '';
        },
        clearCurrentTopic: (state) => {
            state.currentTopic = initialState.currentTopic;
        },
        updateTopicComments: (state, action) => {
            if (state.currentTopic) {
                state.currentTopic.comments = action.payload;
            }
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTopic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTopic.fulfilled, (state, action) => {
                state.loading = false;
                state.topics.unshift(action.payload.topic);
                state.success = action.payload.message;
            })
            .addCase(createTopic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error;
            })
            .addCase(getTopics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTopics.fulfilled, (state, action) => {
                state.loading = false;
                state.topics = action.payload.topics;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getTopics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error;
            })
            .addCase(getTopic.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTopic.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTopic = action.payload.topic;
            })
            .addCase(getTopic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.currentTopic.comments = action.payload.comments;
                    state.success = action.payload.message;
                }
            })
            .addCase(addComment.rejected, (state, action) => {
                state.error = action.payload?.error;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                if (state.currentTopic) {
                    state.currentTopic.likes = action.payload.likes;
                }
            })
            .addCase(toggleCommentLike.pending, (state) => {
                // Don't set loading to true for quick actions
            })
            .addCase(toggleCommentLike.fulfilled, (state, action) => {
                state.currentTopic.comments = action.payload.comments;
            })
            .addCase(toggleCommentLike.rejected, (state, action) => {
                state.error = action.payload?.error;
            });
    }
});

export const { 
    clearMessage, 
    clearCurrentTopic, 
    updateTopicComments,
    setCurrentPage 
} = communitySlice.actions;

export default communitySlice.reducer;