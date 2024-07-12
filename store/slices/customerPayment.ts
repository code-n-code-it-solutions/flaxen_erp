import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IState {
    customerPayment: any;
    customerPaymentDetail: any
    customerPayments: any;
    customerPaymentsForPrint: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    customerPayment: null,
    customerPaymentDetail: null,
    customerPayments: null,
    customerPaymentsForPrint: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getCustomerPayments = createAsyncThunk(
    'customer-payment/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/customer-payment');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const showDetails = createAsyncThunk(
    'customer-payment/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/customer-payment/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeCustomerPayment = createAsyncThunk(
    'customer-payment/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/customer-payment', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getCustomerPaymentsForPrint = createAsyncThunk(
    'customer-payment/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/customer-payment/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const customerPaymentSlice = createSlice({
    name: 'customer-payment',
    initialState,
    reducers: {
        clearCustomerPaymentState: (state) => {
            state.customerPayment = null;
            state.error = null;
            state.success = false;
            state.customerPaymentDetail = null;
            state.customerPaymentsForPrint = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomerPayments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCustomerPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.customerPayments = action.payload.data;
            })
            .addCase(getCustomerPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.customerPaymentDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeCustomerPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeCustomerPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.customerPayment = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeCustomerPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getCustomerPaymentsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCustomerPaymentsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.customerPaymentsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCustomerPaymentsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearCustomerPaymentState} = customerPaymentSlice.actions;

export const customerPaymentSliceConfig = configureSlice(customerPaymentSlice, false);
