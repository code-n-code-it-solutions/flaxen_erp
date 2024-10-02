import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IReportState {
    vendor: any;
    rawProductStock: any[];
    finishGoodStock: any[];
    salesReportData: any[];
    vendorAccounts: any[];
    vendorStatement: any[];
    customerAccounts: any[];
    customerStatement: any[];
    stock: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IReportState = {
    vendor: null,
    rawProductStock: [],
    finishGoodStock: [],
    salesReportData: [],
    vendorAccounts: [],
    vendorStatement: [],
    customerAccounts: [],
    customerStatement: [],
    stock: null,
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getRawProductReport = createAsyncThunk(
    'reports/raw-products',
    async (params: any, thunkAPI) => {
        try {
            const response = await API.post('/reports/raw-products', params);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getFinishGoodsReport = createAsyncThunk(
    'reports/finish-goods',
    async (params: any, thunkAPI) => {
        try {
            const response = await API.post('/reports/finish-goods', params);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getSalesReport = createAsyncThunk(
    'reports/sales',
    async (params: any, thunkAPI) => {
        try {
            const response = await API.post('/reports/sales', params);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getVendorAccountReport = createAsyncThunk(
    'reports/vendor/account',
    async (params: any, thunkAPI) => {
        try {
            const response = await API.post('/reports/vendor-account', params);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getCustomerAccountReport = createAsyncThunk(
    'reports/customer/account',
    async (params: any, thunkAPI) => {
        try {
            const response = await API.post('/reports/customer-account', params);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getVendorStatementReport = createAsyncThunk(
    'reports/vendor/statement',
    async (params: any, thunkAPI) => {
        try {
            const response = await API.post('/reports/vendor-statement', params);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getStockReport = createAsyncThunk(
    'reports/stock',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/reports/stock-report');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        clearReportState: (state) => {
            state.vendor = null;
            state.rawProductStock = [];
            state.finishGoodStock = [];
            state.salesReportData = [];
            state.vendorAccounts = [];
            state.vendorStatement = [];
            state.customerAccounts = [];
            state.customerStatement = [];
            state.stock = null;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRawProductReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRawProductReport.fulfilled, (state, action) => {
                state.loading = false;
                state.rawProductStock = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getRawProductReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getFinishGoodsReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFinishGoodsReport.fulfilled, (state, action) => {
                state.loading = false;
                state.finishGoodStock = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getFinishGoodsReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getSalesReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSalesReport.fulfilled, (state, action) => {
                state.loading = false;
                state.salesReportData = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getSalesReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getVendorAccountReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorAccountReport.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorAccounts = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendorAccountReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getCustomerAccountReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCustomerAccountReport.fulfilled, (state, action) => {
                state.loading = false;
                state.customerAccounts = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCustomerAccountReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getVendorStatementReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorStatementReport.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorStatement = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendorStatementReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getStockReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStockReport.fulfilled, (state, action) => {
                state.loading = false;
                state.stock = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getStockReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearReportState } = reportSlice.actions;

export const reportSliceConfig = configureSlice(reportSlice, false);
