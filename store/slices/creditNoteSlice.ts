import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    creditNote: any;
    creditNotes: any[];
    creditNoteDetails: any;
    creditNotesForPrint: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    creditNote: null,
    creditNotes: [],
    creditNoteDetails: null,
    creditNotesForPrint: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getCreditNotes = createAsyncThunk(
    'credit-note/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/credit-note');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeCreditNote = createAsyncThunk(
    'credit-note/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/credit-note/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getCreditNoteDetail = createAsyncThunk(
    'credit-note/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/credit-note/show/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getCreditNotesForPrint = createAsyncThunk(
    'credit-note/print',
    async (data:any, thunkAPI) => {
        try {
            const response = await API.post('/credit-note/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const creditNoteSlice = createSlice({
    name: 'credit-note',
    initialState,
    reducers: {
        clearCreditNoteState: (state) => {
            state.creditNote = null;
            state.creditNoteDetails = null;
            state.creditNotesForPrint = [];
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCreditNotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCreditNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.creditNotes = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCreditNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeCreditNote.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeCreditNote.fulfilled, (state, action) => {
                state.loading = false;
                state.creditNote = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeCreditNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getCreditNoteDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCreditNoteDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.creditNoteDetails = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCreditNoteDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getCreditNotesForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCreditNotesForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.creditNotesForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCreditNotesForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearCreditNoteState } = creditNoteSlice.actions;

export const creditNoteSliceConfig = configureSlice(creditNoteSlice, false);


