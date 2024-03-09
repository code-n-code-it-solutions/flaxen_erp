import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IServiceState {
    service: any;
    serviceDetail: any
    services: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IServiceState = {
    service: null,
    serviceDetail: null,
    services: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getServices = createAsyncThunk(
    'services/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/necessary-service');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeService = createAsyncThunk(
    'services/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/necessary-service', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        clearServiceState: (state) => {
            state.service = null;
            state.error = null;
            state.success = false;
            state.serviceDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getServices.pending, (state) => {
                state.loading = true;
            })
            .addCase(getServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeService.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeService.fulfilled, (state, action) => {
                state.loading = false;
                state.service = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearServiceState } = serviceSlice.actions;
export default serviceSlice.reducer;
