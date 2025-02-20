import { configureStore } from '@reduxjs/toolkit';
import userSlice from "./slices/userSlice";
import addressSlice from "./slices/addressSlice"

const store = configureStore({
  reducer: {
    user: userSlice,
    address: addressSlice,
  },
});

export default store;