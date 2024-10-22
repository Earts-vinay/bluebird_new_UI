import React, { useState, useEffect } from 'react';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Container, InputAdornment, Typography, Pagination, IconButton, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeviceStatistics, fetchDeviceUnhealthy } from '../../redux/apiResponse/deviceSlice';
import { selectToken } from '../../redux/apiResponse/loginApiSlice';
import axios from 'axios';
import { selectedPropertyByUser } from '../../redux/apiResponse/propertySlice';
import Loader from '../Loader';
import PieChart from './Charts/PieChart';
import LineChart from './Charts/LineChart';
import { fetchVehicleData } from '../../redux/apiResponse/alertSlice';


const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL

const SystemStats = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const seleProp = useSelector(selectedPropertyByUser);
  const [alertsInfo, setAlertsInfo] = useState([]);
  const propertyId = seleProp?.id;

  //data
  const StatData = useSelector((state) => state.Device.StatData);
  const apiData = useSelector((state) => state.Device.unhealth);
  const vehicleData = useSelector((state) => state.Alert.vecAlert);


  //loadings
  const StatDataloading = useSelector((state) => state.Device.statDataloading);
  const unhealthloading = useSelector((state) => state.Device.unhealthloading);

  const moment = require('moment');
  const today = moment();
  const startTime = today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = today.format('YYYY-MM-DD');
  const startDate = startTime;
  const endDate = endTime;

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchDeviceStatistics(propertyId));
      dispatch(fetchDeviceUnhealthy(propertyId))
      dispatch(fetchVehicleData({propertyId, startDate, endDate }));
    }
  }, [dispatch, propertyId,startDate, endDate]);

 
  useEffect(() => {
    const alerts = []
    vehicleData[0]?.list?.forEach(item => {
      alerts.push(item.resolved_alert_num + item.unresolved_alert_num);
    });
    setAlertsInfo(alerts);
  }, [vehicleData]);


    // Alerts line chart
    const AlertsSeries = [
      {
        name: " Alerts",
        data: alertsInfo
      },
      // {
      //   name: "Vehicle Alerts",
      //   data: [0, 1, 5, 3, 2, 7]
      // }
    ];

  return (
    <>
      {StatDataloading && unhealthloading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Loader loading={loading} />
        </Box>
      ) : (
        <Container maxWidth="xxl" style={{ padding: "0px !important", marginTop: "10px" }} disableGutters>
          <Box style={{ display: 'flex', flexDirection: 'row', width: '100%' }} mt={1} gap={2}>
            <Grid container spacing={2.5}>

              <Grid item xs={12} md={7}>
              <LineChart series={AlertsSeries} title="Alerts Raised"  linechartcolors={'#ef7b73'} markercolors={'#ef7b73'}/>
              </Grid>
              <Grid item xs={12} md={5}>
                {StatData.data?.map?.((rowData, index) => (
                  <div key={index}>
                    <PieChart
                      series={[rowData?.offline_num ?? 0, rowData?.online_num ?? 0, rowData?.no_paired_num ?? 0]}
                      labels={['No. Offline', 'No. Online', 'No. not paired']}
                      title="Camera Paired"
                      colors={['#01669a', '#abd9f4', '#ef7b73']}
                    />
                  </div>
                ))}
              </Grid>
            </Grid>
          </Box>

          <div style={{ marginTop: "20px" }}>
            <div maxWidth="4xl" sx={{ height: "55vh" }}>
              <Box sx={{ backgroundColor: "#FFFFFF", width: "100%", marginTop: "10px", borderRadius: "10px" }}>
                <Typography variant="h6" align="left" sx={{ paddingTop: '10px', paddingLeft: "10px", color: '#003A6F', }}>Offline Cameras</Typography>
                <TableContainer sx={{ backgroundColor: "transparent", height: "40vh", overflow: "auto" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ position: 'sticky', top: 0, background: '#fdfdfd', }}>
                        <TableCell></TableCell>
                        <TableCell>Device Name</TableCell>
                        <TableCell>Pole</TableCell>
                        <TableCell>Last Online</TableCell>
                        <TableCell>Offline Time</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData.data && apiData.data?.length > 0 ? (
                        apiData.data.map((row, index) => (
                          <TableRow key={row.id} sx={{ cursor: 'pointer' }}>
                            <TableCell width="20%" >
                              <img
                                src={row.screen_capture}
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
                            <TableCell><Typography>{row.name}</Typography></TableCell>
                            <TableCell>{row.pole_id}</TableCell>
                            <TableCell>{row.healthy_info && row.healthy_info.last_online}</TableCell>
                            <TableCell>{row.healthy_info && row.healthy_info.offline_time}</TableCell>
                            <TableCell>{row.healthy_info && row.healthy_info.is_online ? 'Online' : 'Offline'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} sx={{textAlign:"center"}}>No data available</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default SystemStats;
