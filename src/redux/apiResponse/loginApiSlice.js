import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const loginApiSlice = createSlice({
  name: "loginApi",
  initialState: { token: null, user: null, expire: null, error: null },
  reducers: {
    setLoginApiResponse: (state, action) => {
      const { code, data, msg } = action.payload;
      if (code === 200) {
        state.token = data.token;
        state.user = data.user;
        state.expire = data.expire;
        state.error = null;

        // Store token in cookies
        Cookies.set("user_token", data.token, { expires: data.expire / (24 * 60 * 60) });
      } else {
        state.token = null;
        state.user = null;
        state.error = msg;

        // Remove token from cookies on failure
        Cookies.remove("user_token");
      }
    },
    clearTokenAndUser: (state) => {
      state.token = null;
      state.user = null;
      state.expire = null;
      state.error = null;

      // Remove token from cookies when logging out
      Cookies.remove("user_token");
    },
  },
});

export const { setLoginApiResponse, clearTokenAndUser } = loginApiSlice.actions;

export const selectLoginApiResponse = (state) => state.loginApi;
export const selectToken = () => Cookies.get("user_token");
export const getTokenExpiry = (state) => state.loginApi.expire;

export default loginApiSlice.reducer;
