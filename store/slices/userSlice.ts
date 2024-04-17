// userSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

// Define a type for the slice state
interface IUserState {
    user: any;
    token: string;
    isLoggedIn: boolean;
    loading: boolean;
    error: any;
}

// Initial state
const initialState: IUserState = {
    user: null,
    token: '',
    isLoggedIn: false,
    loading: false,
    error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
    'user/login',
    async (userData: any, thunkAPI) => {
        try {
            const response = await API.post('/login', userData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, thunkAPI) => {
        try {
            const response = await API.post('/logout');
            return response.status === 200
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to logout';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Sync reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.error = action.error.message;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = '';
                state.isLoggedIn = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.token = '';
                state.isLoggedIn = false;
            });
    },
});

// Export reducer

export const userSliceConfig = configureSlice(userSlice, true);
