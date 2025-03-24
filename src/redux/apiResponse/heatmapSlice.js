import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BaseUrl = process.env.REACT_APP_API_URL;

// Async thunk to fetch heatmap data
export const fetchHeatmapData = createAsyncThunk(
  'heatmap/fetchData',
  async ({ token, propertyId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseUrl}/api/stat/week_hour`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { property_id: propertyId, start_time: startDate, end_time: endDate }
      });

      const data = response.data?.data || [];

      // Format data for ApexCharts Heatmap
      return data.map((dayData) => ({
        name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayData.week_date], // Get correct weekday
        data: dayData.hour_list.map(hourEntry => ({
          x: hourEntry.hour_time, 
          y: hourEntry.alert_num 
        }))
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
);

const heatmapSlice = createSlice({
  name: 'heatmap',
  initialState: {
    heatmapSeries: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeatmapData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeatmapData.fulfilled, (state, action) => {
        state.loading = false;
        state.heatmapSeries = action.payload;
      })
      .addCase(fetchHeatmapData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default heatmapSlice.reducer;
