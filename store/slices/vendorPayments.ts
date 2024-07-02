import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IState {
    vendorPayment: any;
    vendorPaymentDetail: any
    vendorPayments: any;
    vendorPaymentsForPrint: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    vendorPayment: null,
    vendorPaymentDetail: null,
    vendorPayments: null,
    vendorPaymentsForPrint: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getVendorPayments = createAsyncThunk(
    'vendor-payment/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/vendor-payment');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const showDetails = createAsyncThunk(
    'vendor-payment/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/vendor-payment/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeVendorPayment = createAsyncThunk(
    'vendor-payment/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/vendor-payment', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getVendorPaymentsForPrint = createAsyncThunk(
    'vendor-payment/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/vendor-payment/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const vendorPaymentSlice = createSlice({
    name: 'vendor-payment',
    initialState,
    reducers: {
        clearVendorPaymentState: (state) => {
            state.vendorPayment = null;
            state.error = null;
            state.success = false;
            state.vendorPaymentDetail = null;
            state.vendorPaymentsForPrint = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVendorPayments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorPayments = action.payload.data;
            })
            .addCase(getVendorPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorPaymentDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeVendorPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeVendorPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorPayment = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeVendorPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getVendorPaymentsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorPaymentsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorPaymentsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendorPaymentsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearVendorPaymentState} = vendorPaymentSlice.actions;

export const vendorPaymentSliceConfig = configureSlice(vendorPaymentSlice, false);
