import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { selectToken } from '../../redux/apiResponse/loginApiSlice';
import { selectedPropertyByUser } from '../../redux/apiResponse/propertySlice';
import Loader from '../Loader';
import StatCard from '../customStyles/StatCard';
import BarChart from './Charts/BarChart';
import LineChart from './Charts/LineChart';
import PieChart from './Charts/PieChart';
import RadialBarChart from './Charts/RadialBarChart';
import { fetchDataList, fetchCountListHour, fetchLast7Count } from '../../redux/apiResponse/countingSlice';
import { fetchDeviceStatistics } from '../../redux/apiResponse/deviceSlice';
import { fetchVehicleData } from '../../redux/apiResponse/alertSlice';

const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL

const commonStyles = {
  fontFamily: "montserrat-regular",
};
const Overview = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertData, setAlertData] = useState([]);
  const [alertsInfo, setAlertsInfo] = useState([]);
  const seleProp = useSelector(selectedPropertyByUser);
  const propertyId = seleProp?.id;
  const { dataList, countListHour, last7Count } = useSelector((state) => state.counting);
  const StatData = useSelector((state) => state.Device.StatData);
  const vehicleData = useSelector((state) => state.Alert.vecAlert);

  const moment = require('moment');
  const today = moment();
  const startTime = today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = today.format('YYYY-MM-DD');
  const startDate = startTime;
  const endDate = endTime;



  const [lastUpdated, setLastUpdated] = useState(moment().format('HH:mm'));

  const handleRefresh = () => {
    setLastUpdated(moment().format('HH:mm'));
  };

  //counting Api
  useEffect(() => {
    if (propertyId && token) {
      dispatch(fetchDataList({ propertyId, startDate: startTime, endDate: endTime, token }));
      // dispatch(fetchCountListHour({ propertyId, startonlytime, endonlytime, token }));
      // dispatch(fetchLast7Count({ propertyId, start7thTime, end7thTime, token }));
      dispatch(fetchDeviceStatistics(propertyId));
      dispatch(fetchVehicleData({propertyId, startDate, endDate }));
    }
  }, [propertyId, token, dispatch, startTime, endTime,startDate, endDate ]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/vec_alert`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            property_id: seleProp?.id, 
          },
        });
        setAlertData(response.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


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
      name: "Pedestrain Alerts",
      data: alertsInfo
    },
    {
      name: "Vehicle Alerts",
      data: [0, 1, 5, 3, 2, 7]
    }
  ];

  //Camera Status
  let totalseries;
  const onlineSeries = StatData?.data?.reduce((total, rowData) => total + (rowData?.online_num ?? 0), 0);
  const offlineSeries = StatData?.data?.reduce((total, rowData) => total + (rowData?.offline_num ?? 0), 0);
  totalseries = onlineSeries + offlineSeries; // Calculate totalseries
  const onlinePercentage = ((onlineSeries / totalseries) * 100).toFixed(2);
  const offlinePercentage = ((offlineSeries / totalseries) * 100).toFixed(2);

  // Calculate the total people_enter for the current date
  const currentDate = endDate;
  const formattedDate = currentDate;
  const filteredData = dataList.filter(item => item.date_time.slice(0, 10) === formattedDate);
  const filteredVehicleData = vehicleData[0]?.list?.filter(item => item.date_time.slice(0, 10) === formattedDate);

  const totalPeopleEnterToday = filteredData.reduce((acc, item) => acc + item.people_enter, 0);
  const peopleOccupancyToday = filteredData.reduce((acc, item) => acc + item.people_occupancy, 0);
  const vehicleEnterToday = filteredData.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const vehicleOccupancyToday = filteredData.reduce((acc, item) => acc + item.vechicle_occupancy, 0);

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

  const todayVehiclealerts = filteredVehicleData?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);
  const totalVehiclealerts = vehicleFilteredDataStartDate?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);

  // Differences
  const handlePercentageError = (value) => {
    return !isNaN(value) && isFinite(value) ? value : 0;
  };
  const percentagePeopleEnter = handlePercentageError((((totalPeopleEnterToday - totalPeopleEnter) / totalPeopleEnter) * 100).toFixed(2));
  const percentagePeopleOccupancy = handlePercentageError((((peopleOccupancyToday - peopleOccupancy) / peopleOccupancy) * 100).toFixed(2));
  const percentageVehicleEnter = handlePercentageError((((vehicleEnterToday - vehicleEnter) / vehicleEnter) * 100).toFixed(2));
  const percentageVehicleOccupancy = handlePercentageError((((vehicleOccupancyToday - vehicleOccupancy) / vehicleOccupancy) * 100).toFixed(2));

  let percentageVehicleAlerts;
  if (totalVehiclealerts !== 0 && !isNaN(totalVehiclealerts)) {
    percentageVehicleAlerts = (((todayVehiclealerts - totalVehiclealerts) / totalVehiclealerts) * 100).toFixed(2);
  } else {
    // Handle the case where totalVehiclealerts is zero or undefined
    percentageVehicleAlerts = 0; // Or any other appropriate value or message
  }

  const personSeries = [
    {
      name: 'Occupancy Today',
      data: [10, 20, 30, 40, 50],
    },
    {
      name: 'Occupancy Last Week',
      data: [5, 15, 25, 35, 45],
    },
  ];

  const vehicleSeries = [
    {
      name: 'Occupancy Today',
      data: [10, 20, 30, 40, 50],
    },
    {
      name: 'Occupancy Last Week',
      data: [5, 15, 25, 35, 45],
    },
  ];

  const cardData = [
    {
      background: 'linear-gradient(to left, #A486F2, #736FEE)',
      icon: `${PublicUrl}/assets/icons/PeopleTotalEntries.svg`,
      title: ' Enter Count',
      mainValue: totalPeopleEnterToday,
      subValue: totalPeopleEnter,
      percentage: percentagePeopleEnter,
    },
    {
      background: 'linear-gradient(to right,#612D69, #AC7AB6)',
      icon: PublicUrl + "/assets/icons/PeopleTotalEntries.svg",
      title: " Occupancy",
      mainValue: peopleOccupancyToday,
      subValue: peopleOccupancy,
      percentage: percentagePeopleOccupancy,
    },
    {
      background: "linear-gradient(to right,#02B2EC, #93D9FF)",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Enter Count",
      mainValue: vehicleEnterToday,
      subValue: vehicleEnter,
      percentage: percentageVehicleEnter,
    },
    {
      background: "linear-gradient(to left,#6ADBE0, #6EA7D2)",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: " Occupancy",
      mainValue: vehicleOccupancyToday,
      subValue: vehicleOccupancy,
      percentage: percentageVehicleOccupancy,
    },
    {
      background: "linear-gradient(to right,#EE7570, #F2A884)",
      icon: PublicUrl + "/assets/icons/alert.svg",
      title: " Total Alerts",
      mainValue: todayVehiclealerts,
      subValue: totalVehiclealerts,
      percentage: percentageVehicleAlerts,
    },
  ];

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Loader loading={loading} />
        </Box>
      ) : (
        <Box style={{ padding: "0px !important", marginTop: "10px" }} >
          {/* cards */}
          <Box mt={1} >
            <Box display="flex" flexWrap="wrap" justifyContent="space-between">
              {cardData.map((card, index) => (
                <Box key={index} width={{ xs: '100%', sm: '48%', md: '19%' }} mb={2}>
                  <StatCard {...card} commonStyles={commonStyles} />
                </Box>
              ))}
            </Box>
          </Box>
          {/* Charts */}
          <Box style={{ display: 'flex', flexDirection: 'row', width: '100%' }} my={2.5} gap={2}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={4}>
                <LineChart series={AlertsSeries} title="Alerts Raised" colors={["#000"]} />
              </Grid>
              <Grid item xs={12} md={4}>
                {StatData?.data?.map?.((rowData, index) => (
                  <div key={index}>
                    <PieChart
                      series={[rowData?.offline_num ?? 0, rowData?.online_num ?? 0, rowData?.no_paired_num ?? 0]}
                      labels={['No. Offline', 'No. Online', 'No. not paired']}
                      title="Camera Paired"
                      colors={['#7771EF', '#EE7570', '#716F96']}
                    />
                  </div>
                ))}
              </Grid>
              <Grid item xs={12} md={4}>
                <RadialBarChart
                  series={[onlinePercentage, offlinePercentage]}
                  labels={['Online', 'Offline']}
                  title="Camera Status"
                  colors={['#1BBAFD', '#FF5733']}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BarChart
                  series={personSeries}
                  title="People Entrance by Zones"
                  labels={["zone1", "zone2", "zone3", "zone4", "zone5"]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BarChart
                  series={vehicleSeries}
                  title="Vehicle Entrance by Zones"
                  labels={["zone1", "zone2", "zone3", "zone4", "zone5"]}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </>
  )
}

export default Overview;
