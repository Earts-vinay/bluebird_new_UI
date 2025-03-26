import React from 'react';
import ApexCharts from 'react-apexcharts';
import { Box } from '@mui/material';
import moment from 'moment';

const IncidentChart = ({ series, title,startDate, endDate, selectedRange }) => {
const today = moment();
  const startTime = startDate || today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = endDate || today.format('YYYY-MM-DD');

  let dateRange = [];

  if (selectedRange === 'D') {
      // Generate hourly data points for 24 hours
      for (let i = 0; i < 24; i++) {
          dateRange.push(`${i}:00`); // "0:00", "1:00", ..., "23:00"
      }
  } else if (selectedRange === 'W' || selectedRange === 'M') {
      // Generate daily data points
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
          dateRange.push(date.format('MMM-DD')); // "Jul-01", "Jul-02", etc.
      }
  } else if (selectedRange === 'Y') {
      // Generate monthly data points
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'month')) {
        dateRange.push(date.format('MMM ')); // "Jul-01", "Jul-02", etc.
    }
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
