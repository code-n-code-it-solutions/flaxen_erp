import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IFillingState {
    filling: any;
    fillingDetail: any;
    fillings: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IFillingState = {
    filling: null,
    fillingDetail: null,
    fillings: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getFillings = createAsyncThunk(
    'fillings/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/filling');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const showDetails = createAsyncThunk(
    'fillings/show',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.get('/filling/'+id);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeFilling = createAsyncThunk(
    'fillings/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/filling', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editFilling = createAsyncThunk(
    'fillings/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/filling/edit/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to edit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateFilling = createAsyncThunk(
    'fillings/update',
    async (data: any, thunkAPI) => {
        try {
            const {id, fillingData} = data
            const response = await API.put('/filling/update/' + id, fillingData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const deleteFilling = createAsyncThunk(
    'fillings/delete',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.delete('/filling/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const pendingFillings = createAsyncThunk(
    'fillings/pending',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/filling/list/pending');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const fillingSlice = createSlice({
    name: 'fillings',
    initialState,
    reducers: {
        clearFillingState: (state) => {
            state.filling = null;
            state.error = null;
            state.success = false;
            state.fillingDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFillings.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFillings.fulfilled, (state, action) => {
                state.loading = false;
                state.fillings = action.payload.data;
            })
            .addCase(getFillings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeFilling.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeFilling.fulfilled, (state, action) => {
                state.loading = false;
                state.filling = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeFilling.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(editFilling.pending, (state) => {
                state.loading = true;
            })
            .addCase(editFilling.fulfilled, (state, action) => {
                state.loading = false;
                state.fillingDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(editFilling.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateFilling.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateFilling.fulfilled, (state, action) => {
                state.loading = false;
                state.filling = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateFilling.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteFilling.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteFilling.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteFilling.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(pendingFillings.pending, (state) => {
                state.loading = true;
            })
            .addCase(pendingFillings.fulfilled, (state, action) => {
                state.loading = false;
                state.fillings = action.payload.data;
            })
            .addCase(pendingFillings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.fillingDetail= action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearFillingState} = fillingSlice.actions;

export const fillingSliceConfig = configureSlice(fillingSlice, false);
