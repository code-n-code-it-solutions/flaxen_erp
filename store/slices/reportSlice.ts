import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IReportState {
    vendor: any;
    stock: any
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IReportState = {
    vendor: null,
    stock: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getVendorReport = createAsyncThunk(
    'reports/vendor',
    async (params:any, thunkAPI) => {
        try {
            const response = await API.post('/reports/vendor-report', params);
            return response.data;
        } catch (error:any) {
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
        } catch (error:any) {
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
            state.stock = null;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVendorReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorReport.fulfilled, (state, action) => {
                state.loading = false;
                state.vendor = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendorReport.rejected, (state, action) => {
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
            })
    },
});
export const { clearReportState } = reportSlice.actions;

export const reportSliceConfig = configureSlice(reportSlice, false);
