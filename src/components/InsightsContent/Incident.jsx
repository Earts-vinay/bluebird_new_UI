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
import { fetchPersonData, fetchPersonDataCards, fetchVehicleData, fetchVehicleDataCards, fetchZoneAlert } from '../../redux/apiResponse/alertSlice';
import Loader from '../Loader';
import { fetchHeatmapData } from '../../redux/apiResponse/heatmapSlice';

const PublicUrl = process.env.PUBLIC_URL;
const commonStyles = { fontFamily: "montserrat-regular" };
const Incident = ({ dateRange,isCustomRangeSelected, selectedRange }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [zones, setZones] = useState([]);
  const [percents, setPercents] = useState([]);
  const [dataLables, setDataLables] = useState([]);
  const [alertsInfo, setAlertsInfo] = useState([]);
  const seleProp = useSelector(selectedPropertyByUser);
  const moment = require('moment');
  const today = moment();
  const startonlytime = today.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const endonlytime = today.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const propertyId = seleProp?.id;
  const zoneId = zones;
  const startDate = dateRange.startDate;
  const endDate = dateRange.endDate;
  const vehicleData = useSelector((state) => state.Alert.vecAlert);
  const vecAlertsCards = useSelector((state) => state.Alert.vecAlertsCards);
  const personAlertsCards = useSelector((state) => state.Alert.personAlertsCards);
  const { heatmapSeries, loading, error } = useSelector(state => state.heatmap);
  const zoneAlert = useSelector((state) => state.Alert.zoneAlert);

  const type = selectedRange === "D"
    ? "date"
    : selectedRange === "W"
      ? "date"
      : selectedRange === "M"
        ? "date"
        : "month";

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
    ? moment(endDate).diff(moment(startDate), "days")
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
      // dispatch(fetchDataList({ propertyId, startDate: startDate, endDate: endDate, token }));
      dispatch(fetchCountListHour({ propertyId, startonlytime, endonlytime, token }));
      // dispatch(fetchLast7Count({ propertyId, start7thTime, end7thTime, token }));
      dispatch(fetchVehicleData({ propertyId, startDate, endDate, type: type, typeId: "1" }));
      dispatch(fetchVehicleDataCards({ propertyId, startDate, endDate, type: YearType, typeId: "1" }));
      dispatch(fetchPersonDataCards({ propertyId, startDate, endDate, type: YearType, typeId: "0" }));
      dispatch(fetchZoneAlert({ propertyId, zoneId, startDate, endDate }));
      dispatch(fetchHeatmapData({ token, propertyId, startDate, endDate }));
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
  console.log("alertsinfo",AlertsSeries);
  

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

  // Calculate the total people_enter for the current date
  const currentDate = endDate;
  const formattedDate = currentDate;
  const filteredVehicleData = vecAlertsCards[0]?.list?.filter(item => item.date_time.slice(0, 10) === formattedDate);
  const filteredPersonAlertsData = personAlertsCards[0]?.list?.filter(item => item.date_time.slice(0, 10) === formattedDate);

  // alerts
  const todayVehiclealerts = filteredVehicleData?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);
  const todayPersonalerts = filteredPersonAlertsData?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);

  const vehicleFilteredDataStartDate = vecAlertsCards[0]?.list?.filter(item => {
    const itemDate = moment(item.date_time, 'YYYY-MM-DD');
    return itemDate.isSame(startDate, 'day');
  });

  const personFilteredDataStartDate = personAlertsCards[0]?.list?.filter(item => {
    const itemDate = moment(item.date_time, 'YYYY-MM-DD');
    return itemDate.isSame(startDate, 'day');
  });

  // Calculate totals for the start date (7 days ago)
  const last7Vehiclealerts = vehicleFilteredDataStartDate?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);
  const last7Personalerts = personFilteredDataStartDate?.reduce((acc, item) => acc + item.unresolved_alert_num + item.resolved_alert_num, 0);

  // Difference for vechiles and person alerts
  let percentageVehicleAlerts;
  if (last7Vehiclealerts > 0) {
    percentageVehicleAlerts = (((todayVehiclealerts - last7Vehiclealerts) / last7Vehiclealerts) * 100).toFixed(2);
  } else {
    percentageVehicleAlerts = 0;
  }

  let percentagePersonAlerts;
  if (last7Personalerts > 0) {
    percentagePersonAlerts = (((todayPersonalerts - last7Personalerts) / last7Personalerts) * 100).toFixed(2);
  } else {
    percentagePersonAlerts = 0;
  }

  const cardData = [
    {
      background: 'linear-gradient(121deg, #01669a 100%, #1b3664 2%)',
      icon: `${PublicUrl}/assets/icons/PeopleTotalEntries.svg`,
      title: 'Pedestrain Alerts',
      mainValue: todayPersonalerts,
      subValue: last7Personalerts,
      percentage: percentagePersonAlerts,
      daysago: daysago
    },
    {
      background: "linear-gradient(120deg, #52a1cc 3%, #93d9ff)",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Vehicle Alerts",
      mainValue: todayVehiclealerts,
      subValue: last7Vehiclealerts,
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
              <IncidentChart series={AlertsSeries} title="Incidents Detected" startDate={startDate} endDate={endDate} selectedRange={selectedRange} />
            </Grid>
          </Grid>
        </Box>)}
    </>
  )
};

export default Incident;
