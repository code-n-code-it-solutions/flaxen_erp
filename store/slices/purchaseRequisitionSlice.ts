import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IPRState {
    statuses: any;
    purchaseRequest: any;
    purchaseRequestDetail: any
    purchaseRequests: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IPRState = {
    statuses: null,
    purchaseRequest: null,
    purchaseRequestDetail: null,
    purchaseRequests: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getPurchaseRequisitions = createAsyncThunk(
    'purchase-requisition/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/purchase-requisition');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showDetails = createAsyncThunk(
    'purchase-requisition/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/purchase-requisition/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storePurchaseRequest = createAsyncThunk(
    'purchase-requisition/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/purchase-requisition', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deletePurchaseRequisition = createAsyncThunk(
    'purchase-requisition/delete',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.delete('/purchase-requisition/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getRequisitionStatues = createAsyncThunk(
    'purchase-requisition/statuses',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/purchase-requisition/statuses');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getPurchaseRequisitionByStatuses = createAsyncThunk(
    'purchase-requisition/by-statuses',
    async (statuses: any, thunkAPI) => {
        try {
            const response = await API.post('/purchase-requisition/by-statuses', statuses);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editPurchaseRequisition = createAsyncThunk(
    'purchaseRquisition/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/purchase-requisition/edit/' + id);
            console.log(response)
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to edit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updatePurchaseRequisition = createAsyncThunk(
    'purchaseRequisition/update',
    async (data: any, thunkAPI) => {
        try {
            const {id, purchaseRequisitionData} = data
            const response = await API.post('/purchase-requisition/update/' + id, purchaseRequisitionData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const markRequisitionItemComplete = createAsyncThunk(
    'purchaseRequisition/items/mark-complete',
    async (ids: any[], thunkAPI) => {
        try {
            const response = await API.post('/purchase-requisition/items/mark-complete', {ids});
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const purchaseRequisitionSlice = createSlice({
    name: 'purchase-requisition',
    initialState,
    reducers: {
        clearPurchaseRequisitionState: (state) => {
            state.purchaseRequest = null;
            state.error = null;
            state.success = false;
            state.purchaseRequestDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseRequisitions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPurchaseRequisitions.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseRequests = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPurchaseRequisitions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storePurchaseRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(storePurchaseRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseRequest = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storePurchaseRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getRequisitionStatues.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRequisitionStatues.fulfilled, (state, action) => {
                state.loading = false;
                state.statuses = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getRequisitionStatues.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deletePurchaseRequisition.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePurchaseRequisition.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deletePurchaseRequisition.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getPurchaseRequisitionByStatuses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPurchaseRequisitionByStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseRequests = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPurchaseRequisitionByStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(editPurchaseRequisition.pending, (state) => {
                state.loading = true;
            })
            .addCase(editPurchaseRequisition.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseRequestDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseRequestDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(editPurchaseRequisition.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updatePurchaseRequisition.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePurchaseRequisition.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseRequest = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updatePurchaseRequisition.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(markRequisitionItemComplete.pending, (state) => {
                state.loading = true;
            })
            .addCase(markRequisitionItemComplete.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseRequests = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(markRequisitionItemComplete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

    },
});
export const {clearPurchaseRequisitionState} = purchaseRequisitionSlice.actions;

export const purchaseRequisitionSliceConfig = configureSlice(purchaseRequisitionSlice, false);
