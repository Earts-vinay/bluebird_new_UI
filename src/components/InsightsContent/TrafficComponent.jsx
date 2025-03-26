import React, { useState, useEffect } from 'react';
import { Box, Grid, } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../redux/apiResponse/loginApiSlice';
import { selectedPropertyByUser } from '../../redux/apiResponse/propertySlice';
import TrafficCards from './TrafficComponentContent/TrafficCards';
import BarChart from './Charts/BarChart';
import LineChart from './Charts/LineChart';
import { fetchDataList, fetchCountListHour, fetchLast7Count, fetchDataYearList } from '../../redux/apiResponse/countingSlice';
import { fetchZoneAlert } from '../../redux/apiResponse/alertSlice';
import { fetchCountingByProperty, fetchCountingByZone } from '../../redux/apiResponse/insightSlice';
import Loader from '../Loader';
import dayjs from 'dayjs';

const TrafficComponent = ({ dateRange, selectedRange, isCustomRangeSelected, customDates }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [zones, setZones] = useState([]);
  const [percents, setPercents] = useState([]);
  const [alertsByToday, setAlertsByToday] = useState([]);
  const [alertsByLastWeek, setAlertsByLastWeek] = useState([]);
  const seleProp = useSelector(selectedPropertyByUser);
  const moment = require('moment');
  const today = moment();
  const seventhDayAgo = today.clone().subtract(7, 'days');
  const start7thTime = seventhDayAgo.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const end7thTime = seventhDayAgo.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const startonlytime = today.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const endonlytime = today.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const propertyId = seleProp?.id;
  const zoneId = zones;
  const startDate = dateRange.startDate;
  const endDate = dateRange.endDate;
  const { dataList, dataYearList, countListHour, loading, last7Count } = useSelector((state) => state.counting);
  const zoneAlert = useSelector((state) => state.Alert.zoneAlert);
  const { zonecount } = useSelector((state) => state.Insight);

  const responseDates = dataList?.map((item) => item.date_time) || [];


  console.log("datalist", dataList, responseDates);

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

  const alerttype = isCustomRangeSelected
    ? dayjs(dateRange.endDate).diff(dayjs(dateRange.startDate), "days") >= 30
      ? "month"
      : "date"
    : selectedRange === "Y"
      ? "month"
      : "date";

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
      dispatch(fetchDataList({ propertyId, startDate: startDate, endDate: endDate, token, timeType: alerttype }));
      dispatch(fetchDataYearList({ propertyId, startDate: startDate, endDate: endDate, token, timeType: type }));
      dispatch(fetchCountListHour({ propertyId, startonlytime, endonlytime, token }));
      dispatch(fetchLast7Count({ propertyId, start7thTime, end7thTime, token }));
      dispatch(fetchZoneAlert({ propertyId, zoneId, startDate, endDate }));
      dispatch(fetchCountingByZone({ propertyId, startDate: startDate, endDate: endDate, token }));
    }
  }, [propertyId, token]);

  useEffect(() => {
    let total = 0;
    let Zones = [];
    let Percents = [];
    let alertsByToday = [];
    let alertsByLastWeek = [];
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
    zoneAlert.forEach((item) => {
      const lastweek = item?.list[0];
      const today = item?.list.slice(-1)[0];
      // const {resolved_alert_num,unresolved_alert_num}=lastweek;
      // const {resolved_alert_num,unresolved_alert_num}=today;
      alertsByLastWeek.push(lastweek?.resolved_alert_num + lastweek?.unresolved_alert_num);
      alertsByToday.push(today?.resolved_alert_num + today?.unresolved_alert_num);
    })

    a.forEach((item, ind) => {
      Zones.push(item.id);
      const percent = item.alertsPerZone === 0 ? 0 : (item.alertsPerZone / total) * 100;
      Percents.push(percent);
    })
    setZones(Zones);
    setPercents(Percents);
    setAlertsByToday(alertsByToday)
    setAlertsByLastWeek(alertsByLastWeek)


  }, [zoneAlert])
  const zoneNames = zoneAlert?.map(zone => zone.name)

  const zonesFilteredDataStartDate = zoneAlert[0]?.list?.filter(item => {
    const itemDate = moment(item.date_time, 'YYYY-MM-DD');
    return itemDate.isSame(startDate, 'day');
  });

  const Zonesalerts = zonesFilteredDataStartDate?.reduce((acc, item) => acc + item.resolved_alert_num + item.unresolved_alert_num, 0);
  const [personalertsInfo, setPersonAlertsInfo] = useState([]);

  //  useEffect(() => {
  //     const personalerts = []
  //     dataList[0]?.list?.forEach(item => {
  //       personalerts.push(item => item.people_enter);
  //     });
  //     setPersonAlertsInfo(personalerts);
  //   }, [dataList]);

  // People enter line chart
  const peopleEnterSeries = [{
    name: "People Enter",
    data: dataList?.map(item => item.people_enter)
  }];

  // People Occupancy line chart
  const peopleOccupancySeries = [
    {
      name: "People Occupancy",
      data: dataList?.map(item => item.people_occupancy)
    }];

  // Vehicle enter line chart
  const vehicleEnterSeries = [
    {
      name: "Vehicle Entry",
      data: dataList?.map(item => item.vechicle_enter)
    }];

  // Vehicle Occupancy Line Chart
  const vehicleOccupancySeries = [
    {
      name: "Vehicle Occupancy",
      data: dataList?.map(item => item.vechicle_occupancy)
    }
  ]

  // Person week avarages donut Chart
  const pedestrainWeekAverage = dataList?.slice(-7)?.map(day => day.people_enter || 0);
  const dayLabels = dataList?.slice(-7).map(day => moment(day.date_time).format('ddd')); // 'ddd' gives abbreviated day name

  // vehicle week averages donut chart
  const vehicleWeekAverage = dataList?.slice(-7)?.map(day => day.vechicle_enter || 0);

  // people by hour of a day
  const personSeriesByHour = [
    {
      name: 'Entry',
      data: countListHour?.map(hourData => hourData.people_enter || 0),
    },
    {
      name: 'Exit',
      data: countListHour?.map(hourData => hourData.people_exit || 0),
    },
  ];

  const barlabels = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00',
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00'];

  // vehicle by hour of a day
  const vehicleSeriesByHour = [
    {
      name: 'Entry',
      data: countListHour?.map(hourData => hourData.vechicle_enter || 0),
    },
    {
      name: 'Exit',
      data: countListHour?.map(hourData => hourData.vechicle_exit || 0),
    },
  ];

  // person entrance by Zones
  const zoneNamelable = zonecount?.map((zone) => zone.name);
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

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Loader loading={loading} />
        </Box>
      ) : (
        <Box style={{ padding: "0px !important", marginY: "10px" }}>
          <Box mt={1} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TrafficCards dateRange={dateRange} selectedRange={selectedRange} isCustomRangeSelected={isCustomRangeSelected} />
          </Box>
          <Box style={{ display: 'flex', flexDirection: 'row', width: '100%' }} mt={2.5} gap={2}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <LineChart series={peopleEnterSeries} title="Pedestrain Entry" linechartcolors={['#ef7b73']} markercolors={['#ef7b73']} startDate={startDate} endDate={endDate} selectedRange={selectedRange} responseDates={responseDates} customDates={customDates} isCustomRangeSelected={isCustomRangeSelected}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <LineChart series={peopleOccupancySeries} title="Pedestrain Peak Occupancy" linechartcolors={['#46c8f5']} markercolors={['#46c8f5']} startDate={startDate} endDate={endDate} selectedRange={selectedRange} responseDates={responseDates} customDates={customDates} isCustomRangeSelected={isCustomRangeSelected}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <LineChart series={vehicleEnterSeries} title="Vehicle Entry" linechartcolors={['#ef7b73']} markercolors={['#ef7b73']} startDate={startDate} endDate={endDate} selectedRange={selectedRange} responseDates={responseDates} customDates={customDates} isCustomRangeSelected={isCustomRangeSelected}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <LineChart series={vehicleOccupancySeries} title="Vehicle Peak Occupancy" linechartcolors={['#46c8f5']} markercolors={['#46c8f5']} startDate={startDate} endDate={endDate} selectedRange={selectedRange} responseDates={responseDates} customDates={customDates} isCustomRangeSelected={isCustomRangeSelected}/>
              </Grid>

              {/* <Grid item xs={12} md={4}>
            <DonutChart series={pedestrainWeekAverage} title="Pedestrain Entry By Day of week Averages" labels={dayLabels} size="40%" donutcolors={['#69499f','#1b3664','#01669a','#52a1cc','#46c8f5','#abd9f4','#ef7b73']} markercolors={['#69499f','#1b3664','#01669a','#52a1cc','#46c8f5','#abd9f4','#ef7b73']}/>
          </Grid> */}
              {/* <Grid item xs={12} md={8}>
            <BarChart
              series={personSeriesByHour}
              title="Pedestrain by Hour of a Day"
              labels={barlabels}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DonutChart series={vehicleWeekAverage} title="Vehicle Entry By Day of week Averages" labels={dayLabels}size="40%" donutcolors={['#69499f','#1b3664','#01669a','#52a1cc','#46c8f5','#abd9f4','#ef7b73']} markercolors={['#69499f','#1b3664','#01669a','#52a1cc','#46c8f5','#abd9f4','#ef7b73']}/>
          </Grid>
          <Grid item xs={12} md={8}>
            <BarChart
              series={vehicleSeriesByHour}
              title="Vehicle By Hour of a Day"
              labels={barlabels}
            />
          </Grid> */}
              <Grid item xs={12} md={6}>
                <BarChart
                  series={personSeries}
                  title="People Entrance by Zones"
                  labels={zoneNamelable}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BarChart
                  series={vehicleSeries}
                  title="Vehicle Entrance by Zones"
                  labels={zoneNamelable}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </>
  )
}
export default TrafficComponent;
