
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { ArrowDropDown } from "@mui/icons-material";
import { FormControl, Select, TextField } from "@mui/material";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { clearTokenAndUser, selectToken } from "../redux/apiResponse/loginApiSlice";
import { useDispatch } from 'react-redux';
import { clearAuthentication, selectAvatarUrl } from "../redux/apiResponse/authSlice";
import { toast } from "react-toastify";
import { selectPropertyResponseData, selectPropertyByUser, selectedPropertyByUser } from '../redux/apiResponse/propertySlice';
import { fetchDataStart, fetchDataSuccess, fetchDataFailure } from "../redux/apiResponse/poleSlice";
import { selectUser } from "../redux/apiResponse/authSlice";
import { selectLoginApiResponse } from "../redux/apiResponse/loginApiSlice";
import { setShowNavbar } from "../redux/apiResponse/navBarSlice";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fetchUserById, fetchUserList, updateUserById } from '../redux/apiResponse/userSlice';
import { setSelectedDateSlice, setSelectedMapListDateSlice, getIsAlertInfo, setIsAlertInfo } from "../redux/apiResponse/alertInsideSlice";

const PublicUrl = process.env.PUBLIC_URL
const commonStyles = { fontFamily: "montserrat-regular" };

const Hello = (props) => (
  <Box
    {...props}
    sx={{
      backgroundImage: `url(${PublicUrl}/assets/images/navbar777.png)`,
      backgroundSize: 'cover', // Adjusted for responsiveness
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: {xl:"82%", lg: '82%', md: '100%', sm: '100%', xs: "100%" },
      margin: 'auto',
      height: { lg: '50px', md: '46px', sm: '44px' },
      display: 'flex',
      paddingY: { lg: '20px', md: '20px', sm: '13px', xs: '10px' },
      justifyContent: 'center',
      alignItems: 'center',
      filter: 'drop-shadow(0 0 10px #b1b1b1d4)', // Corrected drop-shadow syntax
    }}
  />
);

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const linkStyles = {
    color: isActive ? '#2465e9' : '#001426',
    textDecoration: 'none',
    fontFamily: 'montserrat-regular',
    fontWeight: "bold",
    margin: '0 10px',
    transition: 'border-color 0.3s ease-in-out',
    ...(isActive && {
      borderColor: 'red',
      marginBottom: '5px',
    }),
  };


  return (
    <RouterLink to={to} component={Typography} variant="h6" style={linkStyles}>
      {label}
    </RouterLink>
  );
};
const CustomLabel = () => {
  const isAlert = useSelector(getIsAlertInfo);
  return <>
    Alerts
    {isAlert ? <span
      className="alert-notification"
      style={{
        backgroundColor: 'red',
        width: 8,
        height: 8,
        borderRadius: '50%',
        display: 'inline-block',
        position: "relative",
        top: -8,
        // Adjust spacing between text and badge
      }}
    ></span> : null}
  </>
};

const BaseUrl = process.env.REACT_APP_API_URL;

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const property = useSelector(selectPropertyResponseData);
  const seleProp = useSelector(selectedPropertyByUser);
  const [selectedValue, setSelectedValue] = useState();
  const [selectedProperty, setSelectedProperty] = useState(seleProp?.id?.toString());
  const [firstName, setFirstName] = useState(null)
  const [secondName, setSecondName] = useState(null)
  const token = useSelector(selectToken);
  const companyView = useSelector(selectUser);
  const user = useSelector(selectLoginApiResponse);
  const UserList = useSelector((state) => state.User.userdata);

  const today = moment().format('YYYY-MM-DD');
  const storedToken = localStorage.getItem('token');
  const Authorization = `Bearer ${storedToken}`

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  console.log("property", property, seleProp, selectedProperty);

  // useEffect(() => {
  //   if (property?.total) {
  //     dispatch(fetchDataStart(property?.list[0]));
  //   }
  // }, [ dispatch]);
  useEffect(() => {
    setSelectedProperty(seleProp?.id)
  }, [seleProp])

  const handleSelectChange = (event) => {
    const propertyId = event.target.value;
    const selectedPropertyObj = property?.list?.find(obj => obj?.id === propertyId);
    setSelectedProperty(selectedPropertyObj?.id || '');
    dispatch(selectPropertyByUser(selectedPropertyObj));
    dispatch(fetchDataStart(selectedPropertyObj));
  };

  useEffect(() => {
    const fum = async () => {
      const response = await dispatch(fetchUserById(user?.user?.id))
    }
    fum()
  }, [dispatch]);
  useEffect(() => {
    setFirstName(UserList?.first_name)
    setSecondName(UserList?.last_name)

  }, [UserList])

  useEffect(() => {
    if (property?.list?.length > 0) {
      setSelectedValue(property?.list[0].name);
    }
  }, [property]);

  const [isLoggedOut, setIsLoggedOut] = useState(false);
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'logoutEvent') {
        setIsLoggedOut(true);
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const handleLogOutUser = async () => {
    try {
      const response = await axios.post(`${BaseUrl}/api/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response?.data?.code === 200) {
        dispatch(clearTokenAndUser());
        dispatch(clearAuthentication());
        dispatch(setSelectedDateSlice(today))
        dispatch(setSelectedMapListDateSlice(today))
        dispatch(selectPropertyByUser(null))
        dispatch(setShowNavbar(false));
        localStorage.setItem('logoutEvent', Date.now());
        setAnchorElUser(null);
        toast.success('Logout successful');
        navigate("/");
      } else {
        console.error('Logout failed:', response?.data?.msg);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  // Company Loge here
  const urlsr = useSelector(selectAvatarUrl);
  const [logoImage, setLogoImage] = useState(urlsr);

  return (
    <>
      <Container maxWidth="xl">
        <Hello>
          <Box display="flex" gap={{ lg: "17rem", xs: '5rem', md: '7rem', sm: "7rem" }} justifyContent="center" alignItems="center">
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {logoImage ? (
                <Box
                  component="img"
                  src={logoImage}
                  alt="Logo"
                  sx={{
                    width: '100%',
                    minWidth: '100px',
                    maxWidth: '170px',
                    height: { lg: "40px", md: "36px", sm: "24px" },
                    objectFit: 'contain',
                    paddingLeft: { lg: "20px", md: "20px", sm: "15px" },

                  }}
                  onLoad={() => { }}
                  onError={(e) => {
                    e.target.src = `${PublicUrl}/assets/images/logosap.svg`;
                    e.target.alt = 'No Image';
                  }}
                />
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Box
                    component="img"
                    src={`${PublicUrl}/assets/images/logosap.svg`}
                    alt="Logo"
                    sx={{
                      width: '100%',
                      minWidth: '100px',
                      maxWidth: '170px',
                      height: { lg: "40px", md: "36px", sm: "24px" },
                      objectFit: 'contain',
                      paddingLeft: { lg: "20px", md: "20px", sm: "15px" },

                    }}
                  />
                </div>
              )}
              <Box display="flex" justifyContent="end" pb={0.6}>
                <FormControl variant="standard" sx={{ width: { md: "120px", sm: "100px" }, paddingLeft: "25px", paddingTop: "0px", display: "flex", justifyContent: "end" }} size="small" >
                  <TextField
                    select
                    variant="standard"
                    sx={{
                      width: { md: "120px", sm: "100px" },
                      paddingLeft: "2px",
                      paddingTop: "0px",
                      display: "flex",
                      justifyContent: "end",

                    }}
                    size="small"
                    value={selectedProperty}
                    onChange={handleSelectChange}
                    SelectProps={{
                      IconComponent: KeyboardArrowDownIcon,
                    }}
                  >
                    {property?.list?.map((prop) => (
                      <MenuItem key={prop.id} value={prop.id} sx={{ size: "xsmall" }}>
                        <Typography component="span" sx={{ fontSize: { lg: "13px", md: "13px", sm: "12px", xs: "12px" } }}>
                          {prop.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Box>
            </Box>
            <Box>
            
                <>
                  <NavLink to="/map" label="Map" sx={{ position: 'relative' }} />
                  <NavLink to="/controlcenter" label="Control Center" sx={{ position: 'relative' }} />
                  <NavLink to="/alerts" label={<CustomLabel />} />
                  <NavLink to="/devices" label="Devices" sx={{ position: 'relative' }} />
                  <NavLink to="/insights" label="Insights" sx={{ position: 'relative' }} />
                </>
              {/* {['Company Viewer'].includes(companyView?.role.name) && (
                <>
                  <NavLink to="/map" label="Map" sx={{ position: 'relative' }} />
                  <NavLink to="/insights" label="Insights" sx={{ position: 'relative' }} />
                </>
              )} */}
            </Box>

          </Box>
        </Hello>
      </Container>

      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <Box>
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} py="4px" >
              <Typography variant="body-2" fontSize="16px" color="#2465e9" textAlign="center" fontFamily="montserrat-regular">{" "}
                <Box display="flex" alignItems="center" onClick={(e) => setAnchorElUser(e.currentTarget)} cursor="pointer"> Welcome, {firstName}{" "}{secondName} <KeyboardArrowDownIcon cursor="pointer" /></Box>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {moment().format("DD-MM-YY | HH:mm")}
              </Typography>
            </Box>
          </Box>
        </Tooltip>
        <Menu
          sx={{
            mt: '35px',
            '& .MuiPaper-root.MuiPopover-paper.MuiMenu-paper': {
              background: 'rgba(255, 255, 255, 0.1)',
              WebkitBackdropFilter: "blur(30px)",
              backdropFilter: "blur(50px)",
              border: "solid 2px #fff",
            }
          }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'center', }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          cursor="pointer"
        >
          <MenuItem onClick={handleCloseUserMenu} style={{ color: '#2465e9', fontFamily: "montserrat-regular" }}>
            <Link to="/myprofile" style={{ textDecoration: 'none', color: 'inherit', gap: "10px", display: "flex", alignItems: "center" }}>
              <img src={PublicUrl + "/assets/icons/Profile.svg"} alt="" />
              My Profile
            </Link>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu} style={{ color: '#2465e9', fontFamily: "montserrat-regular" }}>
            <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit', gap: "10px", display: "flex", alignItems: "center" }}>
              <img src={PublicUrl + "/assets/icons/Settings.svg"} alt="" />
              Settings
            </Link>
          </MenuItem>
          <MenuItem onClick={handleLogOutUser} style={{ color: '#2465e9', fontFamily: "montserrat-regular" }}>
            <Link style={{ textDecoration: 'none', color: 'inherit', gap: "10px", display: "flex", alignItems: "center" }}>
              <img src={PublicUrl + "/assets/icons/logout.svg"} alt="" />
              Logout
            </Link>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}
export default Navbar;
