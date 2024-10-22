import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { selectToken } from './loginApiSlice';
const BaseUrl = process.env.REACT_APP_API_URL;

// Thunk to Get fetch Counting by Property
export const fetchCountingByProperty = createAsyncThunk("Insight/fetchCountingByProperty", async (requestData, { getState }) => {
    try {
      const token = selectToken(getState()); 
  
      const response = await axios.get(`${BaseUrl}/api/counting/property`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: requestData, 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  });

// Thunk to Get a Counting By Pole
export const fetchCountingByPole = createAsyncThunk("Insight/fetchCountingByPole", async (requestData, { getState }) => {
    try {
      const token = selectToken(getState()); 
  
      const response = await axios.get(`${BaseUrl}/api/counting/pole`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: requestData, 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  });


  // Thunk to Get a Counting by Zone

  export const fetchCountingByZone = createAsyncThunk(
    'insight/fetchCountingByZone',
    async ({ propertyId, startDate, endDate, token }) => {
      const response = await axios.get(`${BaseUrl}/api/counting/zone`, {
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
      console.log("zoonecount",response.data);
      
      return response.data.data;
    }
  );

const InsightSlice = createSlice({
    name: 'Insight',
    initialState:{
      insightList: [],
      zonecount:[],
      status: 'idle',
      error: null,
    },
      
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchCountingByProperty.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchCountingByProperty.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.insightList = action.payload;
        })
        .addCase(fetchCountingByProperty.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(fetchCountingByPole.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchCountingByPole.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.insightList = action.payload;
          })
          .addCase(fetchCountingByPole.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(fetchCountingByZone.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchCountingByZone.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.zonecount = action.payload;
          })
          .addCase(fetchCountingByZone.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
    }
  });
  
  export default InsightSlice.reducer;
  
  
 
  