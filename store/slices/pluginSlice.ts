import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    plugins: any;
    pluginDetail: any;
    plugin: any;
    selectedPlugin: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    plugins: null,
    pluginDetail: null,
    plugin: null,
    selectedPlugin: null,
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getPlugins = createAsyncThunk(
    'plugin/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/menu');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const pluginSlice = createSlice({
    name: 'plugin',
    initialState,
    reducers: {
        clearPluginState: (state) => {
            state.selectedPlugin = null;
            state.pluginDetail = null;
            state.plugin = null;
            state.error = null;
            state.success = false;
        },
        setSelectedPlugin: (state, action) => {
            state.selectedPlugin = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPlugins.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPlugins.fulfilled, (state, action) => {
                state.loading = false;
                state.plugins = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPlugins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const {
    clearPluginState,
    setSelectedPlugin
} = pluginSlice.actions;

export const pluginSliceConfig = configureSlice(pluginSlice, true);
