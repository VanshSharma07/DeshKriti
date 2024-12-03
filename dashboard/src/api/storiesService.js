import api from './api';

export const storiesService = {
    createStory: async (formData) => {
        const response = await api.post('/story/create', formData);
        return response.data;
    },

    getSellerStories: async (page = 1, limit = 12) => {
        const response = await api.get(`/story/get-stories`, {
            params: {
                page,
                limit
            }
        });
        return response.data;
    },

    getStory: async (storyId) => {
        try {
            const response = await api.get(`/story/${storyId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch story details' };
        }
    },

    deleteStory: async (storyId) => {
        const response = await api.delete(`/story/${storyId}`);
        return response.data;
    },

    updateStory: async (storyId, formData) => {
        const response = await api.put(`/story/${storyId}`, formData);
        return response.data;
    }
}; 