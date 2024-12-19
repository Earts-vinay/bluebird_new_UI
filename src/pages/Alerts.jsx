
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components';
import { Box, TextField,RadioGroup,Grid, Table,Divider, FormControlLabel,TableBody, TableCell,Radio, TableContainer, TableHead, TableRow, Paper, Typography, Popover, Pagination, MenuItem, Select, Container, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import axios from "axios";
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/apiResponse/loginApiSlice';
import Loader from '../components/Loader';
import dayjs from 'dayjs';
import { selectedPropertyByUser } from '../redux/apiResponse/propertySlice';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { setSelectedDateSlice, setIsAlertInfo } from '../redux/apiResponse/alertInsideSlice';
import { useDispatch } from 'react-redux';
import { StaticDatePicker } from '@mui/x-date-pickers';
import HeaderLayout from '../components/customStyles/HeaderLayout';

const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL

const commonStyles = {
  fontFamily: "montserrat-regular",
};
const Alerts = () => {
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector(selectToken);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [anchorEl, setAnchorEl] = useState(null);
  const seleProp = useSelector(selectedPropertyByUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const date = useSelector(state => state.alertInside.selectedDate)
  const [selectedDate, setSelectedDate] = useState(date);
  const [isAlert, setIsAlert] = useState([]);
  const [anchorSortEl, setAnchorSortEl] = useState(null);

  const handleTableRowClick = (row) => {
    navigate(`/cameramapalert/${row.id}`, { state: { plate: row?.plate } });
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = searchTerm ? {
        search: searchTerm,
        property_id: seleProp?.id,
        start_time: selectedDate,
        end_time: selectedDate,
      } : {
        property_id: seleProp?.id,
        page: page + 1,
        limit: rowsPerPage,
        start_time: selectedDate,
        end_time: selectedDate,
      }
      try {
        const response = await axios.get(`${BaseUrl}/api/vec_alert`, {
          params: data,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        setAlertData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, page, rowsPerPage, seleProp?.id, selectedDate, searchTerm, date]);

  useEffect(() => {
    const { code, data } = alertData;
    if (code === 200) {
      const alertsInfo = data?.list?.filter((item, val) => item.is_resolved === 0);
      setIsAlert(alertsInfo);
    }
  }, [alertData]);
  useEffect(() => {
    if (isAlert.length > 0) {
      dispatch(setIsAlertInfo(true))
    } else {
      dispatch(setIsAlertInfo(false))
    }
  }, [isAlert])

  const onChange = async (e) => {
    setSearchTerm(e.target.value);
  };

  let formattedDate;
  if (selectedDate) {
    formattedDate = moment(selectedDate).format('MM-DD-YYYY');
  } else {
    formattedDate = moment().format('MMM DD YYYY');
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorSortEl(null);
  };

  const handleDateSelect = (date) => {
    const startDate = (moment(date.$d).format("YYYY-MM-DD"))
    setSelectedDate(startDate);
    dispatch(setSelectedDateSlice(startDate))
    setAnchorEl(null);
  };

  console.log("alertData",alertData);
  

  return (
    <div>
      <Container maxWidth="xxl" >
        <HeaderLayout>

          <>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", py: 2, px: 2, gap: "20px", position: 'sticky', top: 0, zIndex: 1 }}>
              <Box sx={{ cursor: "pointer" }}>
                <img src={PublicUrl + "/assets/images/calender.svg"} alt="" width="30px" onClick={handleClick} />
              </Box>
              <Box>
                <Typography sx={{ color: "#01669a" }}>
                  {formattedDate}
                </Typography>
              </Box>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    label="Event Date"
                    value={dayjs(selectedDate)}
                    onChange={handleDateSelect}
                    disableFuture
                    components={{
                      ActionBar: () => null, // This will remove the action bar containing the buttons
                    }}
                    sx={{
                      '& .MuiPickersLayout-toolbar': {
                        display: 'none',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Popover>
              <TextField
                label="Search by Camera, License"
                variant="outlined"
                value={searchTerm}
                onChange={onChange}
                size="small"
                InputLabelProps={{
                  style: { fontFamily: 'montserrat-regular', fontSize: "13.5px" ,fontStyle:"italic", color:"#06122b"},
                }}
                sx={{
                  "&:hover .MuiOutlinedInput-root": {
                    "& > fieldset": { border: '1px solid #0000004d' },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": { border: "solid 1px #0000004d" },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "#06122b" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Content */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                <Loader loading={loading} />
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ backgroundColor: "transparent", height: "100%", overflowY: "auto", fontFamily: "montserrat-regular", boxShadow: "none", flexGrow: 1 }}>
                <Table>
                  {/* Table Head */}
                  <TableHead>
                    <TableRow sx={{ position: 'sticky', top: 0, background: 'linear-gradient(-60.13deg, #F3FBFF 0%, #FFFFFF 33%, #F0FAFD 52%, #F7FCFF 75%, #CBE8F8 100%)' }}>
                      <TableCell></TableCell>
                      <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Camera</TableCell>
                      <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Zone</TableCell>
                      <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Pole Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Event Type</TableCell>
                      <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Event Time</TableCell>
                      <TableCell sx={{ fontWeight: "bold", paddingY: "20px", fontSize: { md: "16px", sm: "14px" }, ...commonStyles }}>Add Info</TableCell>
                    </TableRow>
                  </TableHead>
                  {/* Table Body */}
                  <TableBody>
                    {alertData?.data?.list?.length > 0 ? (
                      alertData?.data?.list?.map((row, index) => (
                        <TableRow key={row.id} sx={{ cursor: 'pointer' }} onClick={() => handleTableRowClick(row)}>
                          <TableCell width="20%" sx={{ paddingY: "10px", ...commonStyles }}>
                            <img
                              src={row.img_url}
                              alt={`Image ${index + 1}`}
                              style={{
                                width: { lg: "150px", md: "150px", sm: "100px" },
                                height: '80px',
                                borderRadius: "5px",
                                paddingLeft: { md: "30px", lg: "30px", sm: "10px" }
                              }}
                              onError={(e) => {
                                e.target.src = `${PublicUrl}/assets/images/noimage.png`;
                                e.target.alt = "No Image";
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ paddingY: "10px", ...commonStyles }}>
                            <Typography variant='h6' sx={{ paddingY: "10px", color: "#657889", ...commonStyles, fontSize: { md: "14px", sm: "14px" } }} fontWeight="bold">{row.camera.name}</Typography>
                          </TableCell>
                          <TableCell sx={{ paddingY: "10px", ...commonStyles }}>
                            {row.zones.length > 0 ? (
                              row.zones.map((zone, i) => (
                                <Typography key={i} variant="h6" sx={{ fontSize: { md: "14px", sm: "14px" }, ...commonStyles, color: "#657889" }} fontWeight="bold">
                                  {zone.name}
                                </Typography>
                              ))
                            ) : (
                              <Typography variant="h6" sx={{ fontSize: { md: "14px", sm: "14px" }, ...commonStyles, color: "#657889" }} fontWeight="bold"> - </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ paddingY: "10px", ...commonStyles }}>
                            <Typography variant='h6' sx={{ fontSize: { md: "14px", sm: "14px" }, ...commonStyles, color: "#657889" }} fontWeight="bold">{row.pole.name}</Typography>
                          </TableCell>
                          <TableCell sx={{ paddingY: "10px", ...commonStyles }}>
                            <Box display="flex" gap={2}>
                              <img src={PublicUrl + '/assets/images/carx.svg'} />
                              <Box display="flex" flexDirection="column" p={0} sx={{ fontSize: { md: "14px", sm: "14px" }, ...commonStyles, color: "#657889" }} fontWeight="bold">
                                {row.plate}
                                <Typography variant='body-2' sx={{ color: "red", textAlign: "start", py: "0px", ...commonStyles }}>
                                  {row.is_in_property === 1 ? "Still on property" : row.is_in_property === 0 ? "Not on property" : ""}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ paddingY: "10px", ...commonStyles }}>
                            <Typography fontWeight="bold" sx={{ fontSize: { md: "14px", sm: "14px" }, ...commonStyles, color: "#657889" }}>{row.create_time}</Typography>
                          </TableCell>
                          <TableCell sx={commonStyles}>
                            <Typography sx={{ fontWeight: "bold", color: row.is_resolved === 0 ? "red" : "gray" }}>
                              {row.is_resolved === 0 ? "Open" : "Closed"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ textAlign: 'center', paddingY: '20px', ...commonStyles }}>
                          No Alerts available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Footer */}
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: "10px", position: 'sticky', bottom: 0, zIndex: 1, background: " linear-gradient(-60.13deg, #F3FBFF 0%, #FFFFFF 33%, #F0FAFD 52%, #F7FCFF 75%, #F7FCFF 100%)", }}>
              <Pagination
                count={Math.ceil(alertData?.data?.total / rowsPerPage)}
                color="primary"
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
              />
            </Box>
          </>
        </HeaderLayout>
      </Container>
    </div>

  );
}

export default Alerts;
