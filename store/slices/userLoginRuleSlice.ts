import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface IState {
    userLoginRule: any;
    userLoginRuleDetail: any;
    userLoginRules: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IState = {
    userLoginRule: null,
    userLoginRuleDetail: null,
    userLoginRules: null,
    loading: false,
    error: null,
    success: false
};


// Async thunks
export const getUserLoginRules = createAsyncThunk(
    'user-login-rule/get-login-rules',
    async (userId: number, thunkAPI) => {
        try {
            const response = await API.get('/user/get-login-rules/' + userId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeUserLoginRule = createAsyncThunk(
    'user-login-rule/store-login-rule',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/user/store-login-rule', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteUserLoginRule = createAsyncThunk(
    'user-login-rule/delete-login-rule',
    async (ruleId: number, thunkAPI) => {
        try {
            const response = await API.get('/user/delete-login-rule/' + ruleId);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const userLoginRuleSlice = createSlice({
    name: 'user-login-rule',
    initialState,
    reducers: {
        clearUserLoginRuleState: (state) => {
            state.userLoginRule = null;
            state.error = null;
            state.success = false;
            state.userLoginRuleDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserLoginRules.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserLoginRules.fulfilled, (state, action) => {
                state.loading = false;
                state.userLoginRules = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getUserLoginRules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeUserLoginRule.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeUserLoginRule.fulfilled, (state, action) => {
                state.loading = false;
                state.userLoginRule = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeUserLoginRule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteUserLoginRule.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUserLoginRule.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteUserLoginRule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
export const { clearUserLoginRuleState } = userLoginRuleSlice.actions;

export const userLoginRuleSliceConfig = configureSlice(userLoginRuleSlice, false);
