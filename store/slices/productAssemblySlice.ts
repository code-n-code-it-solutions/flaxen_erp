import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";


interface IProductAssembly {
    formula_name: string;
    formula_code: string;
    category_id: number;
    color_code_id: number;
    raw_products: IRawProduct[];
}

interface IRawProduct {
    raw_product_id: number
    unit_id: number
    quantity: number
    unit_price: number
    total: number
}

interface ProductAssemblyState {
    productAssembly: any;
    productAssemblyDetail: any
    allProductAssemblies: any;
    assemblyItems: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: ProductAssemblyState = {
    productAssembly: null,
    productAssemblyDetail: null,
    allProductAssemblies: null,
    assemblyItems: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getProductAssemblies = createAsyncThunk(
    'productAssemblies/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/product-assemblies');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showDetails = createAsyncThunk(
    'productAssemblies/show',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.get('/product-assemblies/'+id);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeProductAssembly = createAsyncThunk(
    'productAssemblies/store',
    async (productAssemblyData: IProductAssembly, thunkAPI) => {
        try {
            const response = await API.post('/product-assemblies', productAssemblyData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editProductAssembly = createAsyncThunk(
    'productAssemblies/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/product-assemblies/edit/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to edit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateProductAssembly = createAsyncThunk(
    'productAssemblies/update',
    async (data:any, thunkAPI) => {
        try {
            const {id, productAssemblyData} = data;
            const response = await API.post('/product-assemblies/update/'+id, productAssemblyData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const deleteProductAssembly = createAsyncThunk(
    'productAssemblies/delete',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.delete('/product-assemblies/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getAssemblyItems = createAsyncThunk(
    'productAssemblies/assemblyItems',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/product-assemblies/items/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const productAssemblySlice = createSlice({
    name: 'productAssemblies',
    initialState,
    reducers: {
        clearProductAssemblyState: (state) => {
            state.productAssembly = null;
            state.error = null;
            state.success = false;
            state.productAssemblyDetail = null;
            state.assemblyItems = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductAssemblies.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductAssemblies.fulfilled, (state, action) => {
                state.loading = false;
                state.allProductAssemblies = action.payload.data;
            })
            .addCase(getProductAssemblies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateProductAssembly.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProductAssembly.fulfilled, (state, action) => {
                state.loading = false;
                state.productAssembly = action.payload.data;
            })
            .addCase(updateProductAssembly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(editProductAssembly.pending, (state) => {
                state.loading = true;
            })
            .addCase(editProductAssembly.fulfilled, (state, action) => {
                state.loading = false;
                state.productAssemblyDetail = action.payload.data;
            })
            .addCase(editProductAssembly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeProductAssembly.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeProductAssembly.fulfilled, (state, action) => {
                state.loading = false;
                state.productAssembly = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeProductAssembly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteProductAssembly.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProductAssembly.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteProductAssembly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getAssemblyItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAssemblyItems.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.assemblyItems = action.payload.data;
            })
            .addCase(getAssemblyItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.productAssemblyDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearProductAssemblyState} = productAssemblySlice.actions;
export default productAssemblySlice.reducer;
