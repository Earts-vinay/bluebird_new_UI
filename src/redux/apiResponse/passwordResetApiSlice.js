import { createSlice } from '@reduxjs/toolkit';

export const PasswordResetApiSlice = createSlice({
  name: 'resetPasswordApi',
  initialState: { token: null, user: null, error: null },
  reducers: {
    setPasswordResetApiResponse: (state, action) => {
      const { code, data, msg } = action.payload;
      if (code === 200) {
        state.token = data.token;
        state.user = data.user;
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
    },
  },
});

export const { setPasswordResetApiResponse, clearTokenAndUser } = PasswordResetApiSlice.actions;

export const selectPasswordResetApiResponse = (state) => state.loginApi;
export const selectToken = (state) => state.loginApi.token;

export default PasswordResetApiSlice.reducer;
