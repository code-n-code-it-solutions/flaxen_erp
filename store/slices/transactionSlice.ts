import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IAssetState {
    transaction: any;
    transactionDetail: any
    transactions: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IAssetState = {
    transaction: null,
    transactionDetail: null,
    transactions: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getTransactions = createAsyncThunk(
    'transactions/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/account-transaction');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeTransaction = createAsyncThunk(
    'transactions/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/account-transaction', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/update',
    async (data: any, thunkAPI) => {
        try {
            const {id, accountData} = data
            const response = await API.post('/account-transaction/update/' + id, accountData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        clearTransactionState: (state) => {
            state.transaction = null;
            state.error = null;
            state.success = false;
            state.transactionDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeTransaction.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transaction = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateTransaction.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transaction = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearTransactionState} = transactionSlice.actions;

export const transactionSliceConfig = configureSlice(transactionSlice, false);


