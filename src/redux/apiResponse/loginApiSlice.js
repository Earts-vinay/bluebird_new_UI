import { createSlice } from '@reduxjs/toolkit';

export const loginApiSlice = createSlice({
  name: 'loginApi',
  initialState: { token: null, user: null, error: null },
  reducers: {
    setLoginApiResponse: (state, action) => {
      const { code, data, msg } = action.payload;
      if (code === 200) {
        state.token = data.token;
        state.user = data.user;
        state.expire = data.expire;
        state.error = null;
      } else {
        state.token = null;
        state.user = null;
        state.error = msg;
      }
    },
    clearTokenAndUser: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
    }
  },
});

export const { setLoginApiResponse, clearTokenAndUser } = loginApiSlice.actions;

export const selectLoginApiResponse = (state) => state.loginApi;
export const selectToken = (state) => state.loginApi.token;
export const getTokenExpiry = (state) => state.loginApi.expire;


export default loginApiSlice.reducer;
