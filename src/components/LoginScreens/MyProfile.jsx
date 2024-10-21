import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../Navbar';
import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';
import CustomTextField from '../customStyles/CustomTextField';
import CustomButton from '../customStyles/CustomButton';
import { fetchUserById, fetchUserList, updateUserById } from '../../redux/apiResponse/userSlice';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectLoginApiResponse } from "../../redux/apiResponse/loginApiSlice";
import { toast } from 'react-toastify';
import HeaderLayout from '../customStyles/HeaderLayout';

const PublicUrl = process.env.PUBLIC_URL

const commonStyles = {
  fontFamily: "montserrat-regular"
};

const MyProfile = () => {

  const dispatch = useDispatch();
  const UserList = useSelector((state) => state.User.userdata);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const user = useSelector(selectLoginApiResponse)
  const id = user?.user?.id
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    office_phone: '',
    mobile_phone: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  useEffect(() => {
  }, [formData])
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setIsDataChanged(true);
  };
  

  useEffect(() => {

    dispatch(fetchUserById(id));
  }, [dispatch, id]);


  useEffect(() => {
    setFormData({
      ...formData,
      first_name: UserList.first_name || '',
      last_name: UserList.last_name || '',
      office_phone: UserList.office_phone || '',
      mobile_phone: UserList.mobile_phone || '',
      email: UserList.email || '',
      newPassword: '',
      confirmPassword: '',
    });
  }, [UserList]);

  // const handleUpdate = async () => {
  //   try {
  //     const response = await dispatch(updateUserById({ id: id, formData: formData }));
  //     const { data } = response.payload;
  //     toast.success("Profile Updated Sucessfully")
  //     if (response.payload.code === 200) {
  //       navigate("/map")
  //     }
  //     setIsEditMode(false); 
  //   } catch (error) {
  //     console.error('Error updating user data:', error);
  //   }
  // };

  const handleUpdate = async () => {
    try {
      const isDataChanged = Object.keys(formData).some(key => formData[key] !== UserList[key]);
  
      if (isDataChanged) {
        const response = await dispatch(updateUserById({ id: id, formData: formData }));
        const { data } = response.payload;
        toast.success("Profile Updated Successfully");
        if (response.payload.code === 200) {
          navigate("/map");
        } else {
          toast.error("Failed to update profile");
        }
      } else {
        // Removed toast.info("No changes made") here
      }
  
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error("Failed to update profile");
    }
  };
  

  const handleCancel = () => {
    setIsEditMode(false); 
    navigate(-1)
  }

  return (
    <>
      <Box>

      </Box>
      <Container maxWidth="xxl">
      <HeaderLayout >
       
          <Box padding="15px" >
            <Box display="flex" gap={1}>
              <Typography variant="h5" sx={{ fontWeight: "bold", ...commonStyles }}>My Profile</Typography>
             <Box onClick={() => setIsEditMode(true)} display="flex" alignItems="center">
             <img
      src={PublicUrl + "/assets/icons/update.svg"}
      alt=""
      
      style={{ cursor: 'pointer' }}
    />
             </Box>
             
            </Box>
            <Typography variant="body2" sx={commonStyles}>Update your Account</Typography>
          </Box>
          <Box width="50%" height="50vh" padding="15px" sx={{ flexGrow: 1 }}>
            <Typography variant='h6' sx={{ fontWeight: "bold", paddingBottom: "15px", ...commonStyles }}>Personal Information</Typography>
            <form>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomTextField label="First Name" value={formData?.first_name} name={"first_name"} onChange={handleInputChange} readOnly={!isEditMode} />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField label="Last Name" value={formData?.last_name} name={"last_name"} onChange={handleInputChange} readOnly={!isEditMode} />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField label="Office Phone" value={formData?.office_phone} name={"office_phone"} onChange={handleInputChange} readOnly={!isEditMode} />
            </Grid>
            <Grid item xs={6}>

              <CustomTextField label="Mobile Number" value={formData?.mobile_phone} name={"mobile_phone"} onChange={handleInputChange} readOnly={!isEditMode} />
            </Grid>
            <Grid item xs={12}>

              <CustomTextField label="Email" value={formData?.email} name={"email"} onChange={handleInputChange} readOnly={!isEditMode} />
            </Grid>
            {/* <Grid item xs={6}>
            
            <CustomTextField label="New Password" value={formData.newPassword} name={"newPassword"} onChange={handleInputChange}/>
            </Grid>
            <Grid item xs={6}>
            <CustomTextField label="Confirm Password" value={formData.confirmPassword} name={"confirmPassword"} onChange={handleInputChange}/>
            </Grid> */}

          </Grid>
        </form>
          </Box>
          <Grid item xs={12} gap={3} display="flex" justifyContent="center" marginTop="auto">
            <CustomButton onClick={handleCancel}> Cancel</CustomButton>
            <CustomButton onClick={handleUpdate} disabled={!isDataChanged}> Save</CustomButton> {/* Disable save button if data hasn't changed */}
          </Grid>
       
        </HeaderLayout>
      </Container>
    </>
  );
};

export default MyProfile;
