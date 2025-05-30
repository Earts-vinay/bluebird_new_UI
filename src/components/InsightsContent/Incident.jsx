import React, { useEffect, useState } from 'react';
import { Box, Grid, } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../redux/apiResponse/loginApiSlice';
import { selectedPropertyByUser } from '../../redux/apiResponse/propertySlice';
import StatCard from '../customStyles/StatCard';
import DonutChart from './Charts/DonutChart';
import IncidentChart from './Charts/IncidentChart';
import HeatmapChart from './Charts/HeatmapChart';
import { fetchDataList, fetchCountListHour, fetchLast7Count } from '../../redux/apiResponse/countingSlice';
import { fetchPersonData, fetchPersonDataCards, fetchVehicleData, fetchVehicleDataCards, fetchZoneAlert, latestTotalAlerts, previousTotalAlerts } from '../../redux/apiResponse/alertSlice';
import Loader from '../Loader';
import { fetchHeatmapData } from '../../redux/apiResponse/heatmapSlice';
import dayjs from 'dayjs';
import LineChart from './Charts/LineChart';

const PublicUrl = process.env.PUBLIC_URL;
const commonStyles = { fontFamily: "montserrat-regular" };
const Incident = ({ dateRange, isCustomRangeSelected, selectedRange, customDates }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [zones, setZones] = useState([]);
  const [percents, setPercents] = useState([]);
  const [dataLables, setDataLables] = useState([]);
  const [alertsInfo, setAlertsInfo] = useState([]);
  const seleProp = useSelector(selectedPropertyByUser);
  const moment = require('moment');
  const today = moment();
  const vehicletoday = moment().format("YYYY-MM-DD");
  const startonlytime = today.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const endonlytime = today.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const propertyId = seleProp?.id;
  const zoneId = zones;
  const vehicleStartDate = vehicletoday;
  const vehicleEndDate = vehicletoday;
  const previousStartDate = dateRange.previousStartDate
  const previousEndDate = dateRange.previousEndDate
  const latestStartDate = dateRange.latestStartDate
  const latestEndDate = dateRange.latestEndDate
  const vehicleData = useSelector((state) => state.Alert.vecAlert);
  const latestVecALert = useSelector((state) => state.Alert.latestTotalAlerts);
  const previousVecAlert = useSelector((state) => state.Alert.previousTotalAlerts);
  const personAlertsCards = useSelector((state) => state.Alert.personAlertsCards);
  const personAlerts = useSelector((state) => state.Alert.personAlerts);
  const { heatmapSeries, loading, error } = useSelector(state => state.heatmap);
  const zoneAlert = useSelector((state) => state.Alert.zoneAlert);
  const responseDates = vehicleData?.flatMap((zone) =>
    zone.list?.map((item) => item.date_time) || []
  );

  const YearType = selectedRange === "D"
    ? "date"
    : selectedRange === "W"
      ? "date"
      : selectedRange === "M"
        ? "date"
        : selectedRange === "Y"
          ? "date"
          : "month";

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

  //counting Api
  useEffect(() => {
    if (propertyId && token) {
      // dispatch(fetchDataList({ propertyId, startDate: startDate, endDate: endDate, token }));
      dispatch(fetchCountListHour({ propertyId, startonlytime, endonlytime, token }));
      // dispatch(fetchLast7Count({ propertyId, start7thTime, end7thTime, token }));
      dispatch(fetchVehicleData({
        propertyId,
        startDate: selectedRange === "D" && !isCustomRangeSelected ? vehicleStartDate : latestStartDate,
        endDate: selectedRange === "D" && !isCustomRangeSelected ? vehicleEndDate : latestEndDate,
        type: alerttype,

      }));

      dispatch(latestTotalAlerts({ propertyId, startDate: latestStartDate, endDate: latestEndDate, type: YearType, typeId: "1" }));
      dispatch(previousTotalAlerts({ propertyId, startDate: previousStartDate, endDate: previousEndDate, type: YearType, typeId: "1" }));

      dispatch(fetchPersonDataCards({ propertyId, startDate: latestStartDate, endDate: latestEndDate, type: YearType, typeId: "0" }));
      dispatch(fetchPersonData({ propertyId, startDate: previousStartDate, endDate: previousEndDate, type: YearType, typeId: "0" }));
      dispatch(fetchZoneAlert({ propertyId, zoneId, startDate: latestStartDate, endDate: latestEndDate }));
      dispatch(fetchHeatmapData({ token, propertyId, startDate: latestStartDate, endDate: latestEndDate }));
    }
  }, [propertyId, token]);

  useEffect(() => {
    const alerts = []
    vehicleData[0]?.list?.forEach(item => {
      alerts.push(item.resolved_alert_num + item.unresolved_alert_num);
    });
    setAlertsInfo(alerts);
  }, [vehicleData]);

  const AlertsSeries = [
    {
      name: "Alerts",
      data: alertsInfo
    }
  ];

  useEffect(() => {
    let total = 0;
    let Zones = [];
    let Percents = [];
    let count = [];
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
    a.forEach((item, ind) => {
      Zones.push(item.id);
      const dataLable = item.alertsPerZone
      count.push(dataLable);
    })
    setZones(Zones);
    setPercents(Percents)
    setDataLables(count)
  }, [zoneAlert])

  const zoneNames = zoneAlert.map(zone => zone.name);


  // latest alerts
  const latestVehiclealerts = latestVecALert[0]?.list?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);
  const latestPersonalerts = personAlertsCards[0]?.list?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);


  // Previous alerts
  const previousVehiclealerts = previousVecAlert[0]?.list?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);
  const previousPersonalerts = personAlerts[0]?.list?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);

  // Difference for vechiles and person alerts
  let percentageVehicleAlerts;
  if (previousVehiclealerts > 0) {
    percentageVehicleAlerts = (((latestVehiclealerts - previousVehiclealerts) / previousVehiclealerts) * 100).toFixed(2);
  } else {
    percentageVehicleAlerts = 0;
  }

  let percentagePersonAlerts;
  if (previousPersonalerts > 0) {
    percentagePersonAlerts = (((latestPersonalerts - previousPersonalerts) / previousPersonalerts) * 100).toFixed(2);
  } else {
    percentagePersonAlerts = 0;
  }

  const cardData = [
    {
      background: 'linear-gradient(121deg, #01669a 100%, #1b3664 2%)',
      icon: `${PublicUrl}/assets/icons/PeopleTotalEntries.svg`,
      title: 'Pedestrain Alerts',
      mainValue: latestPersonalerts,
      subValue: previousPersonalerts,
      percentage: percentagePersonAlerts,
      daysago: daysago
    },
    {
      background: "linear-gradient(120deg, #52a1cc 3%, #93d9ff)",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Vehicle Alerts",
      mainValue: latestVehiclealerts,
      subValue: previousVehiclealerts,
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
            <Grid item xs={12} md={4}>
              <DonutChart series={percents} title="Alerts By Zone" labels={zoneNames} size="90%" customDataLabels={dataLables} donutcolors={['#01669a', '#46c8f5', '#52a1cc']} markercolors={['#01669a', '#46c8f5', '#52a1cc']} />
            </Grid>
            <Grid item xs={12} md={8}>
              {/* <IncidentChart series={AlertsSeries} title="Incidents Detected" startDate={startDate} endDate={endDate} selectedRange={selectedRange} responseDates={responseDates} customDates={customDates} isCustomRangeSelected={isCustomRangeSelected} /> */}
              <LineChart series={AlertsSeries} title="Alerts Raised" linechartcolors={['#ef7b73', '#46C8F5']} markercolors={['#ef7b73', '#46C8F5']} startDate={latestStartDate} endDate={latestEndDate} selectedRange={selectedRange} responseDates={responseDates} customDates={customDates} isCustomRangeSelected={isCustomRangeSelected} diffDays={diffDays} />
            </Grid>
          </Grid>
        </Box>)}
    </>
  )
};

export default Incident;
