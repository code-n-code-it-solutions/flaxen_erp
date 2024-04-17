import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IVendorTypeState {
    vendorType: any;
    vendorTypeDetail: any
    allVendorTypes: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IVendorTypeState = {
    vendorType: null,
    vendorTypeDetail: null,
    allVendorTypes: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getVendorTypes = createAsyncThunk(
    'vendorTypes/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/vendor-type');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeVendorType = createAsyncThunk(
    'vendorTypes/store',
    async (data: {name: string, description:string, is_active:boolean}, thunkAPI) => {
        try {
            const response = await API.post('/vendor-type', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const vendorTypeSlice = createSlice({
    name: 'vendorTypes',
    initialState,
    reducers: {
        clearVendorTypeState: (state) => {
            state.vendorType = null;
            state.error = null;
            state.success = false;
            state.vendorTypeDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVendorTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.allVendorTypes = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendorTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeVendorType.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeVendorType.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorType = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeVendorType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearVendorTypeState } = vendorTypeSlice.actions;

export const vendorTypeSliceConfig = configureSlice(vendorTypeSlice, false);
