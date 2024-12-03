// frontend/src/store/reducers/surveyReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const submitSurvey = createAsyncThunk(
    'survey/submitSurvey',
    async (surveyData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/user/submit-survey', surveyData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const surveySlice = createSlice({
    name: 'survey',
    initialState: {
        loading: false,
        error: null,
        surveySubmitted: false,
        recommendations: []
    },
    reducers: {
        clearSurveyState: (state) => {
            state.error = null;
            state.surveySubmitted = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitSurvey.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitSurvey.fulfilled, (state, action) => {
                state.loading = false;
                state.surveySubmitted = true;
                state.recommendations = action.payload.recommendations;
            })
            .addCase(submitSurvey.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearSurveyState } = surveySlice.actions;
export default surveySlice.reducer;