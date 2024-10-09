import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    boq: any;
    boqDetail: any;
    boqs: any[];
    boqTypes: any[];
    boqsForPrint: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    boq: null,
    boqDetail: null,
    boqs: [],
    boqTypes: [],
    boqsForPrint: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getBOQs = createAsyncThunk(
    'boq/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/project/boq');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeBOQ = createAsyncThunk(
    'boq/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/project/boq/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showBOQDetails = createAsyncThunk(
    'boq/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/project/boq/show/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editBOQ = createAsyncThunk(
    'boq/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/project/boq/edit/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateBOQ = createAsyncThunk(
    'boq/update',
    async (data: any, thunkAPI) => {
        try {
            const { id, formData } = data;
            const response = await API.post('/project/boq/update/' + id, formData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getBOQsForPrint = createAsyncThunk(
    'boq/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/project/boq/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const boqSlice = createSlice({
    name: 'boq',
    initialState,
    reducers: {
        clearBOQState: (state) => {
            state.boq = null;
            state.boqTypes = [];
            state.error = null;
            state.success = false;
            state.boqDetail = null;
            state.boqsForPrint = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBOQs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBOQs.fulfilled, (state, action) => {
                state.loading = false;
                state.boqs = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getBOQs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeBOQ.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeBOQ.fulfilled, (state, action) => {
                state.loading = false;
                state.boq = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeBOQ.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showBOQDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showBOQDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.boqDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showBOQDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateBOQ.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBOQ.fulfilled, (state, action) => {
                state.loading = false;
                state.boq = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateBOQ.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getBOQsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBOQsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.boqsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getBOQsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearBOQState } = boqSlice.actions;
export const boqSliceConfig = configureSlice(boqSlice, false);

