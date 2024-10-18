import { createSlice } from '@reduxjs/toolkit';

export const mapListpoleSlice = createSlice({
  name: 'maplistpole',
  initialState: {
    responseData: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchMapListDataStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchMapListDataSuccess: (state, action) => {
      state.loading = false;
      state.responseData = action.payload;

    },
    fetchMapListDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
  },
});

export const { fetchMapListDataStart, fetchMapListDataSuccess, fetchMapListDataFailure } = mapListpoleSlice.actions;

export const selectMapListPoleResponseData= (state) => state.maplistpole?.responseData;
export const selectLoading = state => state.maplistpole.loading;
export const selectError = state => state.maplistpole.error;

export default mapListpoleSlice.reducer;