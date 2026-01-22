import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';

export const sendOtp = createAsyncThunk('auth/sendOtp', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.sendOtp(formData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.verifyOtp(formData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Invalid OTP");
    }
});

export const updateUserProfile = createAsyncThunk('auth/updateUserProfile', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.updateUserProfile(formData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Update failed");
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('profile');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                localStorage.setItem('profile', JSON.stringify(action.payload));
                state.user = action.payload;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                localStorage.setItem('profile', JSON.stringify(action.payload));
                state.user = action.payload; // Update user with new data
                state.token = action.payload.token;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
