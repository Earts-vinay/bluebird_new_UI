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
import { fetchDataList, fetchCountListHour, fetchLast7Count, fetchDataYearList, countingPreviousList } from '../../redux/apiResponse/countingSlice';
import { fetchCountingByProperty, fetchCountingByZone, PreviousCountingByZone } from '../../redux/apiResponse/insightSlice';
import { fetchDeviceStatistics } from '../../redux/apiResponse/deviceSlice';
import { fetchPersonData, fetchVehicleData, fetchVehicleDataCards, latestTotalAlerts, previousTotalAlerts } from '../../redux/apiResponse/alertSlice';
import HorizontalBarChart from './Charts/HorizontalBarChart';
import dayjs from 'dayjs';

const PublicUrl = process.env.PUBLIC_URL

const commonStyles = {
  fontFamily: "montserrat-regular",
};
const Overview = ({ dateRange, isCustomRangeSelected, selectedRange, customDates }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [alertsInfo, setAlertsInfo] = useState([]);
  const [personalertsInfo, setPersonAlertsInfo] = useState([]);
  const seleProp = useSelector(selectedPropertyByUser);
  const propertyId = seleProp?.id;
  const { dataList, dataYearList, loading, previousDataList, countListHour, last7Count } = useSelector((state) => state.counting);
  const { zonecount, previousZoneCount } = useSelector((state) => state.Insight);
  const StatData = useSelector((state) => state.Device.StatData);
  const vehicleData = useSelector((state) => state.Alert.vecAlert);
  const latestTotalALert = useSelector((state) => state.Alert.latestTotalAlerts);
  const previousTotalAlert = useSelector((state) => state.Alert.previousTotalAlerts);
  // const vecAlertsCards = useSelector((state) => state.Alert.vecAlertsCards);
  const personAlertsData = useSelector((state) => state.Alert.personAlerts);

  const moment = require('moment');
  const today = moment().format("YYYY-MM-DD");
  const storedStartDate = localStorage.getItem('startDate');
  const storedEndDate = localStorage.getItem('endDate');
  const startTime = dateRange.startDate
  const endTime = dateRange.endDate
  const startDate = startTime;
  const endDate = endTime;
  const previousStartDate = dateRange.previousStartDate
  const previousEndDate = dateRange.previousEndDate
  const latestStartDate = dateRange.latestStartDate
  const latestEndDate = dateRange.latestEndDate
  const vehicleStartDate = today;
  const vehicleEndDate = today;
  const responseDates = vehicleData?.flatMap((zone) =>
    zone.list?.map((item) => item.date_time) || []
  );

  console.log("zones Dates", dataYearList);

  const type = selectedRange === "D"
    ? "date"
    : selectedRange === "W"
      ? "date"
      : selectedRange === "M"
        ? "date"
        : selectedRange === "Y"
          ? "month"
          : "date";

  const diffDays = dayjs(dateRange.latestEndDate).diff(dayjs(dateRange.latestStartDate), "days");

  const alerttype = isCustomRangeSelected
    ? diffDays === 0 // If only one day is selected, pass "hour"
      ? "hour"
      : diffDays >= 1 && diffDays < 30 // If more than 1 day but less than 30 days, pass "date"
        ? "date"
        : "month" // If 30 or more days are selected, pass "month"
    : selectedRange === "D"
      ? "hour"
      : selectedRange === "Y"
        ? "month"
        : customDates
          ? "date"
          : "date";



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
    ? "Last Period"
    : selectedRange === "D"
      ? "Yesterday"
      : selectedRange === "W"
        ? "Last Week"
        : selectedRange === "M"
          ? "Last Month"
          : selectedRange === "Y"
            ? "Last Year"
            : "week";
              // Define the `daysago` message
  const latestDays = isCustomRangeSelected
  ? "Current Period"
  : selectedRange === "D"
    ? "Today"
    : selectedRange === "W"
      ? "This Week"
      : selectedRange === "M"
        ? "This Month"
        : selectedRange === "Y"
          ? "This Year"
          : "week";


  //counting Api
  useEffect(() => {
    if (propertyId && token) {
      // dispatch(fetchDataList({ propertyId, startDate: latestStartDate, endDate: latestEndDate, token, timeType: type }));
      dispatch(fetchDataYearList({ propertyId, startDate: latestStartDate, endDate: latestEndDate, token, timeType: YearType }));
      dispatch(countingPreviousList({ propertyId, startDate: previousStartDate, endDate: previousEndDate, token, timeType: YearType }));

      // dispatch(fetchCountListHour({ propertyId, startonlytime, endonlytime, token }));
      // dispatch(fetchLast7Count({ propertyId, start7thTime, end7thTime, token }));
      dispatch(fetchDeviceStatistics(propertyId));
      dispatch(fetchVehicleData({
        propertyId,
        startDate: selectedRange === "D" && !isCustomRangeSelected ? vehicleStartDate : latestStartDate,
        endDate: selectedRange === "D" && !isCustomRangeSelected ? vehicleEndDate : latestEndDate,
        type: alerttype,
        typeId: "1"
      }));
      dispatch(fetchPersonData({
        propertyId,
        startDate: selectedRange === "D" && !isCustomRangeSelected ? vehicleStartDate : latestStartDate,
        endDate: selectedRange === "D" && !isCustomRangeSelected ? vehicleEndDate : latestEndDate,
        type: alerttype,
        typeId: "0"
      }));
      // dispatch(fetchVehicleDataCards({ propertyId, startDate: latestStartDate, endDate: latestEndDate, type: YearType, typeId: "1" }));
      dispatch(latestTotalAlerts({ propertyId, startDate: latestStartDate, endDate: latestEndDate, type: YearType, }));
      dispatch(previousTotalAlerts({ propertyId, startDate: previousStartDate, endDate: previousEndDate, type: YearType, }));

      dispatch(fetchCountingByZone({ propertyId, startDate: latestStartDate, endDate: latestEndDate, token }));
      dispatch(PreviousCountingByZone({ propertyId, startDate: previousStartDate, endDate: previousEndDate, token }));

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

  const onlineSeries = StatData?.data?.[0]?.online_num;
  const offlineSeries = StatData?.data?.[0]?.offline_num;

  totalseries = onlineSeries + offlineSeries; // Calculate totalseries
  const onlinePercentage = ((onlineSeries / totalseries) * 100).toFixed(2);
  const offlinePercentage = ((offlineSeries / totalseries) * 100).toFixed(2);

   //latest max people & Vehicle calculations
   const maxPeoplePeakItem = dataYearList?.reduce((maxItem, currentItem) =>
    currentItem.people_enter_peak > (maxItem?.people_enter_peak || 0) ? currentItem : maxItem, null
  );
  const maxPeoplePeakOccupancy = dataYearList?.reduce((maxItem, currentItem) =>
    currentItem.people_occupancy_peak > (maxItem?.people_occupancy_peak || 0) ? currentItem : maxItem, null
  );
  const maxVehiclePeakItem = dataYearList?.reduce((maxItem, currentItem) =>
    currentItem.vechicle_enter_peak > (maxItem?.vechicle_enter_peak || 0) ? currentItem : maxItem, null
  );
  const maxVehiclePeakOccupancy = dataYearList?.reduce((maxItem, currentItem) =>
    currentItem.vechicle_occupancy_peak > (maxItem?.vechicle_occupancy_peak || 0) ? currentItem : maxItem, null
  );

  // card vaules at upper part latest dates
  const latestPeopleEnter = dataYearList?.reduce((acc, item) => acc + item.people_enter, 0);
  const latestPeoplePeakEnter = Math.max(...(dataYearList?.map(item => item.people_enter_peak) || []));
  const latestPeoplePeakTime = maxPeoplePeakItem?.people_enter_peaktime?.split(" ")[1];
  const latestPeoplePeakDate = maxPeoplePeakItem?.people_enter_peaktime?.split(" ")[0];

  const latestVehicleEnter = dataYearList?.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const latestVehicleOccupancy = Math.max(...(dataYearList?.map(item => item.vechicle_occupancy_peak) || []));
  const latestVehiclePeakOccupancyTime = maxVehiclePeakOccupancy?.vechicle_occupancy_peak_time?.split(" ")[1];
  const latestVehiclePeakOccupancyDate = maxVehiclePeakOccupancy?.vechicle_occupancy_peak_time?.split(" ")[0];


    //previous max people & Vehicle calculations
    const previousMaxPeoplePeakItem = previousDataList?.reduce((maxItem, currentItem) =>
      currentItem.people_enter_peak > (maxItem?.people_enter_peak || 0) ? currentItem : maxItem, null
    );
    const previousPeoplePeakOccupancy = previousDataList?.reduce((maxItem, currentItem) =>
      currentItem.people_occupancy_peak > (maxItem?.people_occupancy_peak || 0) ? currentItem : maxItem, null
    );
    const previousMaxVehiclePeakItem = previousDataList?.reduce((maxItem, currentItem) =>
      currentItem.vechicle_enter_peak > (maxItem?.vechicle_enter_peak || 0) ? currentItem : maxItem, null
    );
    const previousMaxVehiclePeakOccupancy = previousDataList?.reduce((maxItem, currentItem) =>
      currentItem.vechicle_occupancy_peak > (maxItem?.vechicle_occupancy_peak || 0) ? currentItem : maxItem, null
    );

  // card vaules at lower part previous dates
  const previousPeopleEnter = previousDataList?.reduce((acc, item) => acc + item.people_enter, 0);
  const previousPeoplePeakEnter = Math.max(...(previousDataList?.map(item => item.people_enter_peak) || []))
  const previousPeoplePeakTime = previousMaxPeoplePeakItem?.people_enter_peaktime?.split(" ")[1];
  const previousPeoplePeakDate = previousMaxPeoplePeakItem?.people_enter_peaktime?.split(" ")[0];

  const previousVehicleEnter = previousDataList?.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const previousVehicleOccupancy = Math.max(...(previousDataList?.map(item => item.vechicle_occupancy_peak) || []));
  const previousVehiclePeakOccupancyTime = previousMaxVehiclePeakOccupancy?.vechicle_occupancy_peak_time?.split(" ")[1];
  const previousVehiclePeakOccupancyDate = previousMaxVehiclePeakOccupancy?.vechicle_occupancy_peak_time?.split(" ")[0];

  //total alerts card latest and previous
  const todayVehiclealerts = latestTotalALert[0]?.list?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);
  const totalVehiclealerts = previousTotalAlert[0]?.list?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);


  // percentages for cards 
  const handlePercentageError = (value) => {
    return !isNaN(value) && isFinite(value) ? value : 0;
  };
  const percentagePeopleEnter = handlePercentageError((((latestPeopleEnter - previousPeopleEnter) / previousPeopleEnter) * 100).toFixed(2));
  const percentagePeoplePeakEnter = handlePercentageError((((latestPeoplePeakEnter - previousPeoplePeakEnter) / previousPeoplePeakEnter) * 100).toFixed(2));
  const percentageVehicleEnter = handlePercentageError((((latestVehicleEnter - previousVehicleEnter) / previousVehicleEnter) * 100).toFixed(2));
  const percentageVehicleOccupancy = handlePercentageError((((latestVehicleOccupancy - previousVehicleOccupancy) / previousVehicleOccupancy) * 100).toFixed(2));

  // percentage for alerts card
  let percentageVehicleAlerts;
  if (totalVehiclealerts !== 0 && !isNaN(totalVehiclealerts)) {
    percentageVehicleAlerts = (((todayVehiclealerts - totalVehiclealerts) / totalVehiclealerts) * 100).toFixed(2);
  } else {
    percentageVehicleAlerts = 0;
  }

  //formats
  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num?.toString();
  };

  // Applying formatting to your totals
  const latestPeopleEnterFormatted = formatNumber(latestPeopleEnter);
  const latestPeoplePeakEnterFormatted = formatNumber(latestPeoplePeakEnter);
  const latestVehicleEnterFormatted = formatNumber(latestVehicleEnter);
  const latestVehicleOccupancyFormatted = formatNumber(latestVehicleOccupancy);

  const previousPeopleEnterFormatted = formatNumber(previousPeopleEnter);
  const previousPeoplePeakEnterFormatted = formatNumber(previousPeoplePeakEnter);
  const previousVehicleEnterFormatted = formatNumber(previousVehicleEnter);
  const vehicleOccupancyFormatted = formatNumber(previousVehicleOccupancy);

  const zoneNames = zonecount?.map((zone) => zone.name);
  //zones related data 


  const personSeries = [
    {
      name: `Enter ${daysago}`,
      data: previousZoneCount?.map((zone) =>
        zone.list?.reduce((sum, day) => sum + (day.people_enter || 0), 0)
      ) || []
    },
    {
      name: `Enter ${latestDays}`,
      data: zonecount?.map((zone) =>
        zone.list?.reduce((sum, day) => sum + (day.people_enter || 0), 0)
      ) || []
    },
  ];

  const vehicleSeries = [
    {
      name: `Enter ${daysago}`,
      data: previousZoneCount?.map((zone) =>
        zone.list?.reduce((sum, day) => sum + (day.vechicle_enter || 0), 0)
      ) || []
    },
    {
      name: `Enter ${latestDays}`,
      data: zonecount?.map((zone) =>
        zone.list?.reduce((sum, day) => sum + (day.vechicle_enter || 0), 0)
      ) || []
    },
  ];


  //gender data
  const totalGenderData = dataYearList?.reduce(
    (acc, item) => {
      acc.male += item.gender_dist?.male;
      acc.female += item.gender_dist?.female;
      return acc;
    },
    { male: 0, female: 0 }
  );
  const genderSeries = [totalGenderData?.male, totalGenderData?.female];

  const aggregatedAgeData = dataYearList?.reduce(
    (acc, day) => {
      if (day?.age_dist) {
        acc.less_20 = Math.round(acc.less_20 + (day.age_dist.less_20 || 0));
        acc["20_40"] = Math.round(acc["20_40"] + (day.age_dist["20_40"] || 0));
        acc["40_60"] = Math.round(acc["40_60"] + (day.age_dist["40_60"] || 0));
        acc.more_60 = Math.round(acc.more_60 + (day.age_dist.more_60 || 0));
      }
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
      mainValue: latestPeopleEnterFormatted,
      subValue: previousPeopleEnterFormatted,
      percentage: percentagePeopleEnter,
      daysago: daysago
    },
    {
      background: 'linear-gradient(120deg, #01669a 3%, #52a1cc)',
      icon: PublicUrl + "/assets/icons/PeopleTotalEntries.svg",
      title: "Peak Entries",
      mainValue: latestPeoplePeakEnterFormatted,
      subValue: previousPeoplePeakEnterFormatted,
      percentage: percentagePeoplePeakEnter,
      peakTime: latestPeoplePeakTime,
      peakDate:latestPeoplePeakDate,
      previousPeakTime:previousPeoplePeakTime,
      previousPeakDate:previousPeoplePeakDate,
      daysago: daysago
    },
    {
      background: " linear-gradient(120deg, #52a1cc 3%, #abd9f4)",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Enter Count",
      mainValue: latestVehicleEnterFormatted,
      subValue: previousVehicleEnterFormatted,
      percentage: percentageVehicleEnter,
      daysago: daysago
    },
    {
      background: "linear-gradient(120deg, #46c8f5 40%, #abd9f4)",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Peak Occupancy",
      mainValue: latestVehicleOccupancyFormatted,
      subValue: vehicleOccupancyFormatted,
      percentage: percentageVehicleOccupancy,
      peakTime: latestVehiclePeakOccupancyTime,
      peakDate: latestVehiclePeakOccupancyDate,

      previousPeakTime:previousVehiclePeakOccupancyTime,
      previousPeakDate:previousVehiclePeakOccupancyDate,
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
                <Box key={index} width={{ xs: '100%', sm: '48%', md: '19.5%' }} mb={2}>
                  <StatCard {...card} commonStyles={commonStyles} />
                </Box>
              ))}
            </Box>
          </Box>
          {/* Charts */}
          <Box style={{ display: 'flex', flexDirection: 'row', width: '100%' }} my={2.5} gap={2}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={8}>
                <LineChart series={AlertsSeries} title="Alerts Raised" linechartcolors={['#ef7b73', '#46C8F5']} markercolors={['#ef7b73', '#46C8F5']} startDate={latestStartDate} endDate={latestEndDate} selectedRange={selectedRange} responseDates={responseDates} customDates={customDates} isCustomRangeSelected={isCustomRangeSelected} diffDays={diffDays}/>
              </Grid>
              <Grid item xs={12} md={4}>
                <RadialBarChart
                  series={[onlineSeries, offlineSeries]}
                  labels={['Online', 'Offline']}
                  title="Device Status"
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
