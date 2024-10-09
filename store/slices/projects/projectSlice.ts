import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    project: any;
    projectDetail: any;
    projects: any[];
    projectTypes: any[];
    projectsForPrint: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    project: null,
    projectDetail: null,
    projects: [],
    projectTypes: [],
    projectsForPrint: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getProjects = createAsyncThunk(
    'project/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/project');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeProject = createAsyncThunk(
    'project/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/project/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showProjectDetails = createAsyncThunk(
    'project/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/project/show' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editProject = createAsyncThunk(
    'project/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/project/edit/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateProject = createAsyncThunk(
    'project/update',
    async (data: any, thunkAPI) => {
        try {
            const { id, formData } = data;
            const response = await API.post('/project/update/' + id, formData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getProjectsForPrint = createAsyncThunk(
    'project/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/project/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        clearProjectState: (state) => {
            state.project = null;
            state.projectTypes = [];
            state.error = null;
            state.success = false;
            state.projectDetail = null;
            state.projectsForPrint = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeProject.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showProjectDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showProjectDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.projectDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showProjectDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getProjectsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProjectsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.projectsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getProjectsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearProjectState } = projectSlice.actions;
export const projectSliceConfig = configureSlice(projectSlice, false);

