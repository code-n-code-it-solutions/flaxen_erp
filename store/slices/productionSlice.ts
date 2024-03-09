import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";


interface IProduction {
    batch_number: string;
    no_of_quantity: number;
    product_assembly_id: number;
    production_items: IRawProduct[];
}

interface IRawProduct {
    raw_product_id: number
    unit_id: number
    quantity: number
    cost: number
    total: number
}

interface ProductAssemblyState {
    production: any;
    productionDetail: any
    allProductions: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: ProductAssemblyState = {
    production: null,
    productionDetail: null,
    allProductions: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getProductions = createAsyncThunk(
    'productions/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/formula-production');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const showDetails = createAsyncThunk(
    'production/show',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.get('/formula-production/'+id);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeProduction = createAsyncThunk(
    'productions/store',
    async (productAssemblyData: IProduction, thunkAPI) => {
        try {
            const response = await API.post('/formula-production', productAssemblyData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editProductions = createAsyncThunk(
    'productions/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/formula-production/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to edit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// export const updateRawProduct = createAsyncThunk(
//     'productions/update',
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


export const deleteProduction = createAsyncThunk(
    'productions/delete',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.delete('/formula-production/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const productionSlice = createSlice({
    name: 'productions',
    initialState,
    reducers: {
        clearProductionState: (state) => {
            state.production = null;
            state.error = null;
            state.success = false;
            state.productionDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductions.fulfilled, (state, action) => {
                state.loading = false;
                state.allProductions = action.payload.data;
            })
            .addCase(getProductions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.productionDetail= action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeProduction.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeProduction.fulfilled, (state, action) => {
                state.loading = false;
                state.production = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeProduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteProduction.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProduction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteProduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearProductionState} = productionSlice.actions;
export default productionSlice.reducer;
