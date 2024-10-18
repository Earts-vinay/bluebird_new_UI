import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid } from '@mui/material';
import CustomTextField from '../customStyles/CustomTextField';
import CustomButton from '../customStyles/CustomButton';
import { updateUserById } from '../../redux/apiResponse/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectLoginApiResponse } from '../../redux/apiResponse/loginApiSlice';

const PublicUrl = process.env.PUBLIC_URL;

const commonStyles = {
  fontFamily: 'montserrat-regular'
};

const Settings = () => {
  const dispatch = useDispatch();
  const UserList = useSelector((state) => state.User.userdata);
  const user = useSelector(selectLoginApiResponse);
  const id = user?.user?.id;
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const [isConfirmPasswordFilled, setIsConfirmPasswordFilled] = useState(false);

  const [formData, setFormData] = useState({
    new_password: '',
    confirm_new_password: ''
  });

  useEffect(() => {}, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
    setIsDataChanged(true);
  };

  useEffect(() => {
    setIsPasswordFilled(!!formData.new_password);
  }, [formData.new_password]);

  useEffect(() => {
    setIsConfirmPasswordFilled(!!formData.confirm_new_password);
  }, [formData.confirm_new_password]);

  const handleUpdate = async () => {
    try {
      const isDataChanged = Object.keys(formData).some(
        (key) => formData[key] !== UserList[key]
      );

      if (!isPasswordFilled || !isConfirmPasswordFilled) {
        toast.error('Please fill in both password fields');
        return;
      }

      if (formData.new_password !== formData.confirm_new_password) {
        toast.error('Passwords do not match');
        return;
      }

      if (isDataChanged) {
        const response = await dispatch(updateUserById({ id: id, formData: formData }));
        const { data } = response.payload;
        toast.success('Password Updated Successfully');
        if (response.payload.code === 200) {
          navigate('/map');
        } else {
          toast.error('Failed to update profile');
        }
      } else {
        toast.info('No changes made');
      }

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    navigate(-1);
    setIsEditMode(false);
  };

  return (
    <>
      <Box></Box>
      <Container maxWidth="xxl">
        <Box
          sx={{
            backgroundColor:
              'linear-gradient(119deg, #ebeffa 2%, #e8ebfd 30%, #f0ecf9 51%, #efeefb 70%, #eef7ff 100%)',
            minHeight: '75vh',
            padding: '20px',
            mt: 1,
            borderRadius: '10px',
            backdropFilter: 'blur(15px)',
            boxShadow: ' 0 0 5px 0 rgb(0 58 111 / 49%)'
          }}
        >
          <Box padding="15px">
            <Box display="flex" gap={1}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', ...commonStyles }}>
                Account
              </Typography>
              <Box onClick={() => setIsEditMode(true)} display="flex" alignItems="center">
                <img
                  src={PublicUrl + '/assets/icons/update.svg'}
                  alt=""
                  style={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>
            <Typography variant="body2" sx={commonStyles}>
              Update your account{' '}
            </Typography>
          </Box>
          <Box width="50%" height="50vh" padding="15px" sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '15px', ...commonStyles }}>
              Change Password
            </Typography>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <CustomTextField
                    label="New Password"
                    value={formData.new_password}
                    name={'new_password'}
                    onChange={handleInputChange}
                    required
                    readOnly={!isEditMode}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomTextField
                    label="Confirm   Password"
                    value={formData.confirm_new_password}
                    name={'confirm_new_password'}
                    onChange={handleInputChange}
                    required
                    readOnly={!isEditMode}
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
          <Grid item xs={12} gap={3} display="flex" justifyContent="center" marginTop="auto">
            <CustomButton onClick={handleCancel}>Cancel</CustomButton>
            <CustomButton onClick={handleUpdate} disabled={!isDataChanged}>
              Save
            </CustomButton>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Settings;
