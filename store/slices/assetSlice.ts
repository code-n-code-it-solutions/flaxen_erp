import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IAssetState {
    asset: any;
    assetDetail: any
    assets: any;
    statuses: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IAssetState = {
    asset: null,
    assetDetail: null,
    assets: null,
    statuses: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getAssets = createAsyncThunk(
    'assets/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/asset');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getAssetStatuses = createAsyncThunk(
    'assets/statuses',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/asset/get/statuses');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeAssets = createAsyncThunk(
    'assets/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/asset', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const assetSlice = createSlice({
    name: 'assets',
    initialState,
    reducers: {
        clearAssetState: (state) => {
            state.asset = null;
            state.statuses = null;
            state.error = null;
            state.success = false;
            state.assetDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAssets.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAssets.fulfilled, (state, action) => {
                state.loading = false;
                state.assets = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getAssets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeAssets.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeAssets.fulfilled, (state, action) => {
                state.loading = false;
                state.asset = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeAssets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getAssetStatuses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAssetStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.statuses = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getAssetStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearAssetState } = assetSlice.actions;
export default assetSlice.reducer;
