import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IState {
    quotation: any;
    quotationDetail: any
    quotations: any;
    quotationItems: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    quotation: null,
    quotationDetail: null,
    quotations: null,
    quotationItems: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getQuotations = createAsyncThunk(
    'quotation/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/quotation');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const showDetails = createAsyncThunk(
    'quotation/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/quotation/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeQuotation = createAsyncThunk(
    'quotation/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/quotation', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editQuotation = createAsyncThunk(
    'quotation/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/quotation/edit/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to edit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateQuotation = createAsyncThunk(
    'quotation/update',
    async (data: any, thunkAPI) => {
        try {
            const {id, productionData} = data
            const response = await API.post('/quotation/update/' + id, productionData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const deleteQuotation = createAsyncThunk(
    'quotation/delete',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.delete('/quotation/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getQuotationItems = createAsyncThunk(
    'quotation/quotation-items',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/quotation/items/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const pendingFillings = createAsyncThunk(
    'quotation/pending-fillings',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/quotation/filling/pending');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const pendingQuotations = createAsyncThunk(
    'quotation/pending-quotation',
    async (_, thunkAPI) => {
        try {
            const response = await API.post('/quotation/pending');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getQuotationByProductAssembly = createAsyncThunk(
    'quotation/list/by-product-assembly',
    async (productAssemblyId: number, thunkAPI) => {
        try {
            const response = await API.post('/quotation/list/by-product-assembly/' + productAssemblyId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const quotationSlice = createSlice({
    name: 'quotation',
    initialState,
    reducers: {
        clearQuotationState: (state) => {
            state.quotation = null;
            state.error = null;
            state.success = false;
            state.quotationDetail = null;
            state.quotationItems = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getQuotations.pending, (state) => {
                state.loading = true;
            })
            .addCase(getQuotations.fulfilled, (state, action) => {
                state.loading = false;
                state.quotations = action.payload.data;
            })
            .addCase(getQuotations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.quotationDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeQuotation.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeQuotation.fulfilled, (state, action) => {
                state.loading = false;
                state.quotation = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeQuotation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(editQuotation.pending, (state) => {
                state.loading = true;
            })
            .addCase(editQuotation.fulfilled, (state, action) => {
                state.loading = false;
                state.quotationDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(editQuotation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateQuotation.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateQuotation.fulfilled, (state, action) => {
                state.loading = false;
                state.quotation = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateQuotation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteQuotation.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteQuotation.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteQuotation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getQuotationItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getQuotationItems.fulfilled, (state, action) => {
                state.loading = false;
                state.quotationItems = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getQuotationItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(pendingQuotations.pending, (state) => {
                state.loading = true;
            })
            .addCase(pendingQuotations.fulfilled, (state, action) => {
                state.loading = false;
                state.quotations = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(pendingQuotations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getQuotationByProductAssembly.pending, (state) => {
                state.loading = true;
            })
            .addCase(getQuotationByProductAssembly.fulfilled, (state, action) => {
                state.loading = false;
                state.quotations = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getQuotationByProductAssembly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearQuotationState} = quotationSlice.actions;

export const quotationSliceConfig = configureSlice(quotationSlice, false);
