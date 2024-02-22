import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IVehicleState {
    vehicle: any;
    vehicleDetail: any
    vehicles: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IVehicleState = {
    vehicle: null,
    vehicleDetail: null,
    vehicles: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getVehicles = createAsyncThunk(
    'vehicles/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/vehicle');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeVehicle = createAsyncThunk(
    'vehicles/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/vehicle', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const vehicleSlice = createSlice({
    name: 'vendorTypes',
    initialState,
    reducers: {
        clearVehicleState: (state) => {
            state.vehicle = null;
            state.error = null;
            state.success = false;
            state.vehicles = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVehicles.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVehicles.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVehicles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeVehicle.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicle = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearVehicleState } = vehicleSlice.actions;
export default vehicleSlice.reducer;
