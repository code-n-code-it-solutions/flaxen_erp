import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

// Define a type for the slice state
interface UnitState {
    units: any;
    loading: boolean;
    error: any;
}

// Initial state
const initialState: UnitState = {
    units: null,
    loading: false,
    error: null,
};

// Async thunks
export const getUnits = createAsyncThunk(
    'units/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/units');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const unitSlice = createSlice({
    name: 'units',
    initialState,
    reducers: {
        // Sync reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUnits.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUnits.fulfilled, (state, action) => {
                state.loading = false;
                state.units = action.payload.data;
            })
            .addCase(getUnits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const unitSliceConfig = configureSlice(unitSlice, false);
