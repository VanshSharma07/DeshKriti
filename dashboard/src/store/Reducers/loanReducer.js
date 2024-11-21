import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const create_loan_request = createAsyncThunk(
    'loan/create_loan_request',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/loan/request', info);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_seller_loans = createAsyncThunk(
    'loan/get_seller_loans',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/loan/seller-loans');
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_loan_details = createAsyncThunk(
    'loan/get_loan_details',
    async (loanId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/loan/details/${loanId}`);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const process_loan_repayment = createAsyncThunk(
    'loan/process_loan_repayment',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/loan/repayment', info);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_loan_requests = createAsyncThunk(
    'loan/get_loan_requests',
    async ({ parPage, searchValue, page }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/loan/requests?page=${page}&searchValue=${searchValue}&parPage=${parPage}`);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const update_loan_status = createAsyncThunk(
    'loan/update_status',
    async ({ requestId, status }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/loan/status`, { loanId: requestId, status });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    loans: [],
    activeLoans: [],
    loanRequests: [],
    totalRequests: 0,
    loan: null,
    totalLoanAmount: 0,
    repaidAmount: 0,
    pendingAmount: 0,
    successMessage: '',
    errorMessage: '',
    loader: false
};

const loanReducer = createSlice({
    name: 'loan',
    initialState,
    reducers: {
        messageClear: (state) => {
            state.successMessage = '';
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(create_loan_request.pending, (state) => {
                state.loader = true;
            })
            .addCase(create_loan_request.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(create_loan_request.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(get_seller_loans.fulfilled, (state, { payload }) => {
                state.loans = payload.loans;
                state.activeLoans = payload.loans.filter(loan => 
                    loan.status === 'active' || loan.status === 'approved'
                );
                state.pendingAmount = payload.pendingAmount;
                state.totalLoans = payload.totalLoans;
            })
            .addCase(get_loan_details.fulfilled, (state, { payload }) => {
                state.loan = payload.loan;
            })
            .addCase(process_loan_repayment.pending, (state) => {
                state.loader = true;
            })
            .addCase(process_loan_repayment.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.loans = state.loans.map(loan => 
                    loan._id === payload.loan._id ? payload.loan : loan
                );
                state.activeLoans = state.loans.filter(loan => loan.status === 'active');
            })
            .addCase(process_loan_repayment.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(get_loan_requests.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_loan_requests.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.loanRequests = payload.loanRequests;
                state.totalRequests = payload.totalRequests;
            })
            .addCase(get_loan_requests.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(update_loan_status.pending, (state) => {
                state.loader = true;
            })
            .addCase(update_loan_status.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                if (payload.loan) {
                    state.loanRequests = state.loanRequests.map(request => 
                        request._id === payload.loan._id ? payload.loan : request
                    );
                }
            })
            .addCase(update_loan_status.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            });
    }
});

export const { messageClear } = loanReducer.actions;
export default loanReducer.reducer;