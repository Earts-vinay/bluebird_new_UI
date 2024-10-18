import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { selectToken } from "./loginApiSlice";
const BaseUrl = process.env.REACT_APP_API_URL;

// Thunk to Get fetch Device List
export const fetchDeviceList = createAsyncThunk(
  "Device/fetchDeviceList",
  async (id, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.get(
        `${BaseUrl}/api/device?property_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          // Use params instead of data for GET requests
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to Get a Device Unhealthy
export const fetchDeviceUnhealthy = createAsyncThunk(
  "device/fetchDeviceUnhealthy",
  async (propertyId, { getState }) => {
    try {
      const token = selectToken(getState());
      const response = await axios.get(`${BaseUrl}/api/device/unhealth`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: { property_id: propertyId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to Get a Device Statistics
export const fetchDeviceStatistics = createAsyncThunk(
  'device/fetchDeviceStatistics',
  async (propertyId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = selectToken(state);
    try {
      const response = await axios.get(`${BaseUrl}/api/device/stat?`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: { property_id: propertyId },
        
      });
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to Get a Device View
export const fetchDeviceViewById = createAsyncThunk(
  "Device/fetchDeviceViewById",
  async (id, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.get(`${BaseUrl}/api/device/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to create a Device Play Video
export const createDevicePlayVideo = createAsyncThunk(
  "Device/createDevicePlayVideo",
  async (formData, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.post(
        `${BaseUrl}/api/device/play`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
// Thunk to create a  Device Pair
export const createDevicePair = createAsyncThunk(
  "Device/createDevicePair",
  async (formData, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.post(
        `${BaseUrl}/api/device/pair`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to create a  Device unpair
export const createDeviceUnpair = createAsyncThunk(
  "Device/createDeviceUnpair",
  async (formData, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.post(
        `${BaseUrl}/api/device/unpair`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to update a Device Update Firmware
export const updateDeviceFirmware = createAsyncThunk(
  "Device/updateDeviceFirmware",
  async (formData, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.put(`${BaseUrl}/api/device`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to create a  Device Capture screen img
export const createDeviceCaptureScreenImg = createAsyncThunk(
  "Device/createDeviceCaptureScreenImg",
  async (formData, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.post(
        `${BaseUrl}/api/device/capture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to create a Device query capture img result
export const createDeviceQueryCaptureImgResult = createAsyncThunk(
  "Device/createDeviceQueryCaptureImgResult",
  async (formData, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.post(
        `${BaseUrl}/api/device/query_capture_result`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to create a Device Reboot
export const createDeviceReboot = createAsyncThunk(
  "Device/createDeviceReboot",
  async (formData, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.post(
        `${BaseUrl}/api/device/reboot`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to create a Device Reset
export const createDeviceReset = createAsyncThunk(
  "Device/createDeviceReset",
  async (formData, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.post(
        `${BaseUrl}/api/device/reset`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const DeviceSlice = createSlice({
  name: "Device",
  initialState: {
    deviceList: [],
    unhealth:[],
    StatData:[],
    statDataloading:true,
    unhealthloading:true,
    status: "idle",
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeviceList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDeviceList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deviceList = action.payload;
      })
      .addCase(fetchDeviceList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      //unhealth Api
      .addCase(fetchDeviceUnhealthy.pending, (state) => {
        state.unhealthloading = true;
      })
      .addCase(fetchDeviceUnhealthy.fulfilled, (state, action) => {
        state.unhealthloading = false;
        state.unhealth = action.payload;
      })
      .addCase(fetchDeviceUnhealthy.rejected, (state, action) => {
        state.unhealthloading = false;
        state.error = action.error.message;
      })
      //device stat Api
      .addCase(fetchDeviceStatistics.pending, (state) => {
        state.statDataloading = true;
        state.error = null;
      })
      .addCase(fetchDeviceStatistics.fulfilled, (state, action) => {
        state.statDataloading = false;
        state.StatData = action.payload;
      })
      .addCase(fetchDeviceStatistics.rejected, (state, action) => {
        state.statDataloading = false;
        state.error = action.payload;
      })

      .addCase(fetchDeviceViewById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDeviceViewById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deviceList = action.payload;
      })
      .addCase(fetchDeviceViewById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add more case handlers as needed
      .addCase(updateDeviceFirmware.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDeviceFirmware.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deviceList = action.payload;
      })
      .addCase(updateDeviceFirmware.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createDevicePlayVideo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDevicePlayVideo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deviceList.push(action.payload);
      })
      .addCase(createDevicePlayVideo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createDevicePair.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDevicePair.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deviceList.push(action.payload);
      })
      .addCase(createDevicePair.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createDeviceUnpair.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDeviceUnpair.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deviceList.push(action.payload);
      })
      .addCase(createDeviceUnpair.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createDeviceCaptureScreenImg.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDeviceCaptureScreenImg.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deviceList.push(action.payload);
      })
      .addCase(createDeviceCaptureScreenImg.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createDeviceQueryCaptureImgResult.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDeviceQueryCaptureImgResult.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deviceList.push(action.payload);
      })
      .addCase(createDeviceQueryCaptureImgResult.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createDeviceReboot.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDeviceReboot.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deviceList.push(action.payload);
      })
      .addCase(createDeviceReboot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createDeviceReset.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDeviceReset.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deviceList.push(action.payload);
      })
      .addCase(createDeviceReset.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default DeviceSlice.reducer;