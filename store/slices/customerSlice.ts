import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface ICustomerState {
    customer: any;
    customerDetail: any;
    customers: any;
    customerTypes: any;
    customersForPrint: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: ICustomerState = {
    customer: null,
    customerDetail: null,
    customers: null,
    customerTypes: null,
    customersForPrint: null,
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getCustomers = createAsyncThunk(
    'customer/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/customer');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeCustomer = createAsyncThunk(
    'customer/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/customer', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showDetails = createAsyncThunk(
    'customer/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/customer/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editCustomer = createAsyncThunk(
    'customer/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/customer/edit/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateCustomer = createAsyncThunk(
    'customer/update',
    async (data: any, thunkAPI) => {
        try {
            const { id, formData } = data;
            const response = await API.post('/customer/update/' + id, formData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getCustomerTypes = createAsyncThunk(
    'customer/customer-types',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/customer-type');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getCustomersForPrint = createAsyncThunk(
    'customer/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/customer/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        clearCustomerState: (state) => {
            state.customer = null;
            state.customerTypes = null;
            state.error = null;
            state.success = false;
            state.customerDetail = null;
            state.customersForPrint = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeCustomer.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.customer = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getCustomerTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCustomerTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.customerTypes = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCustomerTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.customerDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateCustomer.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.customer = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getCustomersForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCustomersForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.customersForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCustomersForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearCustomerState } = customerSlice.actions;
export const customerSliceConfig = configureSlice(customerSlice, false);

