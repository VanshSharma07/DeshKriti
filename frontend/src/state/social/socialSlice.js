import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  posts: [],
  userPosts: {},
  profiles: {},
  currentPage: 1,
  hasMore: true,
  loading: false,
  error: null,
  currentProfile: null,
  profileLoading: false,
  profileError: null,
  connections: {
    followers: [],
    following: [],
    counts: {
      followers: 0,
      following: 0
    }
  },
  friends: [],
  pendingRequests: []
};

export const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      if (action.payload.page === 1) {
        state.posts = action.payload.posts;
      } else {
        state.posts = [...state.posts, ...action.payload.posts];
      }
      state.currentPage = action.payload.page;
      state.hasMore = action.payload.hasMore;
    },
    setUserPosts: (state, action) => {
      state.userPosts[action.payload.userId] = action.payload.posts;
    },
    updatePost: (state, action) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex(post => post._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
    },
    setProfileLoading: (state, action) => {
      state.profileLoading = action.payload;
    },
    setProfileError: (state, action) => {
      state.profileError = action.payload;
    },
    updateProfile: (state, action) => {
      const { userId, profile } = action.payload;
      state.profiles[userId] = profile;
      if (state.currentProfile?._id === userId) {
        state.currentProfile = profile;
      }
    },
    setConnections: (state, action) => {
      const { followers, following, counts } = action.payload;
      state.connections = {
        followers: followers || state.connections.followers,
        following: following || state.connections.following,
        counts: counts || state.connections.counts
      };
    },
    updateConnectionCounts: (state, action) => {
      state.connections.counts = {
        ...state.connections.counts,
        ...action.payload
      };
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setPendingRequests: (state, action) => {
      state.pendingRequests = action.payload;
    }
  },
});

export const {
  setPosts,
  setUserPosts,
  updatePost,
  setLoading,
  setError,
  clearPosts,
  setCurrentProfile,
  setProfileLoading,
  setProfileError,
  updateProfile,
  setConnections,
  updateConnectionCounts,
  setFriends,
  setPendingRequests
} = socialSlice.actions;

export const fetchUserProfile = (userId) => async (dispatch) => {
  try {
    dispatch(setProfileLoading(true));
    const response = await api.get(`/social/user/${userId}`);
    dispatch(setCurrentProfile(response.data.user));
    dispatch(updateProfile({ userId, profile: response.data.user }));
  } catch (error) {
    console.error('Error fetching user profile:', error);
    dispatch(setProfileError(error.message));
  } finally {
    dispatch(setProfileLoading(false));
  }
};

export const fetchUserConnections = (userId) => async (dispatch) => {
  try {
    const [followersRes, followingRes] = await Promise.all([
      api.get(`/social/followers/${userId}`),
      api.get(`/social/following/${userId}`)
    ]);

    dispatch(setConnections({
      followers: followersRes.data.followers,
      following: followingRes.data.following,
      counts: {
        followers: followersRes.data.total,
        following: followingRes.data.total
      }
    }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const followUser = (userId) => async (dispatch) => {
  try {
    const response = await api.post('/social/follow', { followingId: userId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to follow user';
  }
};

export const checkConnectionStatus = (userId) => async (dispatch) => {
  try {
    const response = await api.get(`/social/connection-status/${userId}`);
    return response.data.status;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to check connection status';
  }
};

export default socialSlice.reducer; 