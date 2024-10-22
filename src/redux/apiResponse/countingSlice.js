// src/redux/apiResponse/countingSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BaseUrl = process.env.REACT_APP_API_URL;

// Thunk to fetch data list
export const fetchDataList = createAsyncThunk(
  'counting/fetchDataList',
  async ({ propertyId, startDate, endDate, token }) => {
    const response = await axios.get(`${BaseUrl}/api/counting/property`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        property_id: propertyId,
        time_type: 'date',
        start_time: startDate,
        end_time: endDate,
      },
    });
    return response.data.data[0].list;
  }
);

// Thunk to fetch count list by hour
export const fetchCountListHour = createAsyncThunk(
  'counting/fetchCountListHour',
  async ({ propertyId, startonlytime, endonlytime, token }) => {
    const response = await axios.get(`${BaseUrl}/api/counting/property`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        property_id: propertyId,
        time_type: 'hour',
        start_time: startonlytime,
        end_time: endonlytime,
      },
    });
    console.log("iedhfidfhdfheifhoae",response.data.data[0].list);
    return response.data.data[0].list;
   
    
  }
);

// Thunk to fetch last 7 days count
export const fetchLast7Count = createAsyncThunk(
  'counting/fetchLast7Count',
  async ({ propertyId, start7thTime, end7thTime, token }) => {
    const response = await axios.get(`${BaseUrl}/api/counting/property`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        property_id: propertyId,
        time_type: 'hour',
        start_time: start7thTime,
        end_time: end7thTime,
      },
    });
    return response.data.data[0].list;
  }
);

const countingSlice = createSlice({
  name: 'counting',
  initialState: {
    dataList: [],
    countListHour: [],
    last7Count: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDataList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dataList = action.payload;
      })
      .addCase(fetchDataList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCountListHour.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCountListHour.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.countListHour = action.payload;
      })
      .addCase(fetchCountListHour.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchLast7Count.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLast7Count.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.last7Count = action.payload;
      })
      .addCase(fetchLast7Count.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default countingSlice.reducer;
