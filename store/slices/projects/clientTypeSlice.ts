import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    clientType: any;
    clientTypeDetail: any;
    clientTypes: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    clientType: null,
    clientTypeDetail: null,
    clientTypes: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getClientTypes = createAsyncThunk(
    'client-type/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/project/client/type');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeClientType = createAsyncThunk(
    'client-type/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/project/client/type/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const clientTypeSlice = createSlice({
    name: 'client-type',
    initialState,
    reducers: {
        clearClientTypeState: (state) => {
            state.clientType = null;
            state.error = null;
            state.success = false;
            state.clientTypeDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getClientTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getClientTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.clientTypes = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getClientTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeClientType.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeClientType.fulfilled, (state, action) => {
                state.loading = false;
                state.clientType = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeClientType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});
export const { clearClientTypeState } = clientTypeSlice.actions;
export const clientTypeSliceConfig = configureSlice(clientTypeSlice, false);

