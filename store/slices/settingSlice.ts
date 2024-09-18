import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    settings: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    settings: null,
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getSettings = createAsyncThunk(
    'setting/get',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/setting/get');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        clearSettingState: (state) => {
            state.settings = null;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSettings.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearSettingState } = settingSlice.actions;
export const settingSliceConfig = configureSlice(settingSlice, false);


