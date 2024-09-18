import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IUTILState {
    code: any;
    latestRecord: any;
    rawProductCode: any;
    subjects: any[];
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IUTILState = {
    code: {},
    latestRecord: null,
    rawProductCode: null,
    subjects: [],
    loading: false,
    error: null,
    success: false
};

// Async thunks
export const generateCode = createAsyncThunk(
    'utils/generate-code',
    async (type: string, thunkAPI) => {
        try {
            const response = await API.get('/generate-code/' + type);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const generateRawProductCode = createAsyncThunk(
    'utils/raw-product-code',
    async (productCategoryId: number, thunkAPI) => {
        try {
            const response = await API.get('/raw-products/generate-code/' + productCategoryId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getLatestRecord = createAsyncThunk(
    'utils/latest-record',
    async (type: string, thunkAPI) => {
        try {
            const response = await API.get('/latest-record/' + type);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getSubjects = createAsyncThunk(
    'subjects',
    async (subjectType:string, thunkAPI) => {
        try {
            const response = await API.post('/subjects', {subjectType});
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const utilSlice = createSlice({
    name: 'utils',
    initialState,
    reducers: {
        clearUtilState: (state) => {
            state.code = {};
            state.rawProductCode = null;
            state.error = null;
            state.success = false;
        },
        clearLatestRecord: (state) => {
            state.latestRecord = null;
        },
        clearSubjectListState: (state) => {
            state.subjects = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateCode.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateCode.fulfilled, (state, action) => {
                state.loading = false;
                state.code = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(generateCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getLatestRecord.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLatestRecord.fulfilled, (state, action) => {
                state.loading = false;
                state.latestRecord = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getLatestRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(generateRawProductCode.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateRawProductCode.fulfilled, (state, action) => {
                state.loading = false;
                state.rawProductCode = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(generateRawProductCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getSubjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubjects.fulfilled, (state, action) => {
                state.loading = false;
                state.subjects = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getSubjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const {
    clearUtilState,
    clearLatestRecord,
    clearSubjectListState
} = utilSlice.actions;

export const utilSliceConfig = configureSlice(utilSlice, false);
