import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IBankState {
    bank: any;
    bankDetails: any
    banks: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IBankState = {
    bank: null,
    bankDetails: null,
    banks: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getBanks = createAsyncThunk(
    'banks/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/bank');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeBank = createAsyncThunk(
    'banks/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/bank', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const bankSlice = createSlice({
    name: 'banks',
    initialState,
    reducers: {
        clearBankState: (state) => {
            state.bank = null;
            state.error = null;
            state.success = false;
            state.bankDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBanks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBanks.fulfilled, (state, action) => {
                state.loading = false;
                state.banks = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getBanks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeBank.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeBank.fulfilled, (state, action) => {
                state.loading = false;
                state.bank = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeBank.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearBankState } = bankSlice.actions;

export const bankSliceConfig = configureSlice(bankSlice, false);
