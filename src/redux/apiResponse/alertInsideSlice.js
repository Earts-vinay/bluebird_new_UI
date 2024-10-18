import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

export const alertInsideSlice = createSlice({
  name: 'alertInside',
  initialState: {
    selectedDate:moment().format("YYYY-MM-DD"),
    mapselectedDate:moment().format("YYYY-MM-DD"),
    isAlert:null
  },
  reducers: {
    setSelectedDateSlice: (state, action) => {
      state.selectedDate=action.payload;
    },
    setSelectedMapListDateSlice: (state, action) => {
      state.mapselectedDate = action.payload;
    },
    setIsAlertInfo: (state, action) => {
      state.isAlert = action.payload;
    }
  }
});

export const { setSelectedDateSlice, setSelectedMapListDateSlice,setIsAlertInfo } = alertInsideSlice.actions;
export const getIsAlertInfo = (state) => state.alertInside.isAlert;

export default alertInsideSlice.reducer;
