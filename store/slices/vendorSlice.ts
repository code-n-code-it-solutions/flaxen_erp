import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IVendorState {
    vendor: any;
    vendorDetail: any
    allVendors: any;
    vendorsForPrint: any
    loading: boolean;
    error: any;
    success: boolean;
    representatives: any;
}

// Initial state
const initialState: IVendorState = {
    vendor: null,
    vendorDetail: null,
    allVendors: null,
    vendorsForPrint: null,
    loading: false,
    error: null,
    success: false,
    representatives: null,
};

// Async thunks
export const getVendors = createAsyncThunk(
    'vendors/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/vendor');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeVendor = createAsyncThunk(
    'vendors/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/vendor', data);
            // console.log(response);

            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showDetails = createAsyncThunk(
    'vendors/show',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.get('/vendor/'+id);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteVendor = createAsyncThunk(
    'vendors/delete',
    async (ids:any, thunkAPI) => {
        try {
            const response = await API.post('/vendor/delete', {ids});
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const editVendor = createAsyncThunk(
    'vendors/edit',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.get('/vendor/edit/'+id);
            // console.log(response)
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to edit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const updateVendor = createAsyncThunk(
    'vendors/update',
    async (data:any, thunkAPI) => {
        try {
            const {id, vendorData} = data
            const response = await API.post('/vendor/update/'+id, vendorData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const getRepresentatives = createAsyncThunk(
    'vendors/representatives',
    async (vendorId:number, thunkAPI) => {
        try {
            const response = await API.get('/representatives/' + vendorId);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getVendorsForPrint = createAsyncThunk(
    'vendors/print',
    async (data:any, thunkAPI) => {
        try {
            const response = await API.post('/vendor/print', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const vendorSlice = createSlice({
    name: 'vendors',
    initialState,
    reducers: {
        clearVendorState: (state) => {
            state.vendor = null;
            state.error = null;
            state.success = false;
            state.vendorDetail = null;
            state.representatives = null;
            state.vendorsForPrint = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVendors.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.allVendors = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeVendor.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeVendor.fulfilled, (state, action) => {
                state.loading = false;
                state.vendor = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(editVendor.pending, (state) => {
                state.loading = true;
            })
            .addCase(editVendor.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(editVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateVendor.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateVendor.fulfilled, (state, action) => {
                state.loading = false;
                state.vendor = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteVendor.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteVendor.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getRepresentatives.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRepresentatives.fulfilled, (state, action) => {
                state.loading = false;
                state.representatives = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getRepresentatives.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getVendorsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVendorsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getVendorsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearVendorState } = vendorSlice.actions;

export const vendorSliceConfig = configureSlice(vendorSlice, false);
