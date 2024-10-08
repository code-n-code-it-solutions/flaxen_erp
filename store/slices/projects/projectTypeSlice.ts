import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    projectType: any;
    projectTypeDetail: any;
    projectTypes: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    projectType: null,
    projectTypeDetail: null,
    projectTypes: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getProjectTypes = createAsyncThunk(
    'project-type/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/project/type');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeProjectType = createAsyncThunk(
    'project-type/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/project/type/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const projectTypeSlice = createSlice({
    name: 'project-type',
    initialState,
    reducers: {
        clearProjectTypeState: (state) => {
            state.projectType = null;
            state.error = null;
            state.success = false;
            state.projectTypeDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProjectTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.projectTypes = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getProjectTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeProjectType.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeProjectType.fulfilled, (state, action) => {
                state.loading = false;
                state.projectType = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeProjectType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});
export const { clearProjectTypeState } = projectTypeSlice.actions;
export const projectTypeSliceConfig = configureSlice(projectTypeSlice, false);

