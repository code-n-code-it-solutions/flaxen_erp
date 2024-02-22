import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";

interface IProductCategoryState {
    countries: any;
    states: any
    cities: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IProductCategoryState = {
    countries: null,
    states: null,
    cities: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getCountries = createAsyncThunk(
    'location/countries',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/countries');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getStates = createAsyncThunk(
    'location/states',
    async (countryId: number, thunkAPI) => {
        try {
            const response = await API.get('/states/'+countryId);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getCities = createAsyncThunk(
    'location/cities',
    async ({countryId, stateId}: {countryId: number, stateId: number}, thunkAPI) => {
        try {
            const response = await API.get('/cities/'+countryId+'/'+stateId);
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const locationSlice = createSlice({
    name: 'productCategory',
    initialState,
    reducers: {
        clearLocationState: (state) => {
            state.countries = null;
            state.states = null;
            state.cities = null;
            state.error = null;
            state.success = false;
        },
        clearState: (state) => {
            state.states = null;
            state.cities = null;
            state.error = null;
            state.success = false;
        },
        clearCity: (state) => {
            state.cities = null;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCountries.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCountries.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = action.payload.data;
            })
            .addCase(getCountries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getStates.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStates.fulfilled, (state, action) => {
                state.loading = false;
                state.states = action.payload.data;
            })
            .addCase(getStates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getCities.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCities.fulfilled, (state, action) => {
                state.loading = false;
                state.cities = action.payload.data;
            })
            .addCase(getCities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

    },
});
export const { clearLocationState, clearState, clearCity } = locationSlice.actions;
export default locationSlice.reducer;
