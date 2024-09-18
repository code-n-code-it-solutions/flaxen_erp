import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    debitNote: any;
    debitNotes: any[];
    debitNoteDetails: any;
    debitNotesForPrint: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    debitNote: null,
    debitNotes: [],
    debitNoteDetails: null,
    debitNotesForPrint: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getDebitNotes = createAsyncThunk(
    'debit-note/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/debit-note');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeDebitNote = createAsyncThunk(
    'debit-note/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/debit-note/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getDebitNoteDetail = createAsyncThunk(
    'debit-note/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/debit-note/show/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getDebitNotesForPrint = createAsyncThunk(
    'debit-note/print',
    async (ids: number[], thunkAPI) => {
        try {
            const response = await API.post('/debit-note/print', { ids });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const debitNoteSlice = createSlice({
    name: 'debit-note',
    initialState,
    reducers: {
        clearDebitNoteState: (state) => {
            state.debitNote = null;
            state.debitNoteDetails = null;
            state.debitNotesForPrint = [];
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDebitNotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDebitNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.debitNotes = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getDebitNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeDebitNote.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeDebitNote.fulfilled, (state, action) => {
                state.loading = false;
                state.debitNote = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeDebitNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getDebitNoteDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDebitNoteDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.debitNoteDetails = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getDebitNoteDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getDebitNotesForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDebitNotesForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.debitNotesForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getDebitNotesForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearDebitNoteState } = debitNoteSlice.actions;
export const debitNoteSliceConfig = configureSlice(debitNoteSlice, false);


