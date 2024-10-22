
import React, { useState, useEffect } from "react";
import { Link, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Box, Drawer, IconButton, Typography, MenuItem, Menu, Tooltip, TextField, useMediaQuery,FormControl } from '@mui/material';
import moment from "moment";
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger menu icon
import CloseIcon from '@mui/icons-material/Close'; // For closing the menu
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
const BaseUrl = process.env.REACT_APP_API_URL;
const commonStyles = { fontFamily: "montserrat-regular" };

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const linkStyles = {
    color:  '#001426',
    textDecoration: 'none',
    fontFamily: 'montserrat-regular',
    fontWeight: isActive ? 'bold' : '300', // 'light' is not a valid font-weight value; '300' represents light.
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
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery('(max-width:992px)'); // Adjust the breakpoint based on your needs

  const handleToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  
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

<Box sx={{  backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4))", filter: 'drop-shadow(10px 10px 10px #b1b1b1d4)', borderBottom: "2px solid white" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingX: "20px" }}>
        {/* Logo */}
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Box
              component="img"
              src={logoImage || `${PublicUrl}/assets/images/logosap.svg`}
              alt={logoImage ? "Logo" : "No Image"}
              sx={{
                width: '100%',
                minWidth: '100px',
                maxWidth: '170px',
                height: { lg: "40px", md: "36px", sm: "24px" },
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.target.src = `${PublicUrl}/assets/images/logosap.svg`;
                e.target.alt = 'No Image';
              }}
            />

            {/* Dropdown for Property Selection */}
            <Box display="flex" justifyContent="end" pb={0.6}>
              <FormControl
                variant="standard"
                sx={{ width: { md: "120px", sm: "100px" }, paddingLeft: "25px" }}
              >
                <TextField
                  select
                  variant="standard"
                  value={selectedProperty}
                  onChange={handleSelectChange}
                  SelectProps={{ IconComponent: KeyboardArrowDownIcon }}
                  sx={{ width: { md: "120px", sm: "100px" }, paddingLeft: "2px" }}
                >
                  {property?.list?.map((prop) => (
                    <MenuItem key={prop.id} value={prop.id}>
                      <Typography
                        component="span"
                        sx={{ fontSize: { lg: "13px", md: "13px", sm: "12px", xs: "12px" } }}
                      >
                        {prop.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Box>
          </Box>


        {/* Hamburger Menu for Mobile View */}
        {isMobile ? (
          <>
            <IconButton onClick={handleToggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={openDrawer} onClose={handleToggleDrawer}>
              <Box sx={{ width: 250, padding: '20px',display:"flex",flexDirection:"column",gap:"10px" }}>
                <IconButton onClick={handleToggleDrawer} sx={{display:"flex",justifyContent:"end"}}>
                  <CloseIcon />
                </IconButton>
                {/* NavLinks */}
                <NavLink to="/map" label="Map" />
                <NavLink to="/controlcenter" label="Control Center" />
                <NavLink to="/alerts" label={<CustomLabel />} />
                <NavLink to="/devices" label="Devices" />
                <NavLink to="/insights" label="Insights" />

                {/* Profile Section */}
                <Box sx={{ flexGrow: 0,marginTop:"20px" }}>
        <Tooltip title="Open settings">
          <Box>
            <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center"  >
              <Typography variant="body-2" fontSize="14px" textAlign="center" fontFamily="montserrat-regular">{" "}
                <Box display="flex" alignItems="center" onClick={(e) => setAnchorElUser(e.currentTarget)} cursor="pointer"> <span >Welcome,</span> {firstName}{" "}{secondName} <KeyboardArrowDownIcon cursor="pointer" /></Box>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {moment().format("ddd MM-DD-YY | HH:mm")}
              </Typography>
            </Box>
          </Box>
        </Tooltip>
        <Menu
          sx={{
            mt: '55px',
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
              </Box>
            </Drawer>
          </>
        ) : (
          // Desktop View
          <Box sx={{ display: "flex", gap: "40px", alignItems: "center" }}>
         <Box sx={{display:"flex",gap:"10px"}}>
         <NavLink to="/map" label="Map" />
            <NavLink to="/controlcenter" label="Control Center" />
            <NavLink to="/alerts" label={<CustomLabel />} />
            <NavLink to="/devices" label="Devices" />
            <NavLink to="/insights" label="Insights" />
         </Box>

            {/* Profile */}
            <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <Box>
            <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center"  >
              <Typography variant="body-2" fontSize="15px" textAlign="center" fontFamily="montserrat-regular">{" "}
                <Box display="flex" alignItems="center" onClick={(e) => setAnchorElUser(e.currentTarget)} cursor="pointer"><span> Welcome, {" "}</span> <span style={{fontWeight:"bold",paddingLeft:"5px"}}>{" "} {firstName}{" "}{secondName}</span> <KeyboardArrowDownIcon cursor="pointer" /></Box>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {moment().format("ddd MM-DD-YY | HH:mm")}
              </Typography>
            </Box>
          </Box>
        </Tooltip>
        <Menu
          sx={{
            mt: '55px',
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
          </Box>
        )}
      </Box>
    </Box>
    </>

    
  );
}


export default Navbar;


