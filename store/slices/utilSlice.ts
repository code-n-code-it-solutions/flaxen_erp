import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IUTILState {
    code: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IUTILState = {
    code: {},
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const generateCode = createAsyncThunk(
    'utils/generate-code',
    async (type:string, thunkAPI) => {
        try {
            const response = await API.get('/generate-code/'+type);
            return response.data;
        } catch (error:any) {
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
            state.error = null;
            state.success = false;
        },
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
    },
});
export const { clearUtilState } = utilSlice.actions;
export default utilSlice.reducer;
