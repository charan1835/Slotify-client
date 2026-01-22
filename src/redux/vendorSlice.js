import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getVendorsByCategory, getVendorById } from '../api';

export const fetchVendorsByCategory = createAsyncThunk(
  'vendor/fetchVendorsByCategory',
  async (categoryId) => {
    const response = await getVendorsByCategory(categoryId);
    return response.data;
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendor/fetchVendorById',
  async (id) => {
    const response = await getVendorById(id);
    return response.data;
  }
);

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendors: [],
    selectedVendor: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedVendor: (state) => {
      state.selectedVendor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendorsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedVendor } = vendorSlice.actions;

export default vendorSlice.reducer;
