import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IState {
    loginActivities: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    loginActivities: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getLoginActivities = createAsyncThunk(
    'login-activity/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/login-activity');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const loginActivitySlice = createSlice({
    name: 'login-activity',
    initialState,
    reducers: {
        clearLoginActivityState: (state) => {
            state.loginActivities = null;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLoginActivities.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLoginActivities.fulfilled, (state, action) => {
                state.loading = false;
                state.loginActivities = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getLoginActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearLoginActivityState } = loginActivitySlice.actions;

export const loginActivitySliceConfig = configureSlice(loginActivitySlice, false);


