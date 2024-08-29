import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    generalReceiptVoucher: any;
    generalReceiptVouchers: any[];
    generalReceiptVoucherDetails: any;
    generalReceiptVouchersForPrint: any[];
    subjects: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    generalReceiptVoucher: null,
    generalReceiptVouchers: [],
    generalReceiptVoucherDetails: null,
    generalReceiptVouchersForPrint: [],
    subjects: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getGeneralReceiptVouchers = createAsyncThunk(
    'general-receipt-voucher/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/general-receipt-voucher');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeGeneralReceiptVoucher = createAsyncThunk(
    'general-receipt-voucher/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/general-receipt-voucher/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getGeneralReceiptVoucherDetail = createAsyncThunk(
    'general-receipt-voucher/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/general-receipt-voucher/show/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getGeneralReceiptVoucherForPrint = createAsyncThunk(
    'general-receipt-voucher/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/general-receipt-voucher/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const generalReceiptVoucherSlice = createSlice({
    name: 'general-receipt-voucher',
    initialState,
    reducers: {
        clearGeneralReceiptVoucherState: (state) => {
            state.generalReceiptVoucher = null;
            state.generalReceiptVoucherDetails = null;
            state.generalReceiptVouchersForPrint = [];
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGeneralReceiptVouchers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGeneralReceiptVouchers.fulfilled, (state, action) => {
                state.loading = false;
                state.generalReceiptVouchers = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGeneralReceiptVouchers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeGeneralReceiptVoucher.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeGeneralReceiptVoucher.fulfilled, (state, action) => {
                state.loading = false;
                state.generalReceiptVoucher = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeGeneralReceiptVoucher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getGeneralReceiptVoucherDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGeneralReceiptVoucherDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.generalReceiptVoucherDetails = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGeneralReceiptVoucherDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getGeneralReceiptVoucherForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGeneralReceiptVoucherForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.generalReceiptVouchersForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGeneralReceiptVoucherForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearGeneralReceiptVoucherState } = generalReceiptVoucherSlice.actions;

export const generalReceiptVoucherSliceConfig = configureSlice(generalReceiptVoucherSlice, false);


