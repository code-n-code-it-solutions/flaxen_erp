import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface ICurrencyState {
    currency: any;
    currencyDetail: any
    currencies: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: ICurrencyState = {
    currency: null,
    currencyDetail: null,
    currencies: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getCurrencies = createAsyncThunk(
    'currencies/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/currency');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeCurrency = createAsyncThunk(
    'currencies/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/currency', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const currencySlice = createSlice({
    name: 'currencies',
    initialState,
    reducers: {
        clearCurrencyState: (state) => {
            state.currency = null;
            state.error = null;
            state.success = false;
            state.currencyDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCurrencies.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrencies.fulfilled, (state, action) => {
                state.loading = false;
                state.currencies = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCurrencies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeCurrency.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeCurrency.fulfilled, (state, action) => {
                state.loading = false;
                state.currency = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeCurrency.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearCurrencyState } = currencySlice.actions;
export default currencySlice.reducer;
