import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    generalPayment: any;
    generalPayments: any[];
    generalPaymentDetails: any;
    generalPaymentsForPrint: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    generalPayment: null,
    generalPayments: [],
    generalPaymentDetails: null,
    generalPaymentsForPrint: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getGeneralPayments = createAsyncThunk(
    'credit-note/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/credit-note');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeGeneralPayment = createAsyncThunk(
    'credit-note/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/credit-note/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getGeneralPaymentDetail = createAsyncThunk(
    'credit-note/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/credit-note/show/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getGeneralPaymentsForPrint = createAsyncThunk(
    'credit-note/print',
    async (ids: number[], thunkAPI) => {
        try {
            const response = await API.post('/credit-note/print', { ids });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const generalPaymentSlice = createSlice({
    name: 'credit-note',
    initialState,
    reducers: {
        clearGeneralPaymentState: (state) => {
            state.generalPayment = null;
            state.generalPaymentDetails = null;
            state.generalPaymentsForPrint = [];
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGeneralPayments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGeneralPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.generalPayments = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGeneralPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeGeneralPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeGeneralPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.generalPayment = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeGeneralPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getGeneralPaymentDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGeneralPaymentDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.generalPaymentDetails = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGeneralPaymentDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getGeneralPaymentsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGeneralPaymentsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.generalPaymentsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGeneralPaymentsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearGeneralPaymentState } = generalPaymentSlice.actions;
export const generalPaymentSliceConfig = configureSlice(generalPaymentSlice, false);


