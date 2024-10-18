import { createSlice } from '@reduxjs/toolkit';

export const PropertyListViewSlice = createSlice({
  name: 'propertylistview',
  initialState: {
    responseData: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchPropertylistDataStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchPropertylistDataSuccess: (state, action) => {
      state.loading = false;
      state.responseData = action.payload;

    },
    fetchPropertylistDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
  },
});

export const { fetchPropertylistDataStart, fetchPropertylistDataSuccess, fetchPropertylistDataFailure } = PropertyListViewSlice.actions;

export const selectPropertylistResponseData= (state) => state.propertylistview.responseData;
export const selectLoading = state => state.propertylistview.loading;
export const selectError = state => state.propertylistview.error;

export default PropertyListViewSlice.reducer;