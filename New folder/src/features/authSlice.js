import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("accessToken");

const initialState = {
  user: null,
  token: token || null,
  isAuthenticated: !!token
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {

    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("accessToken");
    }

  }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;