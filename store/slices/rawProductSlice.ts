import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IRawProductState {
    rawProduct: any;
    rawProductDetail: any
    allRawProducts: any;
    fillingProducts: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IRawProductState = {
    rawProduct: null,
    rawProductDetail: null,
    allRawProducts: null,
    fillingProducts: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getRawProducts = createAsyncThunk(
    'rawProducts/all',
    async (type:any[], thunkAPI) => {
        try {
            let param = ''
            if (type.length>0) {
                param = '?product_type='+type.join(',')
            }
            const response = await API.get('/raw-products'+param);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getFillingProducts = createAsyncThunk(
    'rawProducts/filling-products/all',
    async (type:any[], thunkAPI) => {
        try {
            let param = ''
            if (type.length>0) {
                param = '?product_type='+type.join(',')
            }
            const response = await API.get('/raw-products'+param);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showDetails = createAsyncThunk(
    'rawProducts/show',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.get('/raw-products/'+id);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeRawProduct = createAsyncThunk(
    'rawProducts/store',
    async (productData:any, thunkAPI) => {
        try {
            const response = await API.post('/raw-products', productData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editRawProduct = createAsyncThunk(
    'rawProducts/edit',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.get('/raw-products/edit/'+id);
            console.log(response)
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to edit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateRawProduct = createAsyncThunk(
    'rawProducts/update',
    async (data:any, thunkAPI) => {
        try {
            const {id, rawProductData} = data
            const response = await API.post('/raw-products/update/'+id, rawProductData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const deleteRawProduct = createAsyncThunk(
    'rawProducts/delete',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.delete('/raw-products/'+id);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const rawProductSlice = createSlice({
    name: 'rawProducts',
    initialState,
    reducers: {
        clearRawProductState: (state) => {
            state.rawProduct = null;
            state.error = null;
            state.success = false;
            state.rawProductDetail = null;
        },
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
            .addCase(getFillingProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFillingProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.fillingProducts = action.payload.data;
            })
            .addCase(getFillingProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeRawProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeRawProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.rawProduct = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeRawProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.rawProductDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(editRawProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(editRawProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.rawProductDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(editRawProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateRawProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateRawProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.rawProduct = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateRawProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteRawProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRawProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteRawProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearRawProductState } = rawProductSlice.actions;
export default rawProductSlice.reducer;
