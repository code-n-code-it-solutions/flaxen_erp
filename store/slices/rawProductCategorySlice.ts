import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    rawProductCategory: any;
    rawProductCategoryDetail: any;
    rawProductCategories: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    rawProductCategory: null,
    rawProductCategoryDetail: null,
    rawProductCategories: null,
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getRawProductCategories = createAsyncThunk(
    'raw-product-category/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/raw-product-category');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeRawProductCategory = createAsyncThunk(
    'raw-product-category/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/raw-product-category/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateRawProductCategory = createAsyncThunk(
    'raw-product-category/update',
    async (data: any, thunkAPI) => {
        try {
            const { id, assetData } = data;
            const response = await API.post('/raw-product-category/update/' + id, assetData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteRawProductCategories = createAsyncThunk(
    'raw-product-category/delete',
    async (ids: any[], thunkAPI) => {
        try {
            const response = await API.post('/raw-product-category/delete/', { ids });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const rawProductCategorySlice = createSlice({
    name: 'raw-product-category',
    initialState,
    reducers: {
        clearRawProductCategoryState: (state) => {
            state.rawProductCategory = null;
            state.error = null;
            state.success = false;
            state.rawProductCategory = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRawProductCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRawProductCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.rawProductCategories = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getRawProductCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeRawProductCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeRawProductCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.rawProductCategory = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeRawProductCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateRawProductCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateRawProductCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.rawProductCategory = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateRawProductCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteRawProductCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRawProductCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteRawProductCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearRawProductCategoryState } = rawProductCategorySlice.actions;

export const rawProductCategorySliceConfig = configureSlice(rawProductCategorySlice, false);


