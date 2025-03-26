import React, { useState, useEffect } from 'react';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Container, InputAdornment, Typography, Pagination, IconButton, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeviceStatistics, fetchDeviceUnhealthy } from '../../redux/apiResponse/deviceSlice';
import { selectedPropertyByUser } from '../../redux/apiResponse/propertySlice';
import Loader from '../Loader';
import PieChart from './Charts/PieChart';
import LineChart from './Charts/LineChart';
import { fetchPersonData, fetchVehicleData } from '../../redux/apiResponse/alertSlice';
import dayjs from 'dayjs';

const PublicUrl = process.env.PUBLIC_URL

const SystemStats = ({ dateRange, selectedRange, isCustomRangeSelected, customDates }) => {
  const dispatch = useDispatch();
  const [personalertsInfo, setPersonAlertsInfo] = useState([]);
  const seleProp = useSelector(selectedPropertyByUser);
  const [alertsInfo, setAlertsInfo] = useState([]);
  const propertyId = seleProp?.id;

  //data
  const StatData = useSelector((state) => state.Device.StatData);
  const apiData = useSelector((state) => state.Device.unhealth);
  const vehicleData = useSelector((state) => state.Alert.vecAlert);
  const personAlertsData = useSelector((state) => state.Alert.personAlerts);


  //loadings
  const StatDataloading = useSelector((state) => state.Device.statDataloading);
  const unhealthloading = useSelector((state) => state.Device.unhealthloading);

  const moment = require('moment');
  const today = moment().format("YYYY-MM-DD");
  const startTime = dateRange.startDate
  const endTime = dateRange.endDate
  const startDate = startTime;
  const endDate = endTime;
  const vehicleStartDate = today;
  const vehicleEndDate = today;
  const responseDates = vehicleData?.flatMap((zone) =>
    zone.list?.map((item) => item.date_time) || []
  );

  const alerttype = isCustomRangeSelected
    ? dayjs(dateRange.endDate).diff(dayjs(dateRange.startDate), "days") >= 30
      ? "month"
      : "date"
    : selectedRange === "D"
      ? "hour"
      : selectedRange === "Y"
        ? "month"
        : customDates // If customDates is selected, set type to "date"
          ? "date"
          : "date";

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchDeviceStatistics(propertyId));
      dispatch(fetchDeviceUnhealthy(propertyId))
      dispatch(fetchVehicleData({
        propertyId,
        startDate: selectedRange === "D" && !isCustomRangeSelected ? vehicleStartDate : startDate,
        endDate: selectedRange === "D" && !isCustomRangeSelected ? vehicleEndDate : endDate,
        type: alerttype,
        typeId: "1"
      }));
      dispatch(fetchPersonData({
        propertyId,
        startDate: selectedRange === "D" && !isCustomRangeSelected ? vehicleStartDate : startDate,
        endDate: selectedRange === "D" && !isCustomRangeSelected ? vehicleEndDate : endDate,
        type: alerttype,
        typeId: "0"
      }));
     
    }
  }, [dispatch, propertyId, startDate, endDate, alerttype]);


  useEffect(() => {
    const alerts = []
    vehicleData[0]?.list?.forEach(item => {
      alerts.push(item.resolved_alert_num + item.unresolved_alert_num);
    });
    setAlertsInfo(alerts);
  }, [vehicleData]);

  useEffect(() => {
    const personalerts = []
    personAlertsData[0]?.list?.forEach(item => {
      personalerts.push(item.resolved_alert_num + item.unresolved_alert_num);
    });
    setPersonAlertsInfo(personalerts);
  }, [personAlertsData]);

  // Alerts line chart
  const AlertsSeries = [
    {
      name: "Vehicle Alerts",
      data: alertsInfo,
    },
    {
      name: "Person Alerts",
      data: personalertsInfo
    }
  ];

  return (
    <>
      {StatDataloading && unhealthloading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Loader loading={StatDataloading && unhealthloading} />
        </Box>
      ) : (
        <Container maxWidth="xxl" style={{ padding: "0px !important", marginTop: "10px" }} disableGutters>
          <Box style={{ display: 'flex', flexDirection: 'row', width: '100%' }} mt={1} gap={2}>
            <Grid container spacing={2.5}>

              <Grid item xs={12} md={7}>
              <LineChart series={AlertsSeries} title="Alerts Raised" linechartcolors={['#ef7b73', '#46C8F5']} markercolors={['#ef7b73', '#46C8F5']} startDate={startTime} endDate={endTime} selectedRange={selectedRange} responseDates={responseDates} customDates={customDates} isCustomRangeSelected={isCustomRangeSelected} />
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
                            <TableCell sx={{ display: "flex", gap: "10px" }}>
                              {row.cameras.map((camera, cameraIndex) => (
                                <img
                                  key={camera.id}
                                  src={camera.screen_capture}
                                  alt={`Camera ${cameraIndex + 1}`}
                                  style={{
                                    width: { lg: "150px", md: "150px", sm: "100px" },
                                    height: '80px',
                                    borderRadius: "5px",
                                    marginRight: "10px", // Adjust space between images if needed
                                  }}
                                  onError={(e) => {
                                    e.target.src = `${PublicUrl}/assets/images/noimage.png`;
                                    e.target.alt = "No Image";
                                  }}
                                />
                              ))}
                            </TableCell>
                            <TableCell><Typography>{row.name}</Typography></TableCell>
                            <TableCell>{row.pole && row.pole.name}</TableCell>
                            <TableCell>{row.healthy_info && row.healthy_info.last_online}</TableCell>
                            <TableCell>{row.healthy_info && row.healthy_info.offline_time}</TableCell>
                            <TableCell>{row.healthy_info && row.healthy_info.is_online ? 'Online' : 'Offline'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ textAlign: "center" }}>No data available</TableCell>
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
