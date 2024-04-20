import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

// Define a type for the slice state
interface IUnitState {
    unit: any;
    leaveDetail: any
    leave: any;
    statuses: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IUnitState = {
    unit: null,
    leaveDetail: null,
    leave: null,
    statuses: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getLeave = createAsyncThunk(
    'leave/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/leave');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
//leaveStutuses
export const getLeaveStatuses = createAsyncThunk(
    'leave/statuses',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/leave/get/statuses');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
//store leave
export const storeLeave = createAsyncThunk(
    'leave/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/leave', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

//update leave
export const updateLeave = createAsyncThunk(
    'leave/update',
    async (data: any, thunkAPI) => {
        try {
            const {id, unitData} = data
            const response = await API.post('/units/update/'+id, unitData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
        clearLeaveState: (state) => {
            state.leave = null;
            state.statuses = null;
            state.error = null;
            state.success = false;
            state.leaveDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLeave.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLeave.fulfilled, (state, action) => {
                state.loading = false;
                state.leave = action.payload.data;
            })
            .addCase(getLeave.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(storeLeave.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeLeave.fulfilled, (state, action) => {
                state.loading = false;
                state.leave = action.payload.data;
            })
            .addCase(storeLeave.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(updateLeave.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateLeave.fulfilled, (state, action) => {
                state.loading = false;
                state.leave = action.payload.data;
            })
            .addCase(updateLeave.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getLeaveStatuses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLeaveStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.leave = action.payload.data;
            })
            .addCase(getLeaveStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearLeaveState } = leaveSlice.actions;
export const leaveSliceConfig = configureSlice(leaveSlice, true);
