import { createSlice } from '@reduxjs/toolkit';

export const getpoleSlice = createSlice({
  name: 'getpoleId',
  initialState: {
    responseData: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchpoleDataStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchpoleDataSuccess: (state, action) => {
      state.loading = false;
      state.responseData = action.payload;

    },
    fetchpoleDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
  },
});

export const { fetchpoleDataStart, fetchpoleDataSuccess, fetchpoleDataFailure } = getpoleSlice.actions;

export const selectPoleIDResponseData= (state) => state.getpoleId.responseData;
export const selectLoading = state => state.getpole.loading;
export const selectError = state => state.getpole.error;

export default getpoleSlice.reducer;