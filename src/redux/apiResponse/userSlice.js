import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { selectToken } from "./loginApiSlice";
const BaseUrl = process.env.REACT_APP_API_URL;



// Thunk to update a User by ID
export const updateUserById = createAsyncThunk(
  "User/updateUserById",
  async ({ id, formData }, { getState, dispatch }) => {
    try {
      const token = selectToken(getState());
      const formDataParams = new URLSearchParams(formData);
      const response = await axios.put(
        `${BaseUrl}/api/user/${id}`,
        formDataParams,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      dispatch(fetchUserById(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);



// Thunk to get the list of User
export const fetchUserList = createAsyncThunk(
  "User/fetchUserList",
  async (_, { getState }) => {
    try {
      const token = selectToken(getState());

      const response = await axios.get(`${BaseUrl}/api/user/list`, {
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

// Thunk to get a User by ID
export const fetchUserById = createAsyncThunk(
  "User/fetchUserById",
  async (id, { getState }) => {
    try {
      const token = selectToken(getState());
    

      const response = await axios.get(`${BaseUrl}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);



const UserSlice = createSlice({
  name: "User",
  initialState: {
    userdata: [],
    status: "idle",
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userdata = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userdata = action.payload;
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userdata = action.payload.data;
      })
  },
});

export default UserSlice.reducer;