import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IVendorBillState {
    vendorBill: any;
    vendorBillDetail: any
    vendorBills: any;
    payments: any;
    payment: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IVendorBillState = {
    vendorBill: null,
    vendorBillDetail: null,
    vendorBills: null,
    payments: null,
    payment: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getVendorBills = createAsyncThunk(
    'vendor-bill/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/vendor-bill');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getVendorBillPayments = createAsyncThunk(
    'vendor-bill/payments',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/vendor-bill-payment');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeBillPayments = createAsyncThunk(
    'vendor-bill/payments/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/vendor-bill-payment', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeVendorBill = createAsyncThunk(
    'vendor-bill/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/vendor-bill', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteVendorBill = createAsyncThunk(
    'vendor-bill/delete',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.delete('/vendor-bill/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getVendorBillByStatuses = createAsyncThunk(
    'vendor-bill/by-statuses',
    async (statuses: any, thunkAPI) => {
        try {
            const response = await API.post('/vendor-bill/by-statuses', statuses);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const vendorBillSlice = createSlice({
    name: 'vendor-bill',
    initialState,
    reducers: {
        clearVendorBillState: (state) => {
            state.vendorBill = null;
            state.payment = null;
            state.error = null;
            state.success = false;
            state.vendorBillDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVendorBills.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorBills.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorBills = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendorBills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeVendorBill.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeVendorBill.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorBill = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeVendorBill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteVendorBill.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteVendorBill.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteVendorBill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getVendorBillByStatuses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorBillByStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorBills = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendorBillByStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getVendorBillPayments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorBillPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendorBillPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeBillPayments.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeBillPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payment = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeBillPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearVendorBillState} = vendorBillSlice.actions;

export const vendorBillSliceConfig = configureSlice(vendorBillSlice, false);
