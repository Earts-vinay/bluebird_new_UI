import { createSlice } from "@reduxjs/toolkit";

export const loginApiSlice = createSlice({
  name: "loginApi",
  initialState: { token: null, user: null, error: null },
  reducers: {
    setLoginApiResponse: (state, action) => {
      const { code, data, msg } = action.payload;
      if (code === 200) {
        state.token = data.token;
        state.user = data.user;
        state.expire = data.expire;
        state.error = null;

        // Store token in localStorage as user_token
        localStorage.setItem("user_token", data.token);
      } else {
        state.token = null;
        state.user = null;
        state.error = msg;

        // Remove token from localStorage on failure
        localStorage.removeItem("user_token");
      }
    },
    clearTokenAndUser: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;

      // Remove token from localStorage when logging out
      localStorage.removeItem("user_token");
    },
  },
});

export const { setLoginApiResponse, clearTokenAndUser } = loginApiSlice.actions;

export const selectLoginApiResponse = (state) => state.loginApi;
export const selectToken = () => localStorage.getItem('user_token');
export const getTokenExpiry = (state) => state.loginApi.expire;

export default loginApiSlice.reducer;
