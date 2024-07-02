import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IState {
    saleInvoice: any;
    saleInvoiceDetail: any
    saleInvoices: any;
    saleInvoicesForPrint: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    saleInvoice: null,
    saleInvoiceDetail: null,
    saleInvoices: null,
    saleInvoicesForPrint: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getSaleInvoices = createAsyncThunk(
    'sale-invoice/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/sale-invoice');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const showDetails = createAsyncThunk(
    'sale-invoice/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/sale-invoice/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeSaleInvoice = createAsyncThunk(
    'sale-invoice/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/sale-invoice', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getSaleInvoicesForPrint = createAsyncThunk(
    'sale-invoice/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/sale-invoice/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getPendingSaleInvoices = createAsyncThunk(
    'sale-invoice/pending',
    async (customerId:number, thunkAPI) => {
        try {
            const response = await API.get('/sale-invoice/pending/'+customerId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getSaleInvoicesByCustomer = createAsyncThunk(
    'sale-invoice/by-customer',
    async (customerId:number, thunkAPI) => {
        try {
            const response = await API.get('/sale-invoice/by-customer/'+customerId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const saleInvoiceSlice = createSlice({
    name: 'sale-invoice',
    initialState,
    reducers: {
        clearSaleInvoiceState: (state) => {
            state.saleInvoice = null;
            state.error = null;
            state.success = false;
            state.saleInvoiceDetail = null;
            state.saleInvoicesForPrint = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSaleInvoices.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSaleInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.saleInvoices = action.payload.data;
            })
            .addCase(getSaleInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.saleInvoiceDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeSaleInvoice.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeSaleInvoice.fulfilled, (state, action) => {
                state.loading = false;
                state.saleInvoice = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeSaleInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getSaleInvoicesForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSaleInvoicesForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.saleInvoicesForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getSaleInvoicesForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getPendingSaleInvoices.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPendingSaleInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.saleInvoices = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPendingSaleInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getSaleInvoicesByCustomer.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSaleInvoicesByCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.saleInvoices = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getSaleInvoicesByCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearSaleInvoiceState} = saleInvoiceSlice.actions;

export const saleInvoiceSliceConfig = configureSlice(saleInvoiceSlice, false);
