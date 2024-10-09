import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from "@/configs/api.config";
import { configureSlice } from "@/utils/helper";

// Define the interface for PayrollComponent
interface IPayrollComponent {
    name: string;
    type: 'earning' | 'deduction'; // 'type' should now be restricted to 'earning' or 'deduction'
}

// Define the interface for PayrollState
interface IPayrollState {
    component: IPayrollComponent | null;
    components: IPayrollComponent[] | null;
    statuses: string[] | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

// Initial state
const initialState: IPayrollState = {
    component: null,
    components: null,
    statuses: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunk to fetch payroll components
export const getPayrollComponents = createAsyncThunk(
    'payrollComponents/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/hrm/salary-component'); // Update to your API endpoint
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch components';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async thunk to fetch payroll statuses
export const getPayrollStatuses = createAsyncThunk(
    'payrollComponents/statuses',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/payroll/components/statuses');
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch statuses';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async thunk to store a new payroll component
export const storePayrollComponent = createAsyncThunk(
    'payrollComponents/store',
    async (data: IPayrollComponent, thunkAPI) => {
        try {
            const response = await API.post('/hrm/salary-component/store', data); // Update to your API endpoint
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to store component';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const updatePayrollComponent = createAsyncThunk(
    'payrollComponents/update',
    async (data: { id: string; componentData: IPayrollComponent }, thunkAPI) => {
        try {
            const { id, componentData } = data;
            const response = await API.put(`/payroll/components/update/${id}`, componentData); // Adjust endpoint
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to update component';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// Create the payroll component slice
const payrollComponentSlice = createSlice({
    name: 'payrollComponents',
    initialState,
    reducers: {
        clearPayrollComponentState: (state) => {
            state.component = null;
            state.components = null;
            state.statuses = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPayrollComponents.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPayrollComponents.fulfilled, (state, action) => {
                state.loading = false;
                state.components = action.payload.data;
                state.success = true;
            })
            .addCase(getPayrollComponents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(storePayrollComponent.pending, (state) => {
                state.loading = true;
            })
            .addCase(storePayrollComponent.fulfilled, (state, action) => {
                state.loading = false;
                state.component = action.payload.data;
                if (state.components) {
                    state.components.push(action.payload.data); // Append to existing components
                } else {
                    state.components = [action.payload.data]; // Create the array if null
                }
                state.success = true;
            })
            .addCase(storePayrollComponent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updatePayrollComponent.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePayrollComponent.fulfilled, (state, action) => {
                state.loading = false;
                state.component = action.payload.data;
                state.success = true;
            })
            .addCase(updatePayrollComponent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getPayrollStatuses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPayrollStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.statuses = action.payload.data;
                state.success = true;
            })
            .addCase(getPayrollStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearPayrollComponentState } = payrollComponentSlice.actions;

// Optionally export slice configuration
export const payrollComponentSliceConfig = configureSlice(payrollComponentSlice, false);
