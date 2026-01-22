import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBooking, getVendorBookings, updateBookingStatus, getUserBookings } from '../api';

export const fetchVendorBookings = createAsyncThunk(
  'booking/fetchVendorBookings',
  async () => {
    const response = await getVendorBookings();
    return response.data;
  }
);

export const fetchUserBookings = createAsyncThunk(
  "booking/fetchUserBookings",
  async () => {
    const response = await getUserBookings();
    return response.data;
  }
);

export const addBooking = createAsyncThunk(
  'booking/addBooking',
  async (bookingData) => {
    const response = await createBooking(bookingData);
    return response.data;
  }
);

export const changeBookingStatus = createAsyncThunk(
  'booking/changeBookingStatus',
  async ({ id, statusData }) => {
    const response = await updateBookingStatus(id, statusData);
    return response.data;
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchVendorBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(changeBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(changeBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bookingSlice.reducer;
