import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { selectToken } from "./loginApiSlice";
const BaseUrl = process.env.REACT_APP_API_URL;

// Thunk to create a control center
export const createControlCenter = createAsyncThunk(
  "ControlCenter/createControlCenter",
  async (formData, { getState, dispatch }) => {
    try {
      const token = selectToken(getState());
      const response = await axios.post(`${BaseUrl}/api/user_view`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      // Fetch the control center list using property_id from formData
      if (formData.property_id) {
        dispatch(fetchControlCenterList(formData.property_id));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);


// Thunk to update a control center by ID
export const updateControlCenterById = createAsyncThunk(
  "ControlCenter/updateControlCenterById",
  async ({ id, formData }, { getState, dispatch }) => {
    try {
      const token = selectToken(getState());
      const formDataParams = new URLSearchParams(formData);
      const response = await axios.put(
        `${BaseUrl}/api/user_view/${id}`,
        formDataParams,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      dispatch(fetchControlCenterList());
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to delete a control center by ID
export const deleteControlCenterById = createAsyncThunk(
  "ControlCenter/deleteControlCenterById",
  async (id, { getState, dispatch }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.delete(`${BaseUrl}/api/user_view`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: { id: id },
      });
      dispatch(fetchControlCenterList());

      return response.data; // Return the deleted ID
    } catch (error) {
      throw error;
    }
  }
);

// Thunk to get the list of control centers
export const fetchControlCenterList = createAsyncThunk(
  "ControlCenter/fetchControlCenterList",
  async (id, { getState }) => {
    try {
      const token = selectToken(getState());
console.log("token",token);
      const response = await axios.get(`${BaseUrl}/api/user_view?property_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("response view",response.data);
      return response.data;

    } catch (error) {
      throw error;
    }
  }
);

// Thunk to get a control center by ID
export const fetchControlCenterById = createAsyncThunk(
  "ControlCenter/fetchControlCenterById",
  async (id, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.get(`${BaseUrl}/api/user_view/${id}`, {
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

export const deleteControlCenterByIdAndCamera = createAsyncThunk(
  "ControlCenter/deleteControlCenterByIdAndCamera",
  async ({ formData }, { getState, dispatch }) => {
    try {
      const token = selectToken(getState());
      const data = new URLSearchParams(formData);
      const response = await axios.post(
        `${BaseUrl}/api/user_view/del_camera`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      dispatch(fetchControlCenterList());

      return response.data; // Return the deleted ID
    } catch (error) {
      throw error;
    }
  }
);

const ControlCenterSlice = createSlice({
  name: "ControlCenter",
  initialState: {
    ControlCenter: [],
    status: "idle",
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchControlCenterList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchControlCenterList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ControlCenter = action.payload;
      })
      .addCase(fetchControlCenterList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchControlCenterById.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(createControlCenter.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(updateControlCenterById.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteControlCenterById.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteControlCenterByIdAndCamera.fulfilled, (state, action) => {
        state.status = "succeeded";
      });
  },
});

export default ControlCenterSlice.reducer;