import { createSlice } from '@reduxjs/toolkit';

export const propertyApiSlice = createSlice({
  name: 'loginApi',
  initialState: { property: null },
  reducers: {
    selectProperty: (state, action) => {
      
    },
  },
});

export const { selectProperty } = propertyApiSlice.actions;
export default propertyApiSlice.reducer;
