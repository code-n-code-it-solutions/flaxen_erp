import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";


interface IProduction {
    production_name: string;
    production_code: string;
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
export const getFillings = createAsyncThunk(
    'fillings/all',
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

export const storeFilling = createAsyncThunk(
    'fillings/store',
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

export const editFilling = createAsyncThunk(
    'fillings/edit',
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

// export const updateFilling = createAsyncThunk(
//     'fillings/update',
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


export const deleteFilling = createAsyncThunk(
    'fillings/delete',
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
export const fillingSlice = createSlice({
    name: 'fillings',
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
            .addCase(getFillings.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFillings.fulfilled, (state, action) => {
                state.loading = false;
                state.allProductions = action.payload.data;
            })
            .addCase(getFillings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeFilling.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeFilling.fulfilled, (state, action) => {
                state.loading = false;
                state.production = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeFilling.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteFilling.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteFilling.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteFilling.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearProductionState} = fillingSlice.actions;
export default fillingSlice.reducer;
