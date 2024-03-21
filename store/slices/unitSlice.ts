import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

// Define a type for the slice state
interface UnitState {
    unit: any;
    unitDetail: any
    units: any;
    statuses: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: UnitState = {
    unit: null,
    unitDetail: null,
    units: null,
    statuses: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getUnits = createAsyncThunk(
    'units/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/units');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
//unitstatuses
export const getUnitStatuses = createAsyncThunk(
    'assets/statuses',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/unit/get/statuses');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
//store unit
export const storeUnits = createAsyncThunk(
    'unit/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/unit', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to unit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

//update Unit
export const updateUnits = createAsyncThunk(
    'unit/update',
    async (data: any, thunkAPI) => {
        try {
            const {id, unitData} = data
            const response = await API.post('/unit/update/'+id, unitData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const unitSlice = createSlice({
    name: 'units',
    initialState,
    reducers: {
        clearUnitState: (state) => {
            state.units = null;
            state.statuses = null;
            state.error = null;
            state.success = false;
            state.unitDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUnits.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUnits.fulfilled, (state, action) => {
                state.loading = false;
                state.units = action.payload.data;
            })
            .addCase(getUnits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(storeUnits.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeUnits.fulfilled, (state, action) => {
                state.loading = false;
                state.units = action.payload.data;
            })
            .addCase(storeUnits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(updateUnits.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUnits.fulfilled, (state, action) => {
                state.loading = false;
                state.units = action.payload.data;
            })
            .addCase(updateUnits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getUnitStatuses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUnitStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.units = action.payload.data;
            })
            .addCase(getUnitStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearUnitState } = unitSlice.actions;
export default unitSlice.reducer;
