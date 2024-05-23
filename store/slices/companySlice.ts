import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IStateProps {
    company: any;
    companies: any,
    companyDetail: any
    selectedCompany: any;
    selectedBranch: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IStateProps = {
    company: null,
    companies: null,
    companyDetail: null,
    selectedCompany: null,
    selectedBranch: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getCompanies = createAsyncThunk(
    'company/all',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/company');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getCompanyListByUser = createAsyncThunk(
    'company/list-by-user',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/company/list/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const storeCompany = createAsyncThunk(
    'company/store',
    async (data: any, thunkAPI) => {
        try {
            const response = await API.post('/company', data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to store';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const showDetail = createAsyncThunk(
    'company/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/company/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch detail';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateCompany = createAsyncThunk(
    'company/update',
    async (data: any, thunkAPI) => {
        try {
            const {id, companyData} = data
            const response = await API.post('/company/' + id, companyData);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        clearCompanySlice: (state) => {
            state.company = null;
            state.error = null;
            state.success = false;
            state.companyDetail = null;
            state.selectedCompany = null;
            state.selectedBranch = null;
        },

        setSelectedCompany: (state, action) => {
            state.selectedCompany = action.payload;
        },

        setSelectedBranch: (state, action) => {
            state.selectedBranch = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCompanies.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCompanies.fulfilled, (state, action) => {
                state.loading = false;
                state.companies = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(storeCompany.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeCompany.fulfilled, (state, action) => {
                state.loading = false;
                state.company = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(storeCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(showDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.companyDetail = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(showDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateCompany.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCompany.fulfilled, (state, action) => {
                state.loading = false;
                state.company = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(updateCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getCompanyListByUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCompanyListByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.companies = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getCompanyListByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {clearCompanySlice, setSelectedCompany, setSelectedBranch} = companySlice.actions;

export const companySliceConfig = configureSlice(companySlice, true);


