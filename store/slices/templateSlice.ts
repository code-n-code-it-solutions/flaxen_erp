import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API } from "@/configs/api.config";
import { configureSlice } from "@/utils/helper";


interface ITemplateState {
    template: any;
    templateDetail: any;
    templates: any;
    statuses: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: ITemplateState = {
    template: null,
    templateDetail: null,
    templates: [],
    statuses: [],
    loading: false,
    error: null,
    success: false,
  };
  interface TemplateState {
    templates: any[]; // Replace with actual type
  }

  
 

// Async thunks
export const getTemplates = createAsyncThunk(
    'templates/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/template');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch templates';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getTemplateStatuses = createAsyncThunk(
    'templates/statuses',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/template/get/statuses');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch statuses';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeTemplate = createAsyncThunk(
    'templates/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/template', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store template';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateTemplate = createAsyncThunk(
    'templates/update',
    async (data: any, thunkAPI) => {
        try {
            const { id, templateData } = data;
            const response = await API.post(`/template/update/${id}`, templateData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update template';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const deleteTemplate = createAsyncThunk(
    'template/delete',
    async (ids: any[] | any, thunkAPI) => {
        try {
            const response = await API.post('/template/delete', { ids });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Slice
export const templateSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        setTemplates(state, action: PayloadAction<any[]>) {
            state.templates = action.payload;
          },
        clearTemplateState: (state) => {
            state.template = null;
            state.templateDetail = null;
            state.statuses = null;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all templates
            .addCase(getTemplates.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTemplates.fulfilled, (state, action) => {
                state.loading = false;
                state.templates = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Store a new template
            .addCase(storeTemplate.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeTemplate.fulfilled, (state, action) => {
                state.loading = false;
                state.template = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update an existing template
            .addCase(updateTemplate.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTemplate.fulfilled, (state, action) => {
                state.loading = false;
                state.template = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Get template statuses
            .addCase(getTemplateStatuses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTemplateStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.statuses = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getTemplateStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearTemplateState } = templateSlice.actions;

export const templateSliceConfig = configureSlice(templateSlice, false);

export default templateSlice.reducer;
