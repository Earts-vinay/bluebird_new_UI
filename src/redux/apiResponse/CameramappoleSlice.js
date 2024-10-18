import { createSlice } from '@reduxjs/toolkit';

export const CameraMappoleSlice = createSlice({
  name: 'Cameramappole',
  initialState: {
    responseData: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchCameraMapPoleDataStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchCameraMapPoleDataSuccess: (state, action) => {
      state.loading = false;
      state.responseData = action.payload;

    },
    fetchCameraMapPoleDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
  },
});

export const { fetchCameraMapPoleDataStart, fetchCameraMapPoleDataSuccess, fetchCameraMapPoleDataFailure } = CameraMappoleSlice.actions;

export const selectResponseCameraMapPoleData= (state) => state.Cameramappole.responseData;
export const selectLoading = state => state.Cameramappole.loading;
export const selectError = state => state.Cameramappole.error;

export default CameraMappoleSlice.reducer;