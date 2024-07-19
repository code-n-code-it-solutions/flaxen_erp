import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    plugins: any;
    pluginDetail: any;
    plugin: any;
    selectedPlugin: any;
    permittedPlugins: any;
    favouriteStatus: boolean;
    loading: boolean;
    favouriteLoading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    plugins: null,
    pluginDetail: null,
    plugin: null,
    selectedPlugin: null,
    permittedPlugins: null,
    favouriteStatus: false,
    loading: false,
    favouriteLoading: false,
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

export const getPermittedPlugins = createAsyncThunk(
    'plugin/permitted',
    async (userId: number, thunkAPI) => {
        try {
            const response = await API.get('/plugin/permitted/' + userId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const handPluginFavourite = createAsyncThunk(
    'user/handle-favourite-plugin',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/user/handle-favourite-plugin', data);
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
            state.permittedPlugins = null;
            state.plugin = null;
            state.error = null;
            state.success = false;
        },
        setSelectedPlugin: (state, action) => {
            state.selectedPlugin = action.payload;
        },
        clearFavouriteState: (state) => {
            state.favouriteStatus = false;
            state.favouriteLoading = false;
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
            })
            .addCase(getPermittedPlugins.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPermittedPlugins.fulfilled, (state, action) => {
                state.loading = false;
                state.permittedPlugins = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPermittedPlugins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(handPluginFavourite.pending, (state) => {
                state.favouriteLoading = true;
            })
            .addCase(handPluginFavourite.fulfilled, (state, action) => {
                state.favouriteLoading = false;
                state.favouriteStatus = action.payload.success;
            })
            .addCase(handPluginFavourite.rejected, (state, action) => {
                state.favouriteLoading = false;
                state.error = action.error.message;
                state.success = false;
            });
    }
});
export const {
    clearPluginState,
    setSelectedPlugin,
    clearFavouriteState
} = pluginSlice.actions;

export const pluginSliceConfig = configureSlice(pluginSlice, true);
