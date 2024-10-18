import { createSlice } from '@reduxjs/toolkit';

export const navBarSlice = createSlice({
  name: 'navBarSlice',
  initialState: { showNavBar: false },
  reducers: {
    setShowNavbar:(state,action)=>{
      state.showNavBar = action.payload;
    }
  },
});

export const { setShowNavbar } = navBarSlice.actions;

export const displayNavbar = (state) => state.navBar.showNavBar;

export default navBarSlice.reducer;