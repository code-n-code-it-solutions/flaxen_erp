import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    contract: any;
    contracts: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    contract: null,
    contracts: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getContracts = createAsyncThunk(
    'contracts/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/contract');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch contracts';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeContract = createAsyncThunk(
    'contracts/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/contract', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store contract';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateContract = createAsyncThunk(
    'contracts/update',
    async (data: { id: string; contractData: any }, thunkAPI) => {
        try {
            const { id, contractData } = data;
            const response = await API.put(`/contract/${id}`, contractData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update contract';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const deleteContract = createAsyncThunk(
    'contract/delete',
    async (ids: any[] | any, thunkAPI) => {
        try {
            const response = await API.post('/contract/delete', { ids });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Slice
export const contractSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        clearContractState: (state) => {
            state.contract = null;
            state.contracts = [];
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getContracts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getContracts.fulfilled, (state, action) => {
                state.loading = false;
                state.contracts = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getContracts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeContract.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeContract.fulfilled, (state, action) => {
                state.loading = false;
                state.contract = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateContract.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateContract.fulfilled, (state, action) => {
                state.loading = false;
                state.contract = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearContractState } = contractSlice.actions;

export const contractSliceConfig = configureSlice(contractSlice, false);
