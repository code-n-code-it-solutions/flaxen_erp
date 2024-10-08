import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IState {
    bankAccount: any;
    bankAccountDetails: any
    bankAccounts: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    bankAccount: null,
    bankAccountDetails: null,
    bankAccounts: [],
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getBankAccounts = createAsyncThunk(
    'bank-account/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/bank-account');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeBankAccount = createAsyncThunk(
    'bank-account/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/bank-account', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getAccountsByCustomer = createAsyncThunk(
    'bank-account/by-customer',
    async (customerId: number, thunkAPI) => {
        try {
            const response = await API.get('/bank-account/by-customer/' + customerId);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const bankAccountSlice = createSlice({
    name: 'bank-account',
    initialState,
    reducers: {
        clearBankAccountState: (state) => {
            state.bankAccount = null;
            state.error = null;
            state.success = false;
            state.bankAccountDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBankAccounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBankAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.bankAccounts = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getBankAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeBankAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeBankAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.bankAccount = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeBankAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getAccountsByCustomer.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAccountsByCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.bankAccounts = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getAccountsByCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearBankAccountState } = bankAccountSlice.actions;

export const bankAccountSliceConfig = configureSlice(bankAccountSlice, false);
