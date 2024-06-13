import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface ILPOState {
    LPO: any;
    LPODetail: any;
    allLPOs: any;
    LPOsForPrint: any;
    items: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: ILPOState = {
    LPO: null,
    LPODetail: null,
    allLPOs: null,
    LPOsForPrint: null,
    items: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getLPO = createAsyncThunk(
    'local-purchase-order/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/local-purchase-order');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeLPO = createAsyncThunk(
    'local-purchase-order/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/local-purchase-order', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showDetails = createAsyncThunk(
    'local-purchase-order/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/local-purchase-order/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const deleteLPO = createAsyncThunk(
    'local-purchase-order/delete',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.delete('/local-purchase-order/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getLPOByStatuses = createAsyncThunk(
    'local-purchase-order/by-statuses',
    async (_, thunkAPI) => {
        try {
            const response = await API.post('/local-purchase-order/by-statuses');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getLPOItems = createAsyncThunk(
    'local-purchase-order/items',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/local-purchase-order/items/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const markLPOItemComplete = createAsyncThunk(
    'local-purchase-order/items/mark-complete',
    async (ids: any[], thunkAPI) => {
        try {
            const response = await API.post('/local-purchase-order/items/mark-complete', { ids });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getLPOsForPrint = createAsyncThunk(
    'local-purchase-order/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/local-purchase-order/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const localPurchaseOrderSlice = createSlice({
    name: 'local-purchase-order',
    initialState,
    reducers: {
        clearLocalPurchaseOrderState: (state) => {
            state.LPO = null;
            state.error = null;
            state.success = false;
            state.LPODetail = null;
            state.LPOsForPrint = null;
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLPO.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLPO.fulfilled, (state, action) => {
                state.loading = false;
                state.allLPOs = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getLPO.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeLPO.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeLPO.fulfilled, (state, action) => {
                state.loading = false;
                state.LPO = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeLPO.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteLPO.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteLPO.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteLPO.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getLPOByStatuses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLPOByStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.allLPOs = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getLPOByStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.LPODetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getLPOItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLPOItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getLPOItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(markLPOItemComplete.pending, (state) => {
                state.loading = true;
            })
            .addCase(markLPOItemComplete.fulfilled, (state, action) => {
                state.loading = false;
                state.allLPOs = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(markLPOItemComplete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getLPOsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLPOsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.LPOsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getLPOsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearLocalPurchaseOrderState } = localPurchaseOrderSlice.actions;

export const localPurchaseOrderSliceConfig = configureSlice(localPurchaseOrderSlice, false);
