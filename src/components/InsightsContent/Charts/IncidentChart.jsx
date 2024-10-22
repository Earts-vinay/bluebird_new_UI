import React from 'react';
import ApexCharts from 'react-apexcharts';
import { Box } from '@mui/material';
import moment from 'moment';

const IncidentChart = ({ series, title }) => {
  const generateCategories = () => {
    const categories = [];
    const today = moment();
    for (let i = 0; i <= 7; i++) {
      categories.push(today.clone().subtract(i, 'days').format('ddd')); // Use 'ddd' format for days of the week (e.g., Mon, Tue, etc.)
    }
    return categories.reverse(); // Reverse to get the order from last week to today
  };

  const chartOptions = {
    series: [{
      data: series
    }],
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
      categories: generateCategories()
    }
  };

  return (
    <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
      <ApexCharts options={chartOptions} series={chartOptions.series} type="line" height={350} />
    </Box>
  );
};

export default IncidentChart;
