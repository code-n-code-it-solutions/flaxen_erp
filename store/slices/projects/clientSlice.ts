import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    client: any;
    clientDetail: any;
    clients: any[];
    clientTypes: any[];
    clientsForPrint: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    client: null,
    clientDetail: null,
    clients: [],
    clientTypes: [],
    clientsForPrint: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getClients = createAsyncThunk(
    'client/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/project/client');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeClient = createAsyncThunk(
    'client/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/project/client/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showDetails = createAsyncThunk(
    'client/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/project/client/show/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editClient = createAsyncThunk(
    'client/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/project/client/edit/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateClient = createAsyncThunk(
    'client/update',
    async (data: any, thunkAPI) => {
        try {
            const { id, formData } = data;
            const response = await API.post('/project/client/update/' + id, formData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getClientsForPrint = createAsyncThunk(
    'client/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/project/client/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        clearClientState: (state) => {
            state.client = null;
            state.clientTypes = [];
            state.error = null;
            state.success = false;
            state.clientDetail = null;
            state.clientsForPrint = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getClients.pending, (state) => {
                state.loading = true;
            })
            .addCase(getClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeClient.fulfilled, (state, action) => {
                state.loading = false;
                state.client = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.clientDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.loading = false;
                state.client = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getClientsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getClientsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.clientsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getClientsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearClientState } = clientSlice.actions;
export const clientSliceConfig = configureSlice(clientSlice, false);

