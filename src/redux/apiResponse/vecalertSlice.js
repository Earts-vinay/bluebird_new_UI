import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";
import {selectToken} from './loginApiSlice';
import Cookies from "js-cookie";


const BaseUrl = process.env.REACT_APP_API_URL;
const selectedPropertyId = sessionStorage.getItem('selectedPropertyId');

// Thunk to create a fetch Alert List
export const fetchVecAlertList = createAsyncThunk(`/api/vec_alert/pole?property_id=2`,
 async (requestData, { getState }) => {
    try {
      const token = getState().auth.token || Cookies.get('token');
  
      const response = await axios.get(BaseUrl, {
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

  // export const  geteventtypelist = createAsyncThunk("VecAlertSlice/geteventtypelist" ,
  //  async (requesteventtypeData, { getState }) => {
  //   try {
  //       const token = selectToken(getState());
  //       const selectedPropertyId = sessionStorage.getItem('selectedPropertyId');
  //       const response = await axios.get(`${BaseUrl}/api/vec_alert/2`, {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //         },
  //         data: requesteventtypeData, 
  //       });
  //       return response.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   });
  
    export const  getVectracelist = createAsyncThunk("VecAlertSlice/getvec_alert_list" ,
    async (requestvec_Data, { getState }) => {
     try {
         const token = selectToken(getState());
         const selectedPropertyId = sessionStorage.getItem('selectedPropertyId');
         const response = await axios.get(`${BaseUrl}/api/vec_alert/2`, {
           headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/x-www-form-urlencoded',
           },
           data: requestvec_Data, 
         });
        
         return response.data;
       } catch (error) {
         throw error;
       }
     });


     export const getdeviceplay = createAsyncThunk(
      "VecAlertSlice/getvec_device_play",
      async ({ camera_id }, { getState }) => {
        try {
          const token = selectToken(getState());
    
          // Create FormData object
          const formData = new FormData();
          formData.append('camera_id', camera_id);
          // You can append more parameters if needed
    
          const response = await axios.post(
            `${BaseUrl}/api/device/play`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded", // Set content type to form data
              },
            }
          );
          return response.data;
          
        } catch (error) {
          throw error;
        }
      }
    );

    
const VecAlertSlice = createSlice({
    name: 'VecAlert',
    initialState:{
      alertList: [],
      deviceplaylivestramList:[],
      status: 'idle',
      error: null,
    },
      
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchVecAlertList.pending, (state) => {
          state.status = 'loading';
        })
        // .addCase(geteventtypelist.pending, (state) => {
        //     state.status = "loading";
        //   })
        //   .addCase(geteventtypelist.fulfilled, (state, action) => {
        //     state.status = "succeeded";
        //     state.eventTypes = action.payload.data; // Assuming 'list' contains the event types data
        //   })
        //   .addCase(geteventtypelist.rejected, (state, action) => {
        //     state.status = "failed";
        //     state.error = action.error.message;
        //   })
          .addCase(getVectracelist.pending, (state) => {
            state.status = "loading";
          })
          .addCase(getVectracelist.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.vecAlertTrace = action.payload.data; // Assuming 'list' contains the event types data
          })
          .addCase(getVectracelist.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
          })
          .addCase(getdeviceplay.pending, (state) => {
            state.status = "loading";
          })
          .addCase(getdeviceplay.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.deviceplaylivestramList = [...state.deviceplaylivestramList, action.payload.data.flvUrl];
          })
          
          .addCase(getdeviceplay.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
          })
      
    }
  });
  
  export default VecAlertSlice.reducer;
  
  
 
  