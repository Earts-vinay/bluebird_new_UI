import { createSlice } from '@reduxjs/toolkit';

export const MappoleSlice = createSlice({
  name: 'Mappole',
  initialState: {
    responseData: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchMapPoleDataStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchMapPoleDataSuccess: (state, action) => {
      state.loading = false;
      state.responseData = action.payload;

    },
    fetchMapPoleDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearResponseMapPoleData: state => {
      state.responseData = null;
    },
    
  },
});

export const { fetchMapPoleDataStart, fetchMapPoleDataSuccess, fetchMapPoleDataFailure , clearResponseMapPoleData } = MappoleSlice.actions;

export const selectResponseMapPoleData= (state) => state.Mappole.responseData;
export const selectLoading = state => state.Mappole.loading;
export const selectError = state => state.Mappole.error;

export default MappoleSlice.reducer;