import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IEmployeeState {
    employee: any;
    employeeDetail: any
    employees: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IEmployeeState = {
    employee: null,
    employeeDetail: null,
    employees: null,
    loading: false,
    error: null,
    success: false,
};

interface IEmployeeForm {
    employee_code: string;
    name: string;
    phone: string,
    email: string,
    postal_code: string,
    address: string,
    date_of_joining: string,
    passport_number: string,
    id_number: string,
    department_id: number,
    designation_id: number,
    country_id: number,
    state_id: number,
    city_id: number,
    image: File | null;
    bank_accounts: any[];
    is_active: boolean;
}

// Async thunks
export const getEmployees = createAsyncThunk(
    'employees/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/employee');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeEmployee = createAsyncThunk(
    'employees/store',
    async (data: IEmployeeForm, thunkAPI) => {
        try {
            const response = await API.post('/employee', data);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showDetails = createAsyncThunk(
    'employees/show',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.get('/employee/'+id);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editEmployee = createAsyncThunk(
    'employees/edit',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.get('/employee/edit/'+id);
            console.log(response)
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to edit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/update',
    async (data:any, thunkAPI) => {
        try {
            const {id, rawProductData} = data
            console.log(id, rawProductData)
            const response = await API.post('/employee/update/'+id, rawProductData);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to login';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    'employees/delete',
    async (id:number, thunkAPI) => {
        try {
            const response = await API.delete('/employee/'+id);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        clearEmployeeState: (state) => {
            state.employee = null;
            state.error = null;
            state.success = false;
            state.employeeDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEmployees.pending, (state) => {
                state.loading = true;
            })
            .addCase(getEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employee = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.employeeDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(editEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(editEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employeeDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(editEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employee = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const { clearEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;
