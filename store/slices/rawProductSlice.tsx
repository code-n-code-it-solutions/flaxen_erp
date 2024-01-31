import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";


interface IRawProduct {
    item_code: string;
    title: string;
    unit_id: string;
    sub_unit_id: string;
    purchase_description: string;
    value_per_unit: string;
    valuation_method: string;
    min_stock_level: string;
    opening_stock: string;
    opening_stock_balance: string;
    sale_description: string;
    image: File | null;
}

interface RawProductState {
    rawProduct: any;
    allRawProducts: any;
    loading: boolean;
    error: any;
}

// Initial state
const initialState: RawProductState = {
    rawProduct: null,
    allRawProducts: null,
    loading: false,
    error: null,
};

// Async thunks
export const getRawProducts = createAsyncThunk(
    'rawProducts/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/raw-products');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeRawProduct = createAsyncThunk(
    'rawProducts/store',
    async (productData:IRawProduct, thunkAPI) => {
        try {
            const response = await API.post('/raw-products', productData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editRawProduct = createAsyncThunk(
    'rawProducts/edit',
    async (id, thunkAPI) => {
        try {
            const response = await API.get('/raw-products/'+id);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// export const updateRawProduct = createAsyncThunk(
//     'rawProducts/update',
//     async (rawProductData, thunkAPI) => {
//         try {
//             const response = await API.put('/raw-products/'+rawProductData.id, rawProductData);
//             return response.data;
//         } catch (error:any) {
//             const message =
//                 error.response?.data?.message || error.message || 'Failed to login';
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// Slice
export const rawProductSlice = createSlice({
    name: 'rawProducts',
    initialState,
    reducers: {
        // Sync reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRawProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRawProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.allRawProducts = action.payload.data;
            })
            .addCase(getRawProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeRawProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeRawProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.rawProduct = action.payload.data;
            })
            .addCase(storeRawProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export default rawProductSlice.reducer;
