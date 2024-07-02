import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IAssetState {
    accountTypes: any;
    account: any;
    accountList: any,
    accountDetail: any
    accounts: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IAssetState = {
    accountTypes: null,
    account: null,
    accountList: null,
    accountDetail: null,
    accounts: null,
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getAccounts = createAsyncThunk(
    'accounts/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/account');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getAccountsTypes = createAsyncThunk(
    'accounts/types',
    async (params: any, thunkAPI) => {
        try {
            const response = await API.post('/account/types', params);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getAccountList = createAsyncThunk(
    'accounts/list',
    async (params: any, thunkAPI) => {
        try {
            const response = await API.post('/account/list/', params);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeAccount = createAsyncThunk(
    'accounts/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/account', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateAccount = createAsyncThunk(
    'accounts/update',
    async (data: any, thunkAPI) => {
        try {
            const { id, accountData } = data;
            const response = await API.post('/account/update/' + id, accountData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const accountSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        clearAccountState: (state) => {
            state.accountTypes = null;
            state.account = null;
            state.accountList = null;
            state.error = null;
            state.success = false;
            state.accountDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAccounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getAccountsTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAccountsTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.accountTypes = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getAccountsTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.account = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.account = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getAccountList.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAccountList.fulfilled, (state, action) => {
                state.loading = false;
                state.accountList = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getAccountList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearAccountState } = accountSlice.actions;

export const accountSliceConfig = configureSlice(accountSlice, false);


