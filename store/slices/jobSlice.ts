import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/configs/api.config';
import { configureSlice } from '@/utils/helper';

interface Job {
    job_code: string;
    title: string;
    type: string;
    nature: string;
    status: string;
    deadline: string;
    no_of_candid: number;
}

interface JobState {
    jobList: Job[];
    jobDetails: Job | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

// Initial state
const initialState: JobState = {
    jobList: [],
    jobDetails: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getJobList = createAsyncThunk(
    'jobs/list',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/jobs');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch job list';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getJobDetails = createAsyncThunk(
    'jobs/details',
    async (job_code: string, thunkAPI) => {
        try {
            const response = await API.get(`/jobs/${job_code}`);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch job details';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createJob = createAsyncThunk(
    'jobs/create',
    async (job: Job, thunkAPI) => {
        try {
            const response = await API.post('/jobs', job);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to create job';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const showDetails = createAsyncThunk(
    'jobs/show',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/job/' + id);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const updateJob = createAsyncThunk(
    'jobs/update',
    async (job: Job, thunkAPI) => {
        try {
            const response = await API.put(`/jobs/${job.job_code}`, job);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update job';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const editJob = createAsyncThunk(
    'job/edit',
    async (id: number, thunkAPI) => {
        try {
            const response = await API.get('/job/edit/' + id);
            // console.log(response);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to edit';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const deleteJob = createAsyncThunk(
    'jobs/delete',
    async (job_code: string, thunkAPI) => {
        try {
            const response = await API.delete(`/jobs/${job_code}`);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete job';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
export const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        clearJobState: (state) => {
            state.jobList = [];
            state.jobDetails = null;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getJobList.pending, (state) => {
                state.loading = true;
            })
            .addCase(getJobList.fulfilled, (state, action) => {
                state.loading = false;
                state.jobList = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getJobList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(getJobDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getJobDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.jobDetails = action.payload.data;
                state.success = action.payload.success;
            })
            .addCase(getJobDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(createJob.pending, (state) => {
                state.loading = true;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(createJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(updateJob.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(deleteJob.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            });
    },
});

export const { clearJobState } = jobSlice.actions;

export const jobSliceConfig = configureSlice(jobSlice, false);

export default jobSlice.reducer;
