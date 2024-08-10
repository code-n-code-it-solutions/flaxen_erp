import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IVendorBillState {
    vendorBill: any;
    vendorBillDetail: any
    vendorBills: any;
    pendingBills: any;
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
    pendingBills: null,
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

export const showDetails = createAsyncThunk(
    'vendor-bill/show',
    async (billId:number, thunkAPI) => {
        try {
            const response = await API.get('/vendor-bill/'+billId);
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

export const getPendingVendorBills = createAsyncThunk(
    'vendor-bill/pending',
    async (vendorId: number, thunkAPI) => {
        try {
            const response = await API.get('/vendor-bill/pending/'+ vendorId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getVendorBillsForDebitNoteByVendor = createAsyncThunk(
    'vendor-bill/for-debit-note/by-vendor',
    async (vendorId:number, thunkAPI) => {
        try {
            const response = await API.get('/vendor-bill/for-debit-note/by-vendor/'+vendorId);
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
            state.pendingBills = null;
        },
        clearVendorBillListState : (state) => {
            state.vendorBills = null;
            state.error = null;
            state.success = false
        }
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
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorBillDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
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
            .addCase(getPendingVendorBills.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPendingVendorBills.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingBills = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPendingVendorBills.rejected, (state, action) => {
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
            .addCase(getVendorBillsForDebitNoteByVendor.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorBillsForDebitNoteByVendor.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorBills = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendorBillsForDebitNoteByVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearVendorBillState, clearVendorBillListState} = vendorBillSlice.actions;

export const vendorBillSliceConfig = configureSlice(vendorBillSlice, false);
