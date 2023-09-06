import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    clearUser: (state) => {
      state.userData = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
