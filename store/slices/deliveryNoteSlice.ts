import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IState {
    deliveryNote: any;
    deliveryNoteDetail: any
    deliveryNotes: any[];
    deliveryNoteItems: any[];
    deliveryNotesForPrint: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    deliveryNote: null,
    deliveryNoteDetail: null,
    deliveryNotes: [],
    deliveryNoteItems: [],
    deliveryNotesForPrint: [],
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getDeliveryNotes = createAsyncThunk(
    'delivery-note/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/delivery-note');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const showDetails = createAsyncThunk(
    'delivery-note/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/delivery-note/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeDeliveryNote = createAsyncThunk(
    'delivery-note/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/delivery-note', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getDeliveryNoteItems = createAsyncThunk(
    'delivery-note/delivery-note-items',
    async (ids: number[], thunkAPI) => {
        try {
            const response = await API.post('/delivery-note/items', {ids});
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const pendingDeliveryNotes = createAsyncThunk(
    'delivery-note/pending-delivery-note',
    async (data:any, thunkAPI) => {
        try {
            const response = await API.post('/delivery-note/pending', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getDeliveryNotesForPrint = createAsyncThunk(
    'delivery-note/print',
    async (data:any, thunkAPI) => {
        try {
            const response = await API.post('/delivery-note/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const deliveryNoteSlice = createSlice({
    name: 'delivery-note',
    initialState,
    reducers: {
        clearDeliveryNoteState: (state) => {
            state.deliveryNote = null;
            state.error = null;
            state.success = false;
            state.deliveryNoteDetail = null;
            state.deliveryNoteItems = [];
            state.deliveryNotesForPrint = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDeliveryNotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDeliveryNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.deliveryNotes = action.payload.data;
            })
            .addCase(getDeliveryNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.deliveryNoteDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeDeliveryNote.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeDeliveryNote.fulfilled, (state, action) => {
                state.loading = false;
                state.deliveryNote = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeDeliveryNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getDeliveryNoteItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDeliveryNoteItems.fulfilled, (state, action) => {
                state.loading = false;
                state.deliveryNoteItems = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getDeliveryNoteItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(pendingDeliveryNotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(pendingDeliveryNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.deliveryNotes = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(pendingDeliveryNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getDeliveryNotesForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDeliveryNotesForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.deliveryNotesForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getDeliveryNotesForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearDeliveryNoteState} = deliveryNoteSlice.actions;

export const deliveryNoteSliceConfig = configureSlice(deliveryNoteSlice, false);
