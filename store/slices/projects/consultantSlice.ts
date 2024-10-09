import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    consultant: any;
    consultantDetail: any;
    consultants: any[];
    consultantsForPrint: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    consultant: null,
    consultantDetail: null,
    consultants: [],
    consultantsForPrint: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const getConsultants = createAsyncThunk(
    'consultant/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/project/consultant');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeConsultant = createAsyncThunk(
    'consultant/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/project/consultant/store', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showDetails = createAsyncThunk(
    'consultant/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/project/consultant/show/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getConsultantsForPrint = createAsyncThunk(
    'consultant/print',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/project/consultant/print', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const consultantSlice = createSlice({
    name: 'consultant',
    initialState,
    reducers: {
        clearConsultantState: (state) => {
            state.consultant = null;
            state.error = null;
            state.success = false;
            state.consultantDetail = null;
            state.consultantsForPrint = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getConsultants.pending, (state) => {
                state.loading = true;
            })
            .addCase(getConsultants.fulfilled, (state, action) => {
                state.loading = false;
                state.consultants = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getConsultants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeConsultant.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeConsultant.fulfilled, (state, action) => {
                state.loading = false;
                state.consultant = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeConsultant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.consultantDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getConsultantsForPrint.pending, (state) => {
                state.loading = true;
            })
            .addCase(getConsultantsForPrint.fulfilled, (state, action) => {
                state.loading = false;
                state.consultantsForPrint = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getConsultantsForPrint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearConsultantState } = consultantSlice.actions;
export const consultantSliceConfig = configureSlice(consultantSlice, false);

