import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API} from "@/configs/api.config";
import {configureSlice} from "@/utils/helper";

interface IMenusState {
    permittedMenus: any;
    activeModule: any;
    moduleMenus: any;
    loading: boolean;
    error: any;
    success: boolean;
}

// Initial state
const initialState: IMenusState = {
    permittedMenus: null,
    activeModule: null,
    moduleMenus: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getPermittedMenu = createAsyncThunk(
    'menus/permitted',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/menu');
            return response.data;
        } catch (error:any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const menuSlice = createSlice({
    name: 'menus',
    initialState,
    reducers: {
        clearMenuState: (state) => {
            state.permittedMenus = null;
            state.activeModule = null;
            state.moduleMenus = null;
            state.error = null;
            state.success = false;
        },
        setActiveModule: (state, action) => {
            state.activeModule = action.payload;
        },
        setModuleMenus: (state, action) => {
            state.moduleMenus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPermittedMenu.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPermittedMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.permittedMenus = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getPermittedMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {
    clearMenuState,
    setModuleMenus,
    setActiveModule } = menuSlice.actions;

export const menuSliceConfig = configureSlice(menuSlice, true);
