
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment, Typography, Popover, MenuItem, Select, Container, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from "axios";
import { selectToken } from '../redux/apiResponse/loginApiSlice';
import { setShowNavbar } from '../redux/apiResponse/navBarSlice';
import { fetchDeviceList } from '../redux/apiResponse/deviceSlice';
import { selectedPropertyByUser } from '../redux/apiResponse/propertySlice';
import Loader from '../components/Loader';
import HeaderLayout from '../components/customStyles/HeaderLayout';

const commonStyles = { fontFamily: "montserrat-regular" };
const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL

const Devices = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [deviceListData, setDeviceListData] = useState([]);
  const [dispalyList, setDisplayList] = useState([]);
  const [loading, setLoading] = useState(true);
  // const deviceList = useSelector(state => state.Device.deviceList);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const seleProp = useSelector(selectedPropertyByUser);
  const [total, setTotal] = useState(null);
  // const deviceStatus = useSelector(state => state.Device.status);
  // const deviceError = useSelector(state => state.Device.error);

  useEffect(() => {
    const fetchData = async () => {
      const data = searchTerm ? {
        search: searchTerm,
        property_id: seleProp?.id,
      } : {
        property_id: seleProp?.id,
        page: page + 1, // Adjusted page parameter
        limit: rowsPerPage,

      }
      try {
        const response = await axios.get(`${BaseUrl}/api/device`, {
          params: data,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        const final_list = response.data.data.list.map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            pole_id: item.pole_id,
            pole_name: item.pole.name,
            image: item.screen_capture,
            device_id: item.parent_device_id,
            camera_model: item.model_type,
            status: item.healthy_info.is_online ? 'Online' : 'Offline'
          }
        });

        setTotal(response?.data?.data?.total);
        setDeviceListData(final_list);
        setDisplayList(final_list);
        setLoading(false);
      } catch (error) {

        setLoading(false);
        // Handle error...
      }
    };

    fetchData();
  }, [token, page, rowsPerPage, seleProp?.id, selectedDate]);

  useEffect(() => {
    let updatedList = [...deviceListData]; // Create a copy of deviceListData

    // Apply sorting based on name if searchTerm is empty
    if (searchTerm === '') {
      updatedList.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Apply filtering based on searchTerm (case-sensitive)
      const searchTermLowerCase = searchTerm.toLowerCase();
      updatedList = updatedList.filter((camera) =>
        camera?.name.includes(searchTermLowerCase) ||
        camera?.device_id.toString().includes(searchTermLowerCase) ||
        camera?.pole_id.toString().includes(searchTermLowerCase) ||
        camera?.pole_name.toString().includes(searchTermLowerCase) ||
        camera?.camera_model.toLowerCase().includes(searchTermLowerCase) ||
        camera?.status.includes(searchTermLowerCase)
      );
    }

    setDisplayList(updatedList);
  }, [searchTerm, deviceListData]);

  useEffect(() => {
    dispatch(fetchDeviceList(seleProp?.id))
      .then(() => setLoading(false)) // Set loading to false when data is fetched successfully
      .catch(error => {
        console.error('Error fetching device list:', error);
        setLoading(false); // Set loading to false in case of error
      });
  }, [dispatch, seleProp?.id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };



  return (
    <div>
      <Container maxWidth="xxl" sx={{}}>
        <HeaderLayout>
          <>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", pt: 2, gap: "25px", px: 2 }}>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticDateTimePicker
                    label="Event Date and Time"
                    value={selectedDate}
                    onChange={handleDateSelect}
                    sx={{
                      '& .MuiPickersLayout-toolbar': {
                        display: 'none',
                      },
                    }}
                    onClose={handleClose}
                  />
                </LocalizationProvider>
              </Popover>
              <TextField
                label="Search by Camera , License"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', borderColor: 'blue !important' }}
                InputLabelProps={{
                  style: { fontFamily: 'montserrat-regular', fontSize: "14px", fontStyle:"italic", color:"#9db7f4"},
                }}
                sx={{
                  "&:hover .MuiOutlinedInput-root": {
                    "& > fieldset": { border: '1px solid #2465e9' },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": { border: "solid 1px #2465e9" },
                  },
                }}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "#2465e9" }} />
                    </InputAdornment>
                  ),
                }}

              />
            </Box>

            {/* Content */}
            {loading ? ( // Show loader while loading
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Loader />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ backgroundColor: "transparent", height: "64vh", overflow: "auto", boxShadow: "none" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ position: 'sticky', top: 0, background: 'linear-gradient(119deg, #ebeffa 2%, #e8ebfd 30%, #f0ecf9 51%, #efeefb 70%, #eef7ff 100%)', }}>
                        <TableCell></TableCell>
                        <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Device Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Device ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Pole Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Camera Model</TableCell>
                        <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dispalyList.length > 0 ? (
                        dispalyList.map((row, index) => (
                          <TableRow key={row.id}>
                            <TableCell width="20%" sx={{ paddingY: "12px" }}>
                              <img
                                src={row.image}
                                alt={`Image ${index + 1}`}
                                style={{
                                  width: { lg: "150px", md: "150px", sm: "100px" },
                                  height: '80px',
                                  borderRadius: "5px",
                                  paddingLeft: { md: "50px", lg: "50px", sm: "10px" }
                                }}
                                onError={(e) => {
                                  e.target.src = `${PublicUrl}/assets/images/noimage.png`;
                                  e.target.alt = "No Image";
                                }}

                              />
                            </TableCell>
                            <TableCell sx={{ fontSize: { md: "14px", sm: "14px" }, fontWeight: "bold", paddingY: "12px", color: "#657889", ...commonStyles }}>{row.name}</TableCell>
                            <TableCell sx={{ fontSize: { md: "14px", sm: "14px" }, fontWeight: "bold", paddingY: "12px", color: "#657889", ...commonStyles }}>{row.device_id}</TableCell>
                            <TableCell sx={{ fontSize: { md: "14px", sm: "14px" }, fontWeight: "bold", paddingY: "12px", color: "#657889", ...commonStyles }}>{row.pole_name}</TableCell>
                            <TableCell sx={{ fontSize: { md: "14px", sm: "14px" }, fontWeight: "bold", paddingY: "12px", color: "#657889", ...commonStyles }}>{row.camera_model}</TableCell>
                            <TableCell sx={{ fontSize: { md: "14px", sm: "14px" }, fontWeight: "bold", paddingY: "12px", color: "#657889", ...commonStyles, color: row.status === "Online" ? 'green' : 'red' }}>
                              {row.status}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ paddingY: "12px" }}>
                            No records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            {/* Footer */}
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '5px' }}>
              <Pagination
                count={Math.ceil(total / rowsPerPage)}
                color="primary"
                page={page + 1}
                onChange={(event, value) => handleChangePage(event, value - 1)}
                sx={commonStyles}
              />
            </Box>
          </>
        </HeaderLayout>
      </Container>
    </div>
  );
}
export default Devices;
