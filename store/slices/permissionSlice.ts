import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IMenusState {
    permissions: any;
    roles: any;
    pluginCategories: any;
    plugins: any;
    menus: any;
    menuActions: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IMenusState = {
    permissions: null,
    roles: null,
    pluginCategories: null,
    plugins: null,
    menus: null,
    menuActions: null,
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getPermissions = createAsyncThunk(
    'permissions/get',
    async (data:any, thunkAPI) => {
        try {
            const response = await API.post('/permission/by-employee', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getRoles = createAsyncThunk(
    'permissions/roles',
    async (_, thunkAPI) => {
        try {
            const response = await API.post('/permission/roles');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getPluginCategories = createAsyncThunk(
    'permissions/plugin-categories',
    async (_, thunkAPI) => {
        try {
            const response = await API.post('/permission/plugin-categories');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getPlugins = createAsyncThunk(
    'permissions/plugins',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/permission/plugins', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getMenus = createAsyncThunk(
    'permissions/menus',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/permission/menus', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getMenuActions = createAsyncThunk(
    'permissions/menu-actions',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/permission/menu-actions', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const givePermission = createAsyncThunk(
    'permissions/give-permission',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/permission/give-permission', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const revokePermission = createAsyncThunk(
    'permissions/revoke-permission',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/permission/revoke-permission', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const permissionSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        clearPermissionState: (state) => {
            state.permissions = null;
            state.roles = null;
            state.pluginCategories = null;
            state.plugins = null;
            state.menus = null;
            state.menuActions = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearPluginState: (state) => {
            state.plugins = null;
            state.menus = null;
            state.menuActions = null;
        },
        clearMenusState: (state) => {
            state.menus = null;
            state.menuActions = null;
        },
        clearMenuActionsState: (state) => {
            state.menuActions = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPermissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.permissions = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getRoles.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getPluginCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPluginCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.pluginCategories = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPluginCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
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

            .addCase(getMenus.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMenus.fulfilled, (state, action) => {
                state.loading = false;
                state.menus = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getMenus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getMenuActions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMenuActions.fulfilled, (state, action) => {
                state.loading = false;
                state.menuActions = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getMenuActions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const {
    clearPermissionState,
    clearPluginState,
    clearMenusState,
    clearMenuActionsState
} = permissionSlice.actions;

export const permissionSliceConfig = configureSlice(permissionSlice, false);
