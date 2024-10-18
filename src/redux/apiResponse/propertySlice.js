import { createSlice } from '@reduxjs/toolkit';

export const PropertypoleSlice = createSlice({
  name: 'getproperty',
  initialState: {
    responseData: null,
    property:null,
    loading: false,
    error: null,
  },
  reducers: {
    selectPropertyByUser: (state, action) => {
      state.property=action.payload;
    },
    fetchPropertyDataStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchpropertyDataSuccess: (state, action) => {
      state.loading = false;
      state.responseData = action.payload;

    },
    fetchpropertyDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchPropertyDataStart, fetchpropertyDataSuccess, fetchpropertyDataFailure ,selectPropertyByUser} = PropertypoleSlice.actions;

export const selectPropertyResponseData= (state) => state.getproperty.responseData;

export const selectLoading = state => state.getproperty.loading;
export const selectError = state => state.getproperty.error;
export const selectedPropertyByUser = state => state.getproperty.property;


export default PropertypoleSlice.reducer;