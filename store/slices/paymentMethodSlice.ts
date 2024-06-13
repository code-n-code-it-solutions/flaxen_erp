import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IAssetState {
    paymentMethod: any;
    paymentMethodDetail: any
    paymentMethods: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IAssetState = {
    paymentMethod: null,
    paymentMethodDetail: null,
    paymentMethods: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getPaymentMethods = createAsyncThunk(
    'payment-method/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/payment-method');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const paymentMethodSlice = createSlice({
    name: 'payment-method',
    initialState,
    reducers: {
        clearPaymentMethodState: (state) => {
            state.paymentMethod = null;
            state.error = null;
            state.success = false;
            state.paymentMethodDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPaymentMethods.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaymentMethods.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPaymentMethods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

    },
});
export const { clearPaymentMethodState } = paymentMethodSlice.actions;

export const paymentMethodSliceConfig = configureSlice(paymentMethodSlice, false);


