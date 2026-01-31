import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as api from '../api';

// Fetch user notifications
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.fetchNotifications();
            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.markNotificationAsRead(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
        }
    }
);

// Mark all as read
export const markAllNotificationsRead = createAsyncThunk(
    'notifications/markAllRead',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.markAllNotificationsAsRead();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
        }
    }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.deleteNotification(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        // Optimistic update for real-time (can be added later)
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.notifications;
                state.unreadCount = action.payload.unreadCount;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Mark Read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    if (!state.items[index].read) {
                        state.unreadCount = Math.max(0, state.unreadCount - 1);
                    }
                    state.items[index].read = true;
                }
            })
            // Mark All Read
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.items.forEach(item => item.read = true);
                state.unreadCount = 0;
            })
            // Delete
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const item = state.items.find(i => i._id === action.payload);
                if (item && !item.read) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
