import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IProductCategoryState {
    productCategory: any;
    productCategoryDetail: any
    allProductCategory: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IProductCategoryState = {
    productCategory: null,
    productCategoryDetail: null,
    allProductCategory: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getProductCategory = createAsyncThunk(
    'productCategory/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/product-categories');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const productCategorySlice = createSlice({
    name: 'productCategory',
    initialState,
    reducers: {
        clearCategoryState: (state) => {
            state.productCategory = null;
            state.error = null;
            state.success = false;
            state.productCategoryDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.allProductCategory = action.payload.data;
            })
            .addCase(getProductCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearCategoryState } = productCategorySlice.actions;
export default productCategorySlice.reducer;
