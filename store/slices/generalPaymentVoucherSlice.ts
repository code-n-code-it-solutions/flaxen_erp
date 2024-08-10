import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    generalPaymentVoucher: any;
    generalPaymentVouchers: any[];
    generalPaymentVoucherDetails: any;
    generalPaymentVouchersForPrint: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    generalPaymentVoucher: null,
    generalPaymentVouchers: [],
    generalPaymentVoucherDetails: null,
    generalPaymentVouchersForPrint: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getGeneralPaymentVouchers = createAsyncThunk(
    'general-payment-voucher/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/general-payment-voucher');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeGeneralPaymentVoucher = createAsyncThunk(
    'general-payment-voucher/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/general-payment-voucher/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getGeneralPaymentVoucherDetail = createAsyncThunk(
    'general-payment-voucher/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/general-payment-voucher/show/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getGeneralPaymentVoucherForPrint = createAsyncThunk(
    'general-payment-voucher/print',
    async (data:any, thunkAPI) => {
        try {
            const response = await API.post('/general-payment-voucher/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const generalPaymentVoucherSlice = createSlice({
    name: 'general-payment-voucher',
    initialState,
    reducers: {
        clearGeneralPaymentVoucherState: (state) => {
            state.generalPaymentVoucher = null;
            state.generalPaymentVoucherDetails = null;
            state.generalPaymentVouchersForPrint = [];
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGeneralPaymentVouchers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGeneralPaymentVouchers.fulfilled, (state, action) => {
                state.loading = false;
                state.generalPaymentVouchers = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGeneralPaymentVouchers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeGeneralPaymentVoucher.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeGeneralPaymentVoucher.fulfilled, (state, action) => {
                state.loading = false;
                state.generalPaymentVoucher = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeGeneralPaymentVoucher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getGeneralPaymentVoucherDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGeneralPaymentVoucherDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.generalPaymentVoucherDetails = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGeneralPaymentVoucherDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getGeneralPaymentVoucherForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGeneralPaymentVoucherForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.generalPaymentVouchersForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGeneralPaymentVoucherForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearGeneralPaymentVoucherState } = generalPaymentVoucherSlice.actions;

export const generalPaymentVoucherSliceConfig = configureSlice(generalPaymentVoucherSlice, false);


