import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { selectToken } from './loginApiSlice';
const BaseUrl = process.env.REACT_APP_API_URL;

// Thunk to create a fetch Alert List
export const fetchAlertList = createAsyncThunk("Alert/fetchAlertList", async (requestData, { getState }) => {
  try {
    const token = selectToken(getState()); 
    const response = await axios.get(`${BaseUrl}/api/vec_alert?property_id=1`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Thunk to Get a Alert Resolved
export const fetchAlerResolved = createAsyncThunk("Alert/fetchAlertResolved", async (id, { getState }) => {
    try {
      const token = selectToken(getState()); 
  
      const response = await axios.get(`${BaseUrl}/api/vec_alert/resolved`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data:id, 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  });


  // Thunk to Get a Alert Statistics
export const fetchAlertStatistics = createAsyncThunk("Alert/fetchAlertStatistics", async (requestData, { getState }) => {
    try {
      const token = selectToken(getState()); 
  
      const response = await axios.get(`${BaseUrl}/api/vec_alert/stat`, {
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

  
  // Thunk to Get a Alert Stat By Property
  export const fetchVehicleData = createAsyncThunk(
    'Alert/fetchVehicleData',
    async ({ propertyId, startDate, endDate }, {getState, rejectWithValue }) => {
      const token = selectToken(getState());
      try {
        const response = await axios.get(`${BaseUrl}/api/vec_alert/property`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            property_id: propertyId,
            time_type: 'date',
            start_time: startDate,
            end_time: endDate,
          },
        });
        console.log("responsive",response);

        if (response.data?.code === 200 && response.data?.data?.length > 0) {
          return response.data.data;
        } else {
          return rejectWithValue('No data found or invalid response');
        }
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error fetching data');
      }
    }
  );

  // Vec_alert By Zone
  export const fetchZoneAlert = createAsyncThunk(
    'Alert/fetchZoneAlert',
    async ({  propertyId, zoneId, startDate, endDate }, {getState, rejectWithValue }) => {
      const token = selectToken(getState());
      try {
        const response = await axios.get(`${BaseUrl}/api/vec_alert/zone`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            property_id: propertyId,
            time_type: 'date',
            zone_id: zoneId,
            start_time: startDate,
            end_time: endDate,
          },
        });
        console.log("xxxxxxxxxxx",response);
        if (response.data?.code === 200 && response.data?.data?.length > 0) {
          return response.data.data;
        } else {
          return rejectWithValue('No data found');
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );


  // Thunk to Get a  Alert Stat By Pole
  export const fetchAlertStatByPole = createAsyncThunk("Alert/fetchAlertStatByPole", async (requestData, { getState }) => {
    try {
      const token = selectToken(getState()); 
  
      const response = await axios.get(`${BaseUrl}/api/vec_alert/pole`, {
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
  
  // Thunk to Get a  Alert Trace
  export const fetchAlertTrace = createAsyncThunk("Alert/fetchAlertTrace", async (requestData, { getState }) => {
    try {
      const token = selectToken(getState()); 
  
      const response = await axios.get(`${BaseUrl}/api/vec_alert/trace`, {
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
  
    // Thunk to Get a Alert Stat By Date
export const fetchAlertStatisticsByDate = createAsyncThunk("Alert/fetchAlertStatisticsByDate", async (requestData, { getState }) => {
    try {
      const token = selectToken(getState()); 
  
      const response = await axios.get(`${BaseUrl}/api/vec_alert/stat_date`, {
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

      // Thunk to Get a Alert Stat By Hour
export const fetchAlertStatisticsByHour = createAsyncThunk("Alert/fetchAlertStatisticsByHour", async (requestData, { getState }) => {
    try {
      const token = selectToken(getState()); 
  
      const response = await axios.get(`${BaseUrl}/api/vec_alert/stat_hour`, {
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

        // Thunk to Get a Alert By Id
export const fetchAlertById = createAsyncThunk("Alert/fetchAlertById", async (id, { getState }) => {
    try {
      const token = selectToken(getState()); 
  
      const response = await axios.get(`${BaseUrl}/api/vec_alert/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  });
  
const AlertSlice = createSlice({
    name: 'Alert',
    initialState:{
      alertList: [],
      vecAlert:[],
      zoneAlert: [],
      status: 'idle',
      error: null,
    },
      
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAlertList.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchAlertList.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.alertList = action.payload;
        })
        .addCase(fetchAlertList.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(fetchAlerResolved.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchAlerResolved.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.alertList = action.payload;
          })
          .addCase(fetchAlerResolved.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(fetchAlertStatistics.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchAlertStatistics.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.alertList = action.payload;
          })
          .addCase(fetchAlertStatistics.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          //vec_alert/property
          .addCase(fetchVehicleData.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchVehicleData.fulfilled, (state, action) => {
            console.log("aaaaaaaaaaa",action.payload);
            state.loading = false;
            state.vecAlert = action.payload;
          })
          .addCase(fetchVehicleData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Error fetching data';
          })
          ///api/vec_alert/zone
          .addCase(fetchZoneAlert.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchZoneAlert.fulfilled, (state, action) => {
            console.log("Axxxx",action.payload)
            state.loading = false;
            state.zoneAlert = action.payload;
          })
          .addCase(fetchZoneAlert.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })

          .addCase(fetchAlertStatByPole.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchAlertStatByPole.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.alertList = action.payload;
          })
          .addCase(fetchAlertStatByPole.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(fetchAlertTrace.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchAlertTrace.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.alertList = action.payload;
          })
          .addCase(fetchAlertTrace.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(fetchAlertStatisticsByDate.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchAlertStatisticsByDate.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.alertList = action.payload;
          })
          .addCase(fetchAlertStatisticsByDate.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(fetchAlertStatisticsByHour.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchAlertStatisticsByHour.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.alertList = action.payload;
          })
          .addCase(fetchAlertStatisticsByHour.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(fetchAlertById.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchAlertById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.alertList = action.payload;
          })
          .addCase(fetchAlertById.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          });
    }
  });
  
  export default AlertSlice.reducer;
  
  
 
  