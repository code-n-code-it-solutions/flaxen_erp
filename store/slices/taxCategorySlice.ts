import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface ITaxCategoryState {
    taxCategory: any;
    taxCategoryDetail: any
    taxCategories: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: ITaxCategoryState = {
    taxCategory: null,
    taxCategoryDetail: null,
    taxCategories: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getTaxCategories = createAsyncThunk(
    'tax-category/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/tax-category');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeTaxCategory = createAsyncThunk(
    'tax-category/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/tax-category', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const taxCategorySlice = createSlice({
    name: 'tax-category',
    initialState,
    reducers: {
        clearTaxCategoryState: (state) => {
            state.taxCategory = null;
            state.error = null;
            state.success = false;
            state.taxCategoryDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTaxCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTaxCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.taxCategories = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getTaxCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeTaxCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeTaxCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.taxCategory = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeTaxCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearTaxCategoryState } = taxCategorySlice.actions;
export default taxCategorySlice.reducer;
