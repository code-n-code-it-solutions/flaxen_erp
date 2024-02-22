import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IMenusState {
    permissions: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IMenusState = {
    permissions: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getPermissions = createAsyncThunk(
    'permissions/get',
    async (userId:number, thunkAPI) => {
        try {
            const response = await API.get('/permission/user/'+userId);
            return response.data;
        } catch (error:any) {
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
            state.error = null;
            state.success = false;
        },
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
    },
});
export const { clearPermissionState } = permissionSlice.actions;
export default permissionSlice.reducer;
