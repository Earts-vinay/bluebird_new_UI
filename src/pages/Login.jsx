import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { selectToken, setLoginApiResponse } from "../redux/apiResponse/loginApiSlice";
import { setShowNavbar } from "../redux/apiResponse/navBarSlice";
import { useDispatch } from "react-redux";
import { fetchPropertyDataStart, fetchpropertyDataSuccess, fetchpropertyDataFailure, selectPropertyResponseData, selectPropertyByUser } from "../redux/apiResponse/propertySlice";
import {
  setAuthentication,
  setAuthenticationError,
  setAvatarUrl,
} from "../redux/apiResponse/authSlice";
import { useSelector } from "react-redux";
import md5 from 'md5';  

const PublicUrl = process.env.PUBLIC_URL;
const commonStyles = {
  fontFamily: "montserrat-regular",
};

const StyledContainer = styled(Container)({
  marginTop: (theme) => theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const StyledForm = styled("form")({
  width: "100%",
  marginTop: (theme) => theme.spacing(1),
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
  margin: (theme) => theme.spacing(1, 0),
  textDecoration: "underline",
  color: (theme) => theme.palette.text.secondary,
});

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = useSelector(selectToken);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const property = useSelector(selectPropertyResponseData);
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const dispatch = useDispatch();
  const BaseUrl = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsButtonDisabled(true);

    // Hashing the password using MD5
    const hashedPassword = md5(password); 

    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", hashedPassword);
    // formData.append('use_type', 'dashboard');

    try {
      const response = await fetch(`${BaseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();

      dispatch(setLoginApiResponse(data));

      const newToken = data?.data?.token;
      // localStorage.setItem('token', newToken);
      // setToken(newToken);

      if (data.code === 400) {
        toast.error(data.msg.charAt(0).toUpperCase() + data.msg.slice(1), { autoClose: 500 });
      }
      else if (data.code === 500) {
        toast.error('User does not have valid access level', { autoClose: 500 });
      }
      else if (data.code === 200) {
        callTokenAPI(newToken);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('An error occurred while logging in');
    } finally {
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    if (toastDisplayed) {
      const timeoutId = setTimeout(() => {
        setIsButtonDisabled(false);
        setToastDisplayed(false);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [toastDisplayed]);

  // const callTokenAPI = async (token) => {
  //   try {
  //     const response = await axios.request({
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       method: "POST",
  //       url: `${process.env.REACT_APP_API_URL}/api/auth`,
  //     });

  //     const { data } = response.data;

  //     if (data && data?.role && data?.role.name === "Company Viewer") {
  //       dispatch(setAuthentication(data));
  //       await fetchCompanyLogo(token);
  //       toast.success("Login successful");
  //       navigate("/map");
  //     } else if (data && data?.role && data?.role.name === "Property Viewer") {
  //       dispatch(setAuthentication(data));
  //       await fetchCompanyLogo(token);
  //       toast.success("Login successful");
  //       navigate("/map");
  //     } else {
  //       throw new Error("User does not have Valid Access");
  //     }
  //   } catch (error) {
  //     console.error("Error authenticating:", error);
  //     dispatch(setAuthenticationError("Failed to authenticate"));
  //     toast.error('User does not have valid access level', { autoClose: 500 });
  //     setIsLoading(false)
  //     setIsButtonDisabled(false)
  //   }
  //   finally {
  //     setIsLoading(false);
  //   }
  // };

  const callTokenAPI = async (token) => {
    try {
      const response = await axios.request({
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/api/auth`,
      });

      const { data } = response.data;

      if (data) {
        dispatch(setAuthentication(data));
        await fetchCompanyLogo(token);
        toast.success("Login successful");
        navigate("/map");
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      dispatch(setAuthenticationError("Failed to authenticate"));
      toast.error('User does not have valid access level', { autoClose: 500 });
      setIsLoading(false);
      setIsButtonDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyLogo = async (token) => {
    try {
      const response = await axios.get(`${BaseUrl}/api/company/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data.logo_url) {
        dispatch(setAvatarUrl(response.data.data.logo_url));
      } else {
        console.error("Failed to fetch company logo");
      }
    } catch (error) {
      console.error("Error fetching company logo:", error);
      toast.error("Failed to fetch company logo");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  useEffect(() => {
    dispatch(setShowNavbar(false));
    return () => {
      dispatch(setShowNavbar(true));
    }
  }, [])

  useEffect(() => {
    dispatch(fetchPropertyDataStart());
    try {
      axios.get(
        `${BaseUrl}/api/property`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
          }
        }
      ).then((res) => {
        const { data } = res.data;
        if (res.data.code === 200) {
          dispatch(fetchpropertyDataSuccess(data));
        }
        else {
          dispatch(fetchpropertyDataFailure(data.msg));
          toast.error(data.msg);
        }
      }).catch((err) => {
        dispatch(fetchpropertyDataFailure('Failed to fetch data'));
      });
    } catch (error) {
      dispatch(fetchpropertyDataFailure(error.message));
    }

  }, [dispatch, token]);

  useEffect(() => {
    if (property?.total > 0) {
      console.log(property, "prop");
      const defaultProperty = property?.list[0];
      console.log("defaultProperty", defaultProperty);
      dispatch(selectPropertyByUser(property?.list[0]));
    }
  }, [property])
  return (
    <Container maxWidth="xl">
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundImage: `url("/assets/icons/bgartwork.svg")`,
          backgroundSize: "contain",
          backgroundPosition: "right bottom", // or "100% 100%"
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box width="50%">
          <Box width="80%">
            <img
              src={process.env.PUBLIC_URL + "/assets/logos/bluebird_logo.svg"}
              alt="Logo"
              loading="lazy"
              style={{
                objectFit: "contain",
                maxWidth: "350px",
                maxHeight: "350px",
                width: "100%",
                height: "auto",
              }}
            />

            <Typography variant="h4" sx={{ ...commonStyles, fontWeight: "bold",marginTop:"10px" }}>Real-time AI Analytics  <br /> for the Physical World</Typography>
            <Typography mt={2} sx={{ ...commonStyles }}>
            We specialize in  AI-driven security camera services, designed to enhance safety through advanced surveillance technology. Our AI leverages artificial intelligence to analyze threats in real-time, ensuring a proactive approach to security management.
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundImage: '#ffffff',
            boxShadow: "0 0 15px 0 rgba(36, 101, 233, 0.3)",
            border: "solid 2px #fff",
            padding: "50px",
            borderRadius: "10px",
            marginX: "10px",
            width: "25%"
          }}
        >
          <Typography component="h1" variant="h5" sx={{ ...commonStyles, mb: "10px" }}>
            Login
          </Typography>
          <StyledForm onSubmit={handleLogin}>
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
                style: { fontFamily: 'montserrat-regular', fontSize: "15px" },
              }}
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Enter Password"
              type="password"
              id="password"
              InputLabelProps={{
                style: { fontFamily: 'montserrat-regular', fontSize: "15px" },
              }}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ForgotPasswordLink
              onClick={handleForgotPassword}
              sx={{ textTransform: "capitalize", paddingY: "10px" }}
            >
              Forgot Password?
            </ForgotPasswordLink>
            <Box mt={1}>
              <Button
                type="submit"
                fullWidth
                variant='contained'
                color='primary'
                sx={{ textTransform: "capitalize", paddingY: "10px", backgroundColor: "#1c3664",
                  "&:hover": {
                   backgroundColor: "#1c3664",
                  }, }}
                disabled={isButtonDisabled} // Disable button based on state
              >
                {
                  isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </Box>
          </StyledForm>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
