import React, { useEffect, useState } from 'react';
import { Box, Grid,} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../redux/apiResponse/loginApiSlice';
import axios from 'axios';
import { selectedPropertyByUser } from '../../redux/apiResponse/propertySlice';
import StatCard from '../customStyles/StatCard';
import DonutChart from './Charts/DonutChart';
import IncidentChart from './Charts/IncidentChart';
import HeatmapChart from './Charts/HeatmapChart';
import { fetchDataList, fetchCountListHour, fetchLast7Count } from '../../redux/apiResponse/countingSlice';
import { fetchVehicleData, fetchZoneAlert } from '../../redux/apiResponse/alertSlice';

const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL;
const commonStyles = { fontFamily: "montserrat-regular" };
const Incident = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [zones, setZones] = useState([]);
  const [percents, setPercents] = useState([]);
  const [alertsInfo, setAlertsInfo] = useState([]);
  const seleProp = useSelector(selectedPropertyByUser);
  const moment = require('moment');
  const today = moment();
  const startTime = today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = today.format('YYYY-MM-DD');
  const startonlytime = today.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const endonlytime = today.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const propertyId = seleProp?.id;
  const zoneId = zones;
  const startDate = startTime;
  const endDate = endTime;
  const { dataList,countListHour,  last7Count } = useSelector((state) => state.counting);
  const vehicleData = useSelector((state) => state.Alert.vecAlert);
  const zoneAlert = useSelector((state) => state.Alert.zoneAlert);

    //counting Api
    useEffect(() => {
      if (propertyId && token) {
        dispatch(fetchDataList({ propertyId, startDate: startTime, endDate: endTime, token }));
        dispatch(fetchCountListHour({ propertyId, startonlytime, endonlytime, token }));
        // dispatch(fetchLast7Count({ propertyId, start7thTime, end7thTime, token }));
        dispatch(fetchVehicleData({propertyId, startDate, endDate }));
        dispatch(fetchZoneAlert({ propertyId, zoneId, startDate, endDate }));
      }
    }, [propertyId, token ]);
 
  useEffect(() => {
    const alerts = []
    vehicleData[0]?.list?.forEach(item => {
      alerts.push(item.resolved_alert_num + item.unresolved_alert_num);
    });
    setAlertsInfo(alerts);
  }, [vehicleData]);

  useEffect(() => {
    let total = 0;
    let Zones = [];
    let Percents = [];
    const a = zoneAlert.map((item, ind) => {
      const totalAlertsByItem = item.list.reduce((acc, cam) => {
        acc = acc + cam.resolved_alert_num + cam.unresolved_alert_num
        return acc;
      }, 0);
      total = total + totalAlertsByItem;
      return {
        id: item.id,
        alertsPerZone: totalAlertsByItem
      }
    })

    a.forEach((item, ind) => {
      Zones.push(item.id);
      const percent = item.alertsPerZone === 0 ? 0 : (item.alertsPerZone / total) * 100;
      Percents.push(percent);
    })
    setZones(Zones);
    setPercents(Percents)
  }, [zoneAlert])

  const zoneNames = zoneAlert.map(zone => zone.name);

  // Calculate the total people_enter for the current date
  const currentDate = endDate;
  const formattedDate = currentDate;
  const filteredData = dataList.filter(item => item.date_time.slice(0, 10) === formattedDate);
  const filteredVehicleData = vehicleData[0]?.list?.filter(item => item.date_time.slice(0, 10) === formattedDate);

  const totalPeopleEnterToday = filteredData.reduce((acc, item) => acc + item.people_enter, 0);
  const peopleOccupancyToday = filteredData.reduce((acc, item) => acc + item.people_occupancy, 0);
  const vehicleEnterToday = filteredData.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const vehicleOccupancyToday = filteredData.reduce((acc, item) => acc + item.vechicle_occupancy, 0);

  // alerts
  const todayVehiclealerts = filteredVehicleData?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);
  console.log("todayVehiclealerts", todayVehiclealerts);

  const filteredDataStartDate = dataList.filter(item => {
    const itemDate = moment(item.date_time, 'YYYY-MM-DD');
    return itemDate.isSame(startDate, 'day');
  });

  const vehicleFilteredDataStartDate = vehicleData[0]?.list?.filter(item => {
    const itemDate = moment(item.date_time, 'YYYY-MM-DD');
    return itemDate.isSame(startDate, 'day');
  });

  // Calculate totals for the start date (7 days ago)
  const totalPeopleEnter = filteredDataStartDate.reduce((acc, item) => acc + item.people_enter, 0);
  const peopleOccupancy = filteredDataStartDate.reduce((acc, item) => acc + item.people_occupancy, 0);
  const vehicleEnter = filteredDataStartDate.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const vehicleOccupancy = filteredDataStartDate.reduce((acc, item) => acc + item.vechicle_occupancy, 0);

  const last7Vehiclealerts = vehicleFilteredDataStartDate?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);
  const totalVehiclealerts = alertsInfo.reduce((acc, item) => acc + item, 0);

  // Difference
  const percentagePeopleEnter = (((totalPeopleEnterToday - totalPeopleEnter) / totalPeopleEnter) * 100).toFixed(2);
  const percentageVehicleOccupancy = (((todayVehiclealerts - totalVehiclealerts) / totalVehiclealerts) * 100).toFixed(2);

  const [heatmapSeries, setHeatmapSeries] = useState([]);

  useEffect(() => {
    const today = moment();
    const startTime = today.clone().subtract(7, 'days').startOf('day').format('YYYY-MM-DD 00:00:00');
    const endTime = today.endOf('day').format('YYYY-MM-DD 23:59:59');

    const getPropertyData = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/api/vec_alert/property`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: {
              property_id: propertyId,
              time_type: 'hour',
              start_time: startTime,
              end_time: endTime
            }
          }
        );
        const data = response.data?.data?.[0]?.list;
        let transformedData = [];
        data.forEach((item) => {
          const date = moment(item.date_time).format('YYYY-MM-DD');
          let entry = transformedData.find(entry => entry.date === date);
          if (!entry) {
            entry = { date, data: [] };
            transformedData.push(entry);
          }
          entry.data.push({ x: moment(item.date_time).format('HH:mm'), y: item.resolved_alert_num + item.unresolved_alert_num });
        });
        const seriesData = transformedData.map(day => ({
          name: moment(day.date).format('ddd'),
          data: day.data
        }));
        setHeatmapSeries(seriesData.reverse());
      } catch (error) {
        console.error('Error fetching property data:', error);
      }
    };

    getPropertyData();
  }, [token, propertyId]);


  const cardData = [
    {
      background: 'linear-gradient(121deg, #01669a 100%, #1b3664 2%)',
      icon: `${PublicUrl}/assets/icons/PeopleTotalEntries.svg`,
      title: 'Pedestrain Alerts',
      mainValue: totalPeopleEnterToday,
      subValue: totalPeopleEnter,
      percentage: percentagePeopleEnter,
    },
    {
      background: "linear-gradient(120deg, #52a1cc 3%, #93d9ff)",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Vehicle Alerts",
      mainValue: todayVehiclealerts,
      subValue: last7Vehiclealerts,
      percentage: percentageVehicleOccupancy,
    },
  ];

  return (
    <>
      <Box sx={{ padding: 0, marginTop: "10px" }}>
        <Box sx={{ width: "100%", display: "flex", gap: "20px" }}>
          <Box sx={{ width: "24%" }}>
            <Box>
              {cardData.map((card, index) => (
                <Box key={index} width={{ xs: '100%', sm: '48%', md: '100%' }} mb={3}>
                  <StatCard {...card} commonStyles={commonStyles} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Heatmap */}
          <Box sx={{ width: "74%" }}>
          <HeatmapChart series={heatmapSeries} />
          </Box>
        </Box>

        {/* Bar Chart, Donut Chart, and Stepline Chart */}
        <Grid container spacing={2} justifyContent="center" mt={1}>
          <Grid item xs={12} md={5}>
            <DonutChart series={percents} title="Alerts By Zone" labels={zoneNames} size="90%" donutcolors={['#01669a','#46c8f5','#52a1cc']} markercolors={['#01669a','#46c8f5','#52a1cc']} />
          </Grid>
          <Grid item xs={12} md={7}>
            <IncidentChart series={alertsInfo} title="Incidents Detected" />
          </Grid>
        </Grid>
      </Box>
    </>
  )
};

export default Incident;
