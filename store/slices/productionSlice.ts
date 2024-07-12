import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IProductionState {
    production: any;
    productionDetail: any
    allProductions: any;
    productionItems: any;
    productionsForPrint: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IProductionState = {
    production: null,
    productionDetail: null,
    allProductions: null,
    productionItems: null,
    productionsForPrint: null,
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
    async (productionData: any, thunkAPI) => {
        try {
            const response = await API.post('/formula-production', productionData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editProduction = createAsyncThunk(
    'productions/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/formula-production/edit/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to edit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateProduction = createAsyncThunk(
    'productions/update',
    async (data:any, thunkAPI) => {
        try {
            const {id, productionData} = data
            const response = await API.post('/formula-production/update/'+id, productionData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


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

export const getProductionItems = createAsyncThunk(
    'productions/production-items',
    async (ids: number[], thunkAPI) => {
        try {
            const response = await API.post('/formula-production/items', {ids});
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const pendingProductions = createAsyncThunk(
    'productions/pending-productions',
    async (productAssemblyId:number, thunkAPI) => {
        try {
            const response = await API.get('/formula-production/production/pending/'+productAssemblyId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getProductionByProductionAssembly = createAsyncThunk(
    'productions/by-product-assembly',
    async (productAssemblyId:number, thunkAPI) => {
        try {
            const response = await API.post('/formula-production/by-product-assembly', { product_assembly_id: productAssemblyId });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getProductionsForPrint = createAsyncThunk(
    'productions/for-print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/formula-production/print', data);
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
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
            state.productionItems = null;
            state.productionsForPrint = null;
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
            .addCase(editProduction.pending, (state) => {
                state.loading = true;
            })
            .addCase(editProduction.fulfilled, (state, action) => {
                state.loading = false;
                state.productionDetail= action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(editProduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateProduction.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduction.fulfilled, (state, action) => {
                state.loading = false;
                state.production= action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateProduction.rejected, (state, action) => {
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
            .addCase(getProductionItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductionItems.fulfilled, (state, action) => {
                state.loading = false;
                state.productionItems = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getProductionItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(pendingProductions.pending, (state) => {
                state.loading = true;
            })
            .addCase(pendingProductions.fulfilled, (state, action) => {
                state.loading = false;
                state.allProductions = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(pendingProductions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getProductionsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductionsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.productionsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getProductionsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getProductionByProductionAssembly.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductionByProductionAssembly.fulfilled, (state, action) => {
                state.loading = false;
                state.allProductions = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getProductionByProductionAssembly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearProductionState} = productionSlice.actions;

export const productionSliceConfig = configureSlice(productionSlice, false);
