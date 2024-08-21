import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    accountTransactions: any[];
    accountTransaction: any;
    accountTransactionDetail: any,
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    accountTransactions: [],
    accountTransaction: null,
    accountTransactionDetail: null,
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getAllTransactions = createAsyncThunk(
    'account-transaction/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/account-transaction/all');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getTransactionByAccount = createAsyncThunk(
    'account-transaction/by-account',
    async (accountId: number, thunkAPI) => {
        try {
            const response = await API.get('/account-transaction/by-account/' + accountId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const accountTransactionSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        clearAccountTransactionState: (state) => {
            state.accountTransactions = [];
            state.accountTransaction = null;
            state.accountTransactionDetail = null;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.accountTransactions = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getAllTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getTransactionByAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTransactionByAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.accountTransactions = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getTransactionByAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearAccountTransactionState } = accountTransactionSlice.actions;

export const accountTransactionSliceConfig = configureSlice(accountTransactionSlice, false);


