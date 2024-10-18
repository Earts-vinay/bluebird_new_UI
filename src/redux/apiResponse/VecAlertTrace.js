import { createSlice } from '@reduxjs/toolkit';

export const VecAlertTraceSlice = createSlice({
  name: 'VecAlertTrace',
  initialState: {
    responseData: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchVecAlertTraceDataStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchVecAlertTraceDataSuccess: (state, action) => {
      state.loading = false;
      state.responseData = action.payload;

    },
    fetchVecAlertTraceDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
  },
});

export const { fetchVecAlertTraceDataStart, fetchVecAlertTraceDataSuccess, fetchVecAlertTraceDataFailure } = VecAlertTraceSlice.actions;

export const selectVecAlertTraceData= (state) => state.VecAlertTrace.responseData;

export const selectLoading = state => state.VecAlertTrace.loading;
export const selectError = state => state.VecAlertTrace.error;

export default VecAlertTraceSlice.reducer;