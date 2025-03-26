import React from 'react';
import ApexCharts from 'react-apexcharts';
import { Box } from '@mui/material';
import moment from 'moment';

const IncidentChart = ({ series, title,startDate, endDate, selectedRange, responseDates, customDates, isCustomRangeSelected }) => {
const today = moment();
  const startTime = startDate || today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = endDate || today.format('YYYY-MM-DD');

  let dateRange = [];
  if (isCustomRangeSelected && customDates === "month") {
    // If a custom range is selected and it's by month, use responseDates
    dateRange = responseDates?.map(date => moment(date, "YYYY-MM").format("MMM")) || [];
  } else {
    // Default logic based on selectedRange
    if (selectedRange === 'D' && !isCustomRangeSelected) {
      for (let hour = 0; hour < 24; hour++) {
        dateRange.push(moment({ hour }).format("HH:mm")); // "00:00", "01:00", ..., "23:00"
      }
    } else if (selectedRange === 'D' && isCustomRangeSelected) {
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
        dateRange.push(date.format('MMM-DD')); // "Jul-01", "Jul-02"
      }
    } else if (selectedRange === 'W' || selectedRange === 'M') {
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
        dateRange.push(date.format('MMM-DD')); // "Jul-01", "Jul-02"
      }
    } else if (selectedRange === 'Y' && !isCustomRangeSelected) {
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'month')) {
        dateRange.push(date.format('MMM')); // "Jul", "Aug"
      }
    }else if (selectedRange === 'Y' && isCustomRangeSelected) {
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
        dateRange.push(date.format('MMM-DD')); // "Jul", "Aug"
      }}
  }

  const chartOptions = {
    series:series,
    colors: ["#46c8f5"],
    chart: {
      type: 'line',
      height: "90%",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: []
        },
        autoSelected: 'zoom'
      }
    },
    stroke: {
      curve: 'stepline',
      width: 2
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: title,
      style: {
        color: '#003A6F',
        fontWeight: 'normal'
      }
    },
    markers: {
      hover: {
        sizeOffset: 4
      }
    },
    xaxis: {
      categories: dateRange
    }
  };

  return (
    <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
      <ApexCharts options={chartOptions} series={chartOptions.series} type="line" height={350} />
    </Box>
  );
};

export default IncidentChart;
