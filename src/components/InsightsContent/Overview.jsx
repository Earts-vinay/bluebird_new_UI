import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../redux/apiResponse/loginApiSlice';
import { selectedPropertyByUser } from '../../redux/apiResponse/propertySlice';
import Loader from '../Loader';
import StatCard from '../customStyles/StatCard';
import BarChart from './Charts/BarChart';
import LineChart from './Charts/LineChart';
import PieChart from './Charts/PieChart';
import RadialBarChart from './Charts/RadialBarChart';
import { fetchDataList, fetchCountListHour, fetchLast7Count, fetchDataYearList } from '../../redux/apiResponse/countingSlice';
import { fetchCountingByProperty, fetchCountingByZone } from '../../redux/apiResponse/insightSlice';
import { fetchDeviceStatistics } from '../../redux/apiResponse/deviceSlice';
import { fetchPersonData, fetchVehicleData, fetchVehicleDataCards } from '../../redux/apiResponse/alertSlice';
import HorizontalBarChart from './Charts/HorizontalBarChart';
import dayjs from 'dayjs';

const PublicUrl = process.env.PUBLIC_URL

const commonStyles = {
  fontFamily: "montserrat-regular",
};
const Overview = ({ dateRange, isCustomRangeSelected, selectedRange,customDates }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [alertsInfo, setAlertsInfo] = useState([]);
  const [personalertsInfo, setPersonAlertsInfo] = useState([]);
  const seleProp = useSelector(selectedPropertyByUser);
  const propertyId = seleProp?.id;
  const { dataList, dataYearList, loading, countListHour, last7Count } = useSelector((state) => state.counting);
  const { zonecount } = useSelector((state) => state.Insight);
  const StatData = useSelector((state) => state.Device.StatData);
  const vehicleData = useSelector((state) => state.Alert.vecAlert);
  const vecAlertsCards = useSelector((state) => state.Alert.vecAlertsCards);
  const personAlertsData = useSelector((state) => state.Alert.personAlerts);

  const moment = require('moment');
  const storedStartDate = localStorage.getItem('startDate');
  const storedEndDate = localStorage.getItem('endDate');
  const startTime = dateRange.startDate
  const endTime = dateRange.endDate
  const startDate = startTime;
  const endDate = endTime;
  const responseDates = vehicleData?.flatMap((zone) =>
    zone.list?.map((item) => item.date_time) || []
  );
  console.log("vehicle",vehicleData);
  

  const type = selectedRange === "D"
    ? "date"
    : selectedRange === "W"
      ? "date"
      : selectedRange === "M"
        ? "date"
        : selectedRange === "Y"
          ? "month"
          : "date";

          const alerttype = isCustomRangeSelected
          ? dayjs(dateRange.endDate).diff(dayjs(dateRange.startDate), "days") >= 30
            ? "month"
            : "date"
          : selectedRange === "Y"
            ? "month"
            : "date";

            console.log();
            

  const YearType = selectedRange === "D"
    ? "date"
    : selectedRange === "W"
      ? "date"
      : selectedRange === "M"
        ? "date"
        : selectedRange === "Y"
          ? "date"
          : "month";

  // Calculate the difference in days only if a custom range is selected
  const dayDifference = isCustomRangeSelected
    ? moment(endTime).diff(moment(startTime), "days")
    : null;

  // Define the `daysago` message
  const daysago = isCustomRangeSelected
    ? `${dayDifference} days ago`
    : selectedRange === "D"
      ? "A day ago"
      : selectedRange === "W"
        ? "Last Week"
        : selectedRange === "M"
          ? "Last Month"
          : selectedRange === "Y"
            ? "Last Year"
            : "week";

    
  //counting Api
  useEffect(() => {
    if (propertyId && token) {
      dispatch(fetchDataList({ propertyId, startDate: startTime, endDate: endTime, token, timeType: type }));
      dispatch(fetchDataYearList({ propertyId, startDate: startTime, endDate: endTime, token, timeType: YearType }));

      // dispatch(fetchCountListHour({ propertyId, startonlytime, endonlytime, token }));
      // dispatch(fetchLast7Count({ propertyId, start7thTime, end7thTime, token }));
      dispatch(fetchDeviceStatistics(propertyId));
      dispatch(fetchVehicleData({ propertyId, startDate, endDate, type: alerttype, typeId: "1" }));
      dispatch(fetchVehicleDataCards({ propertyId, startDate, endDate, type: YearType, typeId: "1" }));
      dispatch(fetchPersonData({ propertyId, startDate, endDate, type: alerttype, typeId: "0" }));

      dispatch(fetchCountingByZone({ propertyId, startDate: startTime, endDate: endTime, token }));
    }
  }, [propertyId, token, dispatch, startTime, endTime, startDate, endDate]);


  useEffect(() => {
    const alerts = []
    vehicleData[0]?.list?.forEach(item => {
      alerts?.push(item.resolved_alert_num + item.unresolved_alert_num);
    });
    setAlertsInfo(alerts);
  }, [vehicleData]);

  useEffect(() => {
    const personalerts = []
    personAlertsData[0]?.list?.forEach(item => {
      personalerts?.push(item.resolved_alert_num + item.unresolved_alert_num);
    });
    setPersonAlertsInfo(personalerts);
  }, [personAlertsData]);


  // Alerts line chart
  const AlertsSeries = [
    {
      name: " Person Alerts",
      data: personalertsInfo
    },
    {
      name: "Vehicle Alerts",
      data: alertsInfo
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
  const filteredData = dataYearList?.filter(item => item.date_time.slice(0, 10) === formattedDate);
  const filteredVehicleData = vecAlertsCards[0]?.list?.filter(item => item.date_time.slice(0, 10) === formattedDate);

  const totalPeopleEnterToday = filteredData.reduce((acc, item) => acc + item.people_enter, 0);
  const peopleOccupancyToday = filteredData.reduce((acc, item) => acc + item.people_occupancy_peak, 0);
  const vehicleEnterToday = filteredData.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const vehicleOccupancyToday = filteredData.reduce((acc, item) => acc + item.vechicle_occupancy_peak, 0);

  const filteredDataStartDate = dataYearList?.filter(item => {
    const itemDate = moment(item.date_time, 'YYYY-MM-DD');
    return itemDate.isSame(startDate, 'day');
  });

  const vehicleFilteredDataStartDate = vecAlertsCards[0]?.list?.filter(item => {
    const itemDate = moment(item.date_time, 'YYYY-MM-DD');
    return itemDate.isSame(startDate, 'day');
  });

  // Calculate totals for the start date (7 days ago)
  const totalPeopleEnter = filteredDataStartDate.reduce((acc, item) => acc + item.people_enter, 0);
  const peopleOccupancy = filteredDataStartDate.reduce((acc, item) => acc + item.people_occupancy_peak, 0);
  const vehicleEnter = filteredDataStartDate.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const vehicleOccupancy = filteredDataStartDate.reduce((acc, item) => acc + item.vechicle_occupancy_peak, 0);

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
    percentageVehicleAlerts = 0; 
  }

  //formats
  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"; // Convert to Millions
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"; // Convert to Thousands
    return num?.toString(); // Keep as is if less than 1K
  };

  // Applying formatting to your totals
  const totalPeopleEnterTodayFormatted = formatNumber(totalPeopleEnterToday);
  const peopleOccupancyTodayFormatted = formatNumber(peopleOccupancyToday);
  const vehicleEnterTodayFormatted = formatNumber(vehicleEnterToday);
  const vehicleOccupancyTodayFormatted = formatNumber(vehicleOccupancyToday);

  const totalPeopleEnterFormatted = formatNumber(totalPeopleEnter);
  const peopleOccupancyFormatted = formatNumber(peopleOccupancy);
  const vehicleEnterFormatted = formatNumber(vehicleEnter);
  const vehicleOccupancyFormatted = formatNumber(vehicleOccupancy);

  const zoneNames = zonecount?.map((zone) => zone.name);

  const personSeries = [
    {
      name: `Enter ${daysago}`,
      data: zonecount?.map((zone) => zone.list?.[0]?.people_enter || 0), // First available day
    },
    {
      name: 'Enter Today',
      data: zonecount?.map((zone) => zone.list?.[zone.list.length - 1]?.people_enter || 0), // Latest available day
    },
  ];

  const vehicleSeries = [
    {
      name: `Enter ${daysago}`,
      data: zonecount?.map((zone) => zone.list?.[0]?.vechicle_enter || 0), // First available day
    },
    {
      name: 'Enter Today',
      data: zonecount?.map((zone) => zone.list?.[zone.list.length - 1]?.vechicle_enter || 0), // Latest available day
    },
  ];


  //gender data
  const totalGenderData = dataList?.reduce(
    (acc, item) => {
      acc.male += item.gender_dist?.male;
      acc.female += item.gender_dist?.female;
      return acc;
    },
    { male: 0, female: 0 }
  );
  const genderSeries = [totalGenderData?.male, totalGenderData?.female];

  const aggregatedAgeData = dataList?.reduce(
    (acc, day) => {
      acc.less_20 += day.age_dist.less_20;
      acc["20_40"] += day.age_dist["20_40"];
      acc["40_60"] += day.age_dist["40_60"];
      acc.more_60 += day.age_dist.more_60;
      return acc;
    },
    { less_20: 0, "20_40": 0, "40_60": 0, more_60: 0 }
  );

  // Prepare the data for the chart
  const categories = ["Less than 20", "20-40", "40-60", "More than 60"];
  const seriesData = [
    aggregatedAgeData?.less_20,
    aggregatedAgeData["20_40"],
    aggregatedAgeData["40_60"],
    aggregatedAgeData?.more_60,
  ];

  //card data
  const cardData = [
    {
      background: 'linear-gradient(302deg, #01669a 100%, #1b3664 2%)',
      icon: `${PublicUrl}/assets/icons/PeopleTotalEntries.svg`,
      title: ' Enter Count',
      mainValue: totalPeopleEnterTodayFormatted,
      subValue: totalPeopleEnterFormatted,
      percentage: percentagePeopleEnter,
      daysago: daysago
    },
    {
      background: 'linear-gradient(120deg, #01669a 3%, #52a1cc)',
      icon: PublicUrl + "/assets/icons/PeopleTotalEntries.svg",
      title: "Peak Occupancy",
      mainValue: peopleOccupancyTodayFormatted,
      subValue: peopleOccupancyFormatted,
      percentage: percentagePeopleOccupancy,
      daysago: daysago
    },
    {
      background: " linear-gradient(120deg, #52a1cc 3%, #abd9f4)",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Enter Count",
      mainValue: vehicleEnterTodayFormatted,
      subValue: vehicleEnterFormatted,
      percentage: percentageVehicleEnter,
      daysago: daysago
    },
    {
      background: "linear-gradient(120deg, #46c8f5 40%, #abd9f4)",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Peak Occupancy",
      mainValue: vehicleOccupancyTodayFormatted,
      subValue: vehicleOccupancyFormatted,
      percentage: percentageVehicleOccupancy,
      daysago: daysago
    },
    {
      background: "linear-gradient(121deg, #ee7570, #f2a884)",
      icon: PublicUrl + "/assets/icons/alert.svg",
      title: " Total Alerts",
      mainValue: todayVehiclealerts,
      subValue: totalVehiclealerts,
      percentage: percentageVehicleAlerts,
      daysago: daysago
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
              <Grid item xs={12} md={8}>
                <LineChart series={AlertsSeries} title="Alerts Raised" linechartcolors={['#ef7b73', '#46C8F5']} markercolors={['#ef7b73', '#46C8F5']} startDate={startTime} endDate={endTime} selectedRange={selectedRange} responseDates={responseDates} customDates={customDates}/>
              </Grid>
              <Grid item xs={12} md={4}>
                <RadialBarChart
                  series={[onlinePercentage, offlinePercentage]}
                  labels={['Online', 'Offline']}
                  title="Camera Status"
                  colors={['#1BBAFD', '#FF5733']}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <HorizontalBarChart
                  title={"Age Distribution"}
                  seriesData={seriesData}
                  categories={categories}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <PieChart
                  series={genderSeries}
                  labels={['Male', 'Female',]}
                  title="Gender Distribution"
                  colors={['#01669a', '#ef7b73']}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BarChart
                  series={personSeries}
                  title="People Entrance by Zones"
                  labels={zoneNames}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BarChart
                  series={vehicleSeries}
                  title="Vehicle Entrance by Zones"
                  labels={zoneNames}
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
