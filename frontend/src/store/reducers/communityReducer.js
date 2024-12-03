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
    currentPage: 1,
    stateGroups: [],
    currentGroup: null,
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
    async ({ groupId, postId, content }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                `/community/state-groups/${groupId}/posts/${postId}/comment`,
                { content }
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to add comment' });
        }
    }
);

export const toggleLike = createAsyncThunk(
    'community/toggleLike',
    async ({ groupId, postId }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/community/state-groups/${groupId}/posts/${postId}/like`);
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

export const getStateGroups = createAsyncThunk(
    'community/getStateGroups',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/community/state-groups');
            console.log('Fetched groups data:', data); // Debug log
            return data.groups; // Make sure we're returning the groups array
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to fetch groups' });
        }
    }
);

export const joinStateGroup = createAsyncThunk(
    'community/joinStateGroup',
    async (groupId, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.post(`/community/state-groups/${groupId}/join`);
            // Refresh the groups list to get updated membership status
            await dispatch(getStateGroups());
            return data;
        } catch (error) {
            if (error.response?.data?.error === 'Already a member') {
                // If already a member, refresh groups and redirect
                await dispatch(getStateGroups());
                return { alreadyMember: true, groupId };
            }
            return rejectWithValue(error.response?.data || { error: 'Failed to join group' });
        }
    }
);

export const getGroupDetails = createAsyncThunk(
    'community/getGroupDetails',
    async (groupId, { rejectWithValue, getState }) => {
        try {
            const { data } = await api.get(`/community/state-groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const { userInfo } = getState().auth;
            const isMember = data.group.members.some(member => 
                (member.userId._id || member.userId) === userInfo?._id
            );
            return {
                ...data.group,
                isMember
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || { 
                error: 'Failed to fetch group details' 
            });
        }
    }
);

export const createPost = createAsyncThunk(
  'community/createPost',
  async ({ groupId, content, images }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      
      if (images && images.length > 0) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }

      console.log('Sending post data:', { groupId, content, imageCount: images?.length }); // Debug log

      const { data } = await api.post(`/community/state-groups/${groupId}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Post creation response:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Post creation error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: 'Failed to create post' });
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
                const { postId, comments } = action.payload;
                if (state.currentGroup) {
                    const post = state.currentGroup.posts.find(p => p._id === postId);
                    if (post) {
                        post.comments = comments;
                    }
                }
            })
            .addCase(addComment.rejected, (state, action) => {
                state.error = action.payload?.error;
            })
            .addCase(toggleLike.pending, (state) => {
                // Don't set loading to true for quick actions
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                const { postId, likes } = action.payload;
                const post = state.currentGroup.posts.find(p => p._id === postId);
                if (post) {
                    post.likes = likes;
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
            })
            .addCase(getStateGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStateGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.stateGroups = action.payload;
                console.log('Updated state groups in Redux:', state.stateGroups); // Debug log
            })
            .addCase(getStateGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(joinStateGroup.fulfilled, (state, action) => {
                if (action.payload.group) {
                    // Update the specific group in the list
                    const index = state.stateGroups.findIndex(g => g._id === action.payload.group._id);
                    if (index !== -1) {
                        state.stateGroups[index] = action.payload.group;
                    }
                }
                console.log('Join group fulfilled:', action.payload); // Debug log
            })
            .addCase(getGroupDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGroupDetails.fulfilled, (state, action) => {
                state.loading = false;
                console.log('Group Details Response:', action.payload); // Debug log
                state.currentGroup = {
                    ...action.payload,
                    isMember: action.payload.isMember || false
                };
                state.error = null;
            })
            .addCase(getGroupDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentGroup) {
                    state.currentGroup.posts.unshift(action.payload.post);
                }
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
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