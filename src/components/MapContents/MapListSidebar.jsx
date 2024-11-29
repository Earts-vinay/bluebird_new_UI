import React, { useEffect, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import moment from "moment";
import SearchIcon from '@mui/icons-material/Search';
import { fetchMapListDataStart, fetchMapListDataSuccess, selectMapListPoleResponseData, selectLoading } from "../../redux/apiResponse/maplistSlice";
import { Snackbar, Box, SnackbarContent, Stack, TextField, Grid, Table, Divider, TableHead, TableRow, TableCell, TableBody, Paper, InputAdornment, Typography, Card, CardMedia, CardContent, Button, Popover, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { selectToken } from "../../redux/apiResponse/loginApiSlice"
import { selectPropertyResponseData, selectPropertyByUser, selectedPropertyByUser } from '../../redux/apiResponse/propertySlice';
import axios from "axios";
import { setSelectedMapListDateSlice, } from '../../redux/apiResponse/alertInsideSlice'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TiArrowUnsorted } from "react-icons/ti";

const PublicUrl = process.env.PUBLIC_URL
const commonStyles = {
  fontFamily: "montserrat-regular",
  color: "#32628d",
  fontWeight: "bold"
};
const MapListSidebar = ({ polesInBoundaryData, setClickedRowData, role }) => {
  const BaseUrl = process.env.REACT_APP_API_URL;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alignment, setAlignment] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const seleProp = useSelector(selectedPropertyByUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorSortEl, setAnchorSortEl] = useState(null);
  const token = useSelector(selectToken);
  const [responsecameraData, setResponseCameraData] = useState({});
  const cameraData = useSelector(selectMapListPoleResponseData);
  const [fetchedData, setFetchedData] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [mapListAlertdata, setMapListAlertdata] = useState([]);
  const date = useSelector(state => state.alertInside.mapselectedDate)
  const [selectedDate, setSelectedDate] = useState(date);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [propertylistview, setPropertyListView] = useState([]);
  const today = moment().format('YYYY-MM-DD');
  const morningStartTime = moment(today).format('YYYY-MM-DD');
  const eveningEndTime = moment(today).format('YYYY-MM-DD');
  const License_plate_detection = process.env.PUBLIC_URL + '/assets/images/LicensePlate.svg';
  const Person_detection = process.env.PUBLIC_URL + '/assets/images/person.svg';
  const vehicle_detection = process.env.PUBLIC_URL + '/assets/images/carx.svg';
  const [detectionFilter, setDetectionFilter] = useState('all');


  let formattedDate;
  if (selectedDate) {
    formattedDate = moment(selectedDate).format('MMM DD YYYY');
  } else {
    formattedDate = moment().format('MMM DD YYYY');
  }

  const filteredZoomData = polesInBoundaryData.flatMap(boundaryPole =>
    mapListAlertdata?.data?.filter(data => data.id === boundaryPole.id)
  );

  useEffect(() => {
    const filteredZoomData = polesInBoundaryData.flatMap(boundaryPole =>
      mapListAlertdata?.data?.filter(data => data.id === boundaryPole.id)
    );
    setFilteredData(filteredZoomData);
    setDisplayList(filteredZoomData);
  }, [polesInBoundaryData, mapListAlertdata]);

  const handleSortChange = (event) => {
    const filterValue = event.target.value;
    setDetectionFilter(filterValue);
    const filteredList = mapListAlertdata.data
      .filter(obj => obj.status === 1)
      .map(obj => ({
        ...obj,
        cameras: obj.cameras.filter(camera => {
          if (filterValue === 'all') {
            return true;
          } else {
            return camera.detections.some(d =>
              d.analytics_type_id === (filterValue === 'person' ? 1 : 2) && d.status === 1
            );
          }
        })
      }))
      .filter(obj => obj.cameras.length > 0);

    setDisplayList(filteredList);
  };


  const handleDateSelect = (date) => {
    setSelectedDate(date)
    const startDate = (moment(date.$d).format("YYYY-MM-DD"))
    setSelectedDate(startDate);
    dispatch(setSelectedMapListDateSlice(startDate))
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    const sedata = mapListAlertdata.data
      .map((obj, ind) => {
        if (obj.cameras.length > 0) {
          const filterdata = obj.cameras.filter((obj, ind) => {
            const found = obj.name.search(query);
            if (found >= 0) {
              return obj;
            }
          });
          if (obj.name.toLowerCase().includes(query)) {
            return obj;
          }
          if (filterdata.length > 0) {
            return {
              ...obj,
              cameras: filterdata,
            };
          }
        }

      })
      .filter((val, ind) => val !== undefined);
    setFilteredData(sedata);
    setSearchQuery(query);
    setDisplayList(sedata);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortIconClick = (event) => {
    setAnchorSortEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorSortEl(null);
  };

  const handleListClick = () => {
    setSidebarOpen(true);
    setAlignment('list');
  };

  const handleMapClick = () => {
    setSidebarOpen(false);
    setAlignment('map');
  };

  const handleTableRowClick = (row, cameraId) => {
    setClickedRowData(row);
    const camera = row.cameras.find(cam => cam.id === cameraId);

    if (camera) {
      const alertsForCamera = row.alert_list.filter(alert => alert.camera_id === cameraId);
      if (alertsForCamera.length > 0) {
        const unresolvedAlert = alertsForCamera.find(alert => alert.is_resolved === 0);
        const plate = row?.alert_list[0].plate;

        if (unresolvedAlert) {
          navigate(`/camerapole/${cameraId}`, { state: { plate: plate } });
        } else {
          setOpen(true);
        }
      } else {
        setOpen(true);
      }
    } else {
      console.error("Camera not found with ID:", cameraId);
    }
  };

  const handlesnackClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        property_id: seleProp?.id,
      };
      try {
        const response = await axios.get(`${BaseUrl}/api/vec_alert/listbypole`, {
          params: data,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        setMapListAlertdata(response.data);
        setDisplayList(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, seleProp?.id, selectedDate]);

  return (
    <div>
      <>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={() => handlesnackClose({ vertical: 'top', horizontal: 'right' })}
        >
          <SnackbarContent
            style={{ backgroundColor: 'white', color: 'black' }}
            message="There are no alerts for this camera"
            action={
              <Button color="secondary" size="small" onClick={() => handlesnackClose({ vertical: 'top', horizontal: 'right' })}>
                CLOSE
              </Button>
            }
          />
        </Snackbar>
      </>
      <Box width="100%" >
        <ToggleButtonGroup
          fullWidth
          value={alignment}
          exclusive
          onChange={(event, newAlignment) => setAlignment(newAlignment)}
          aria-label="Platform"
          sx={{ backgroundColor: 'black', color: 'white', width: { lg: "15%", md: "20%", sm: "25%" } }}
        >
          <ToggleButton
            value="list"
            onClick={handleListClick}
            size='small'
            sx={{
              backgroundColor: "white",
              textTransform: "capitalize",
              fontFamily: "montserrat-regular",
              color: "#4a7399",
              fontWeight: "bolder",
              '&.Mui-selected': {
                backgroundColor: '#016699',
                color: "white",
                backdropFilter: "blur(15px)",
                boxShadow: "0 0 5px 0 rgba(25, 96, 159, 0.1)",
                border: "solid 1px #fff",
              },
              '&:hover, &.Mui-selected:hover': {
                backgroundColor: '#016699', // Same as selected state
                color: "white", // Ensure text matches the selected state
                border: "solid 1px #fff",
              },
            }}
          >
            List View
          </ToggleButton>
          <ToggleButton
            value="map"
            onClick={handleMapClick}
            size='small'
            sx={{
              backgroundColor: 'white',
              fontFamily: "montserrat-regular",
              fontWeight: "bold",
              color: "#4a7399",
              textTransform: "capitalize",
              '&.Mui-selected': {
                backgroundColor: '#016699',
                color: "white",
                backdropFilter: "blur(15px)",
                boxShadow: "0 0 5px 0 rgba(25, 96, 159, 0.1)",
                border: "solid 1px #fff",
              },
              '&:hover, &.Mui-selected:hover': {
                backgroundColor: '#016699', // Same as selected state
                color: "white", // Ensure text matches the selected state
                border: "solid 1px #fff",
              },
            }}
          >
            Map View
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {sidebarOpen && (
        <Paper
          style={{
            width: 600,
            transition: 'width 0.3s, left 0.3s',
            overflow: 'auto',
            position: 'absolute',
            top: '0',
            right: '0',
            height: "100%",
            zIndex: 1000,
            background: "linear-gradient(119deg, #ebeffa 2%, #e8ebfd 30%, #f0ecf9 51%, #efeefb 70%, #eef7ff 100%)"
          }}
          sx={{
            backdropFilter: "blur(15px)",
            boxShadow: "0 0 5px 0 rgba(25, 96, 159, 0.1)",
            border: "solid 1px #fff", borderRadius: "10px"
          }}
        >
          <Box sx={{ p: 2, backdropFilter: "blur(5px)", boxShadow: "-1px 6px 31px 0 rgba(25, 96, 159, 0.1)", backgroundColor: '#016699', borderRadius: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={2}>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="search"
                  type="search"
                  placeholder="Search by Camera,License plate"
                  size="small"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ color: '#06122b' }}>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: '100%',
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontStyle: "italic",
                    '& .MuiInputBase-input': {
                      fontSize: "12px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box height="90%" overflow="auto" sx={{ backgroundColor: "#eef6fc" }} >
            <Table  >
              <TableHead >
                <TableRow sx={{ position: 'sticky', top: 0, background: "#eef6fc" }}>
                  <TableCell></TableCell>
                  <TableCell sx={{ fontWeight: "bold", paddingY: "14px", fontSize: { md: "14px", sm: "14px" }, ...commonStyles }}>Camera</TableCell>
                  <TableCell sx={{ fontWeight: "bold", paddingY: "14px", fontSize: { md: "14px", sm: "14px" }, ...commonStyles }}>Event Type <TiArrowUnsorted fontSize={14} onClick={handleSortIconClick} sx={{ paddingTop: "30px" }} /></TableCell>
                  <TableCell sx={{ fontWeight: "bold", paddingY: "14px", fontSize: { md: "14px", sm: "14px" }, ...commonStyles }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {displayList?.length > 0 ? (
                  displayList?.map((data, index) => (
                    <React.Fragment key={index}>
                      {data?.cameras?.map((camera, cameraIndex) => (
                        <TableRow key={`${index}-${cameraIndex}`} onClick={() => handleTableRowClick(data, camera.id)} >
                          <TableCell width="120px" sx={{ paddingY: "12px" }}>
                            <img
                              src={camera.screen_capture}
                              alt={`Image ${index + 1}`}
                              style={{
                                width: { lg: "150px", md: "120px", sm: "180px" },
                                height: '80px',
                                borderRadius: "5px",
                              }}
                              onError={(e) => {
                                e.target.src = `${PublicUrl}/assets/images/noimage.png`;
                                e.target.alt = "No Image";
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ paddingY: '10px', color: '#111314', ...commonStyles, fontSize: { md: '12px', sm: '12px' } }}>
                            <Typography sx={{ fontSize: '15px', ...commonStyles }}>{camera.name}</Typography>
                            <Typography sx={{ fontSize: '12px', ...commonStyles }}>
                              {data.zones.length > 0 ? (
                                data.zones.length === 1 ? (
                                  `${data.zones[0]?.name}, ${data.name}`
                                ) : (
                                  `${data.zones[0]?.name} & ${data.zones.length - 1} others, ${data.name}`
                                )
                              ) : (
                                data.name
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ paddingY: "10px", color: "#111314", ...commonStyles, fontSize: { md: "12px", sm: "12px" } }}>
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                              <Box sx={{ display: "flex", marginRight: 2, alignItems: "center" }}>
                                {camera.detections && camera.detections.find(d => d.analytics_type_id === 1 && d.status !== 0) && (
                                  <img src={Person_detection} alt="Person Detection" style={{ width: "23px", height: "23px" }} />
                                )}
                              </Box>
                              <Box sx={{ display: "flex", marginRight: 2, alignItems: "center" }}>
                                {camera.detections && camera.detections.find(d => d.analytics_type_id === 2 && d.status !== 0) && (
                                  <img src={vehicle_detection} alt="Vehicle Detection" style={{ width: "23px", height: "23px" }} />
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ paddingY: "10px", color: "#111314", ...commonStyles, fontWeight: "bold", fontSize: { md: "12px", sm: "12px" }, color: camera?.healthy_info?.is_online === true ? "green" : "red" }}>
                            {camera?.healthy_info?.is_online === true ? "Online" : "Offline"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', paddingY: '20px', ...commonStyles }}>
                      No Records Found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      <Popover
        open={Boolean(anchorSortEl)}
        anchorEl={anchorSortEl}
        onClose={handleClose}
      >
        <Box p={2}>
          <RadioGroup value={detectionFilter} onChange={handleSortChange}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={9}>
                <Typography sx={{
                  fontSize: {
                    md: '14px', sm: '14px', fontFamily: "montserrat-regular",
                    color: "black"
                  }
                }}>Sort By</Typography>
              </Grid>
              <Grid item sx={{ color: 'blue', textAlign: 'left' }} xs={3}>
                <Typography sx={{ fontWeight: 'bold', fontSize: { md: '14px', sm: '14px', color: 'blue', fontFamily: "montserrat-regular" } }}>All</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2, backgroundColor: 'rgba(0, 0, 0, 0.1)', marginBottom: '0px', marginTop: "10px" }} />
            <FormControlLabel
              value="vehicle"
              control={<Radio />}
              label="Vehicle detection"
              labelPlacement="start"
              sx={{
                "&[class*='MuiFormControlLabel-root']": {
                  marginLeft: "0px !important",
                  marginRight: "0px !important",
                },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '1',
                fontFamily: "montserrat-regular",
                color: "black"
              }}
            />
            <FormControlLabel
              value="person"
              control={<Radio />}
              label="Person detection"
              labelPlacement="start"
              sx={{
                "&[class*='MuiFormControlLabel-root']": {
                  marginLeft: "0px !important",
                  marginRight: "0px !important",
                },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '1',
                fontFamily: "montserrat-regular",
                color: "black"
              }}
            />

            <FormControlLabel
              value="all"
              control={<Radio />}
              label="All detection"
              labelPlacement="start"
              sx={{
                "&[class*='MuiFormControlLabel-root']": {
                  marginLeft: "0px !important",
                  marginRight: "0px !important",
                },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '1',
                fontFamily: "montserrat-regular",
                color: "black"
              }}
            />
          </RadioGroup>
        </Box>
      </Popover>
    </div>
  );
};

export default MapListSidebar;
