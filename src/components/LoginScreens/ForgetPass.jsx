import React, { useEffect, useState } from 'react';
import { Box, Button, Container, CssBaseline, TextField, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPasswordResetApiResponse } from '../../redux/apiResponse/passwordResetApiSlice';
import { setShowNavbar } from '../../redux/apiResponse/navBarSlice';

const PublicUrl = process.env.PUBLIC_URL
const commonStyles = {
    fontFamily: "montserrat-regular",
  };

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

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
    color: "white",
    backgroundColor: "#2465e9",
    textTransform: "capitalize",
    paddingY: "10px",
    ...commonStyles,
    "&:hover": {
      backgroundColor: "#2465e9", // Set hover color to #2465e9
    },
  }));

const ForgotPasswordLink = styled(Button)({
    margin: theme => theme.spacing(1, 0),
    textDecoration: 'underline',
    color: theme => theme.palette.text.secondary,
});

const ForgetPass = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [showRecoveryresetpassword, setShowRecoveryresetpassword] = useState(true);
    const dispatch = useDispatch();
    const [timer, setTimer] = useState(20);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    useEffect(() => {
        let countdown;
        if (isResendDisabled) {
          countdown = setInterval(() => {
            setTimer((prev) => {
              if (prev <= 1) {
                clearInterval(countdown);
                setIsResendDisabled(false);
                return 20; // Reset timer for next use
              }
              return prev - 1;
            });
          }, 1000);
        }
        return () => clearInterval(countdown);
      }, [isResendDisabled]);
    
      const handleForgotPassword1 = () => {
        if (!isResendDisabled) {
          // Your resend logic here
          setIsResendDisabled(true);
          setTimer(20);
        }
      };
    

    const handleForgotPassword = () => {
        navigate('/login');
    };
    const openRecoverypasswordscreen = () => {
        setShowRecoveryresetpassword(false);
    }
    const handlereconverypasswordAPICall = async () => {

        const formData = new URLSearchParams();
        formData.append('email', email);

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/resetpass/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });
            const data = await response.json();
            dispatch(setPasswordResetApiResponse(data));
          
            setIsResendDisabled(true);
            setTimer(20);
        } catch (error) {
            console.error('Error logging in:', error);
            // toast.error('An error occurred while logging in');
        }

    }
    useEffect(() => {
        dispatch(setShowNavbar(false));
        return () => {
            dispatch(setShowNavbar(true));
        }
    }, [])


    return (
        <Container maxWidth="xl">
            <Box height="100vh"
            width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                marginLeft="20px"
                sx={{
                    backgroundImage: `url("/assets/icons/bgartwork.svg")`,
                    backgroundSize: "contain",
                    backgroundPosition: "right bottom", // or "100% 100%"
                    backgroundRepeat: "no-repeat",
                }}>
                <Box width="50%" sx={{display:"flex", justifyContent:"center",alignItems:"center"}}>
                    <Box width="80%" >
                        <img
                            src={PublicUrl + "/assets/logos/bluebird_logo.svg"}
                            alt="Logo"
                            loading="lazy"
                            style={{ objectFit: "contain" }}
                        />
                        <Typography variant="h4" sx={{ ...commonStyles, fontWeight: "bold",marginTop:"10px" }}>Real-time AI Analytics  <br /> for the Physical World</Typography>
                        <Typography mt={2} sx={{ ...commonStyles }}>
                           We specialize in  AI-driven security camera services, designed to enhance safety through advanced surveillance technology. Our AI leverages artificial intelligence to analyze threats in real-time, ensuring a proactive approach to security management.
                         </Typography>
                    </Box>
                </Box>
                <Box width="50%" sx={{display:"flex",justifyContent:"center"}}>
                    {showRecoveryresetpassword ? (
                        <Box   sx={{
                            backgroundImage: '#fff',
                            boxShadow: "0 0 15px 0 rgba(36, 101, 233, 0.3)",
                            border: "solid 2px #fff",
                            padding: "50px",
                            borderRadius: "10px",
                            marginX: "10px",
                            width: "50%",
                          }}>
                            <Typography component="h1" variant="h5" sx={{...commonStyles,pb:"5px"}}>
                                Forgot Password?
                            </Typography>
                            <Typography sx={{...commonStyles,fontSize:"12px",pb:"10px"}}> No worries! Just enter your email and we’ll send you a reset password link.</Typography>
                            <StyledForm onSubmit={openRecoverypasswordscreen}  >
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Enter Email"
                                    name="email"
                                    autoComplete="email"
                                    InputLabelProps={{
                                        style: { fontFamily: 'montserrat-regular',fontSize:"15px" },
                                      }}
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Box display="flex" alignItems="center">


                                    <Typography>  Just remember? </Typography>
                                    <ForgotPasswordLink onClick={handleForgotPassword} sx={{ textTransform: "capitalize", }}>
                                        Login
                                    </ForgotPasswordLink>
                                </Box>
                                <StyledButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: "capitalize", paddingY: "10px",backgroundColor: "#1c3664",
                                      "&:hover": {
                                        backgroundColor: "#1c3664",
                                       },
                                     }}
                                    onClick={handlereconverypasswordAPICall}
                                >
                                    Send Recovery Email
                                </StyledButton>

                            </StyledForm>
                        </Box>
                    ) : (
                        <Box
                        sx={{
                          backgroundImage: '#fff',
                          boxShadow: '0 0 15px 0 rgba(36, 101, 233, 0.3)',
                          border: 'solid 2px #fff',
                          padding: '50px',
                          borderRadius: '10px',
                          marginX: '10px',
                          width: '50%',
                        }}
                      >
                        <Typography style={{ width: '80%', display: 'flex', justifyContent: 'center' }}>
                          Check your email. We've sent you a reset password link.
                        </Typography>
                        <StyledForm>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <Box display="flex" alignItems="center" py={1}>
                            <Typography>Resend in {timer} sec</Typography>
                            <ForgotPasswordLink  onClick={handlereconverypasswordAPICall} sx={{ textTransform: 'capitalize' }}>
                              {isResendDisabled ? '' : 'Resend now'}
                            </ForgotPasswordLink>
                          </Box>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ textTransform: 'capitalize', paddingY: '10px',backgroundColor: "#1c3664",
                              "&:hover": {
                                backgroundColor: "#1c3664",
                               },
                            }}
                            onClick={handleForgotPassword}
                          >
                           Login
                          </Button>
                        </StyledForm>
                      </Box>
                    )} 
                     </Box>
            </Box>
        </Container>
    );
}

export default ForgetPass;
