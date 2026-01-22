// client/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './categorySlice';
import vendorReducer from './vendorSlice';
import bookingReducer from './bookingSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    vendor: vendorReducer,
    booking: bookingReducer,
    auth: authReducer,
  },
});