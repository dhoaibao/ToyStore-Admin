import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: "user",
  initialState: {
    permissions: [],
    user: null,
    userId: null,
    isLogin: false,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload?.userId;
      state.user = action.payload;
      state.permissions = action.payload?.role?.permissions || [];
      state.isLogin = !!action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;