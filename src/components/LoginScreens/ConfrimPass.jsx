import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, styled } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import md5 from 'md5'; 

const StyledContainer = styled(Container)({
  marginTop: theme => theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const StyledForm = styled('form')({
  width: '100%',
  marginTop: theme => theme.spacing(1),
});

const StyledButton = styled(Button)({
  margin: theme => theme.spacing(3, 0, 2),
});

const ForgotPasswordLink = styled(Button)({
  margin: theme => theme.spacing(1, 0),
  textDecoration: 'underline',
  color: theme => theme.palette.text.secondary,
});

const BaseUrl = process.env.REACT_APP_API_URL;

const ConfirmPass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const ooBcode = queryParams.get('ooBcode');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    // Hashing the new password using md5
    const hashedPassword = md5(newPassword);

    const payload = new URLSearchParams({
      password: hashedPassword,
      confirm_password: hashedPassword,
      ooBcode: ooBcode,
    });

    try {
      const response = await fetch(`${BaseUrl}/api/resetpass/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
      });

      if (response.ok) {
        toast.success('Password has been reset successfully.');
        navigate('/');
      } else {
        toast.error('Failed to reset password.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while resetting the password.');
    }
  };

  const handleForgotPassword = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="xl">
      <ToastContainer />
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box width="50%">
          <Box width="80%">
            <img
              src={process.env.PUBLIC_URL + "/assets/logos/bluebird_logo.svg"}
              alt="Logo"
              style={{
                objectFit: "contain",
                maxWidth: "350px",
                maxHeight: "350px",
                width: "100%",
                height: "auto",
              }}
            />
            <Typography variant="h4">
              Welcome to <br /> The Circle of Security</Typography>
            <Typography mt={2}>
              Our Edge AI technology, with DIY capabilities go beyond
              traditional surveillance, offering not only real-time security
              alerts but also simultaneously providing actionable business
              intelligence.
            </Typography>
          </Box>
        </Box>
        <Box sx={{
          backgroundColor: "linear-gradient(119deg, #ebeffa 2%, #e8ebfd 30%, #f0ecf9 51%, #efeefb 70%, #eef7ff 100%)",
          boxShadow: "0 0 15px 0 rgba(36, 101, 233, 0.3)",
          border: "solid 2px #fff",
          padding: "50px",
          borderRadius: "10px",
          marginX: "10px",
          width: "30%"
        }}>
          <Typography component="h1" variant="h5">
            Confirm Password?
          </Typography>
          <Typography> Please Enter New Password</Typography>
          <StyledForm onSubmit={handleLogin}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="newPassword"
              label="New Password"
              type="password"
              autoComplete="new-password"
              autoFocus
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ textTransform: "capitalize", paddingY: "10px", marginY: "10px" }}
            >
              Save
            </StyledButton>
          </StyledForm>
        </Box>
      </Box>
    </Container>
  );
}

export default ConfirmPass;
