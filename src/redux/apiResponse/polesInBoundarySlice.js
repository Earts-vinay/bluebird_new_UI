import { createSlice } from '@reduxjs/toolkit';

export const polesInBoundarySlice = createSlice({
  name: 'polesInBoundary',
  initialState: [],
  reducers: {
    setPolesInBoundary: (state, action) => {
      return action.payload;
    },
  },
});

export const { setPolesInBoundary } = polesInBoundarySlice.actions;

export default polesInBoundarySlice.reducer;