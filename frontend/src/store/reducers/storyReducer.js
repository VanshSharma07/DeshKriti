import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Async thunk for fetching stories
export const fetchStories = createAsyncThunk(
    'story/fetchStories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/story/get-stories');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for liking a story
export const likeStory = createAsyncThunk(
    'story/likeStory',
    async (storyId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/story/${storyId}/like`);
            return { storyId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for adding a comment
export const addComment = createAsyncThunk(
    'story/addComment',
    async ({ storyId, content }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/story/${storyId}/comments`, { content });
            return { storyId, comment: response.data.comment };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const storySlice = createSlice({
    name: 'story',
    initialState: {
        stories: [],
        loading: false,
        error: null,
        currentStory: null
    },
    reducers: {
        setCurrentStory: (state, action) => {
            state.currentStory = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch stories cases
            .addCase(fetchStories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStories.fulfilled, (state, action) => {
                state.loading = false;
                state.stories = action.payload.stories;
            })
            .addCase(fetchStories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Failed to fetch stories';
            })
            // Like story cases
            .addCase(likeStory.fulfilled, (state, action) => {
                const story = state.stories.find(s => s._id === action.payload.storyId);
                if (story) {
                    story.likes = action.payload.data.likes;
                    story.likeCount = action.payload.data.likeCount;
                }
            })
            // Add comment cases
            .addCase(addComment.fulfilled, (state, action) => {
                const story = state.stories.find(s => s._id === action.payload.storyId);
                if (story) {
                    story.comments = [...story.comments, action.payload.comment];
                }
            });
    }
});

export const { setCurrentStory } = storySlice.actions;
export default storySlice.reducer;