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
export const fetchCountingByZone= createAsyncThunk("Insight/fetchCountingByZone", async (requestData, { getState }) => {
    try {
      const token = selectToken(getState()); 
  
      const response = await axios.get(`${BaseUrl}/api/counting/zone`, {
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



const InsightSlice = createSlice({
    name: 'Insight',
    initialState:{
      insightList: [],
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
            state.insightList = action.payload;
          })
          .addCase(fetchCountingByZone.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
    }
  });
  
  export default InsightSlice.reducer;
  
  
 
  