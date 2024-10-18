import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    error: null,
    avatarUrl: null, 
  },
  reducers: {
    setAuthentication: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    setAuthenticationError: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    clearAuthentication: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    setAvatarUrl: (state, action) => { 
      state.avatarUrl = action.payload;
    },
  }
});

export const { setAuthentication, setAuthenticationError,setAvatarUrl, clearAuthentication } = authSlice.actions;

export const selectAuthentication = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthenticationError = (state) => state.auth.error;
export const selectAvatarUrl = state => state.auth.avatarUrl; 


export default authSlice.reducer;
