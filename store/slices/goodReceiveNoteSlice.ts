import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface ILPOState {
    GRN: any;
    GRNDetail: any;
    allGRNs: any;
    GRNsForPrint: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: ILPOState = {
    GRN: null,
    GRNDetail: null,
    allGRNs: null,
    GRNsForPrint: null,
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getGRN = createAsyncThunk(
    'good-receive-note/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/good-receive-note');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getGRNDetail = createAsyncThunk(
    'good-receive-note/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/good-receive-note/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeGRN = createAsyncThunk(
    'good-receive-note/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/good-receive-note', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteGRN = createAsyncThunk(
    'good-receive-note/delete',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.delete('/good-receive-note/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getPendingGRNs = createAsyncThunk(
    'good-receive-note/pending',
    async (vendorId: number, thunkAPI) => {
        try {
            const response = await API.get('/good-receive-note/pending/' + vendorId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getGRNsForPrint = createAsyncThunk(
    'good-receive-note/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/good-receive-note/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const goodReceiveNoteSlice = createSlice({
    name: 'good-receive-note',
    initialState,
    reducers: {
        clearGoodReceiveNoteState: (state) => {
            state.GRN = null;
            state.error = null;
            state.success = false;
            state.GRNDetail = null;
            state.GRNsForPrint = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGRN.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGRN.fulfilled, (state, action) => {
                state.loading = false;
                state.allGRNs = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGRN.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeGRN.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeGRN.fulfilled, (state, action) => {
                state.loading = false;
                state.GRN = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeGRN.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteGRN.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteGRN.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteGRN.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getPendingGRNs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPendingGRNs.fulfilled, (state, action) => {
                state.loading = false;
                state.allGRNs = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPendingGRNs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getGRNDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGRNDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.GRNDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGRNDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getGRNsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGRNsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.GRNsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getGRNsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearGoodReceiveNoteState } = goodReceiveNoteSlice.actions;

export const goodReceiveNoteSliceConfig = configureSlice(goodReceiveNoteSlice, false);
