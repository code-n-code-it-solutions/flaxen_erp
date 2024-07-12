import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IAssetState {
    expense: any;
    expenseDetail: any
    expenses: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IAssetState = {
    expense: null,
    expenseDetail: null,
    expenses: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getExpenses = createAsyncThunk(
    'expenses/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/expense');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeExpense = createAsyncThunk(
    'expenses/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/expense', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateExpense = createAsyncThunk(
    'expenses/update',
    async (data: any, thunkAPI) => {
        try {
            const {id, expenseData} = data
            const response = await API.post('/expense/update/' + id, expenseData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        clearExpenseState: (state) => {
            state.expense = null;
            state.error = null;
            state.success = false;
            state.expenseDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getExpenses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expense = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expense = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearExpenseState} = expenseSlice.actions;

export const expenseSliceConfig = configureSlice(expenseSlice, false);


