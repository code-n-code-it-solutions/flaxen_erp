import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IDepartmentState {
    department: any;
    departmentDetail: any
    departments: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IDepartmentState = {
    department: null,
    departmentDetail: null,
    departments: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getDepartments = createAsyncThunk(
    'departments/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/department');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeDepartment = createAsyncThunk(
    'departments/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/department', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const departmentSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {
        clearDepartmentState: (state) => {
            state.department = null;
            state.error = null;
            state.success = false;
            state.departmentDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDepartments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeDepartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.department = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearDepartmentState } = departmentSlice.actions;

export const departmentSliceConfig = configureSlice(departmentSlice, false);
