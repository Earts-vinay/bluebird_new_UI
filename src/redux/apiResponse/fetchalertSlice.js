import { createSlice } from '@reduxjs/toolkit';

export const FetchPoleSlice = createSlice({
  name: 'getalert',
  initialState: {
    responseData: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchalertDataStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchalertDataSuccess: (state, action) => {
      state.loading = false;
      state.responseData = action.payload;

    },
    fetchalertDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
  },
});

export const { fetchalertDataStart, fetchalertDataSuccess, fetchalertDataFailure } = FetchPoleSlice.actions;

export const selectAlertResponseData= (state) => state.getalert.responseData;
export const selectLoading = state => state.getpole.loading;
export const selectError = state => state.getpole.error;

export default FetchPoleSlice.reducer;