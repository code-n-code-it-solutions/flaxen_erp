import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IDesignationState {
    designation: any;
    designationDetail: any
    designations: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IDesignationState = {
    designation: null,
    designationDetail: null,
    designations: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getDesignations = createAsyncThunk(
    'designations/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/designation');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getDesignationByDepartmentID = createAsyncThunk(
    'designations/designationByDepartmentID',
    async (departmentId:number, thunkAPI) => {
        try {
            const response = await API.get('/department/designations/'+departmentId);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeDesignation = createAsyncThunk(
    'designations/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/designation', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const vendorTypeSlice = createSlice({
    name: 'designations',
    initialState,
    reducers: {
        clearDesignationState: (state) => {
            state.designation = null;
            state.error = null;
            state.success = false;
            state.designationDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDesignations.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDesignations.fulfilled, (state, action) => {
                state.loading = false;
                state.designations = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getDesignations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getDesignationByDepartmentID.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDesignationByDepartmentID.fulfilled, (state, action) => {
                state.loading = false;
                state.designations = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getDesignationByDepartmentID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeDesignation.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeDesignation.fulfilled, (state, action) => {
                state.loading = false;
                state.designation = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeDesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearDesignationState } = vendorTypeSlice.actions;
export default vendorTypeSlice.reducer;
