import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IWorkingShiftState {
    workingShift: any;
    workingShiftDetail: any
    workingShifts: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IWorkingShiftState = {
    workingShift: null,
    workingShiftDetail: null,
    workingShifts: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getWorkingShifts = createAsyncThunk(
    'working-shift/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/working-shift');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeWorkingShift = createAsyncThunk(
    'working-shift/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/working-shift', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateWorkingShift = createAsyncThunk(
    'working-shift/update',
    async (data: any, thunkAPI) => {
        try {
            const {id, shiftData} = data;
            const response = await API.post('/working-shift/update/'+id, shiftData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const workingShiftSlice = createSlice({
    name: 'working-shift',
    initialState,
    reducers: {
        clearWorkingShiftState: (state) => {
            state.workingShift = null;
            state.error = null;
            state.success = false;
            state.workingShiftDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWorkingShifts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWorkingShifts.fulfilled, (state, action) => {
                state.loading = false;
                state.workingShifts = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getWorkingShifts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeWorkingShift.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeWorkingShift.fulfilled, (state, action) => {
                state.loading = false;
                state.workingShift = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeWorkingShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateWorkingShift.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateWorkingShift.fulfilled, (state, action) => {
                state.loading = false;
                state.workingShift = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateWorkingShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearWorkingShiftState } = workingShiftSlice.actions;
export default workingShiftSlice.reducer;
