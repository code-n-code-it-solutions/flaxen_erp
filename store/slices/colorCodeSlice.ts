import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IProductCategoryState {
    colorCategories: any;
    colorCode: any;
    colorCodeDetail: any
    allColorCodes: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IProductCategoryState = {
    colorCategories: null,
    colorCode: null,
    colorCodeDetail: null,
    allColorCodes: null,
    loading: false,
    error: null,
    success: false,
};

interface IFormData {
    code: string;
    name: string;
    hex_code: string;
    image: File | null;
}

// Async thunks
export const getColorCategory = createAsyncThunk(
    'colorCodes/color-category',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/color-category');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getColorCodes = createAsyncThunk(
    'colorCodes/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/color-code');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeColorCode = createAsyncThunk(
    'colorCodes/store',
    async (formData:IFormData, thunkAPI) => {
        try {
            const response = await API.post('/color-code', formData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const colorCodeSlice = createSlice({
    name: 'colorCodes',
    initialState,
    reducers: {
        clearColorCodeState: (state) => {
            state.colorCode = null;
            state.error = null;
            state.success = false;
            state.colorCodeDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getColorCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getColorCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.colorCategories = action.payload.data;
            })
            .addCase(getColorCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getColorCodes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getColorCodes.fulfilled, (state, action) => {
                state.loading = false;
                state.allColorCodes = action.payload.data;
            })
            .addCase(getColorCodes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeColorCode.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeColorCode.fulfilled, (state, action) => {
                state.loading = false;
                state.colorCode = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeColorCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearColorCodeState } = colorCodeSlice.actions;
export default colorCodeSlice.reducer;
