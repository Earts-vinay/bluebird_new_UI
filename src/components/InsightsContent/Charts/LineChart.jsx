import { Box, Grid } from '@mui/material';
import moment from 'moment';
import React from 'react';
import ApexCharts from 'react-apexcharts';

const LineChart = ({ series, title, labels, linechartcolors, markercolors, startDate, endDate, selectedRange,min,max,stepSize }) => {
  console.log("type",selectedRange);


  const today = moment();
  const startTime = startDate || today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = endDate || today.format('YYYY-MM-DD');

  let dateRange = [];

  if (selectedRange === 'D') {
      // Generate hourly data points for 24 hours
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
        dateRange.push(date.format('MMM-DD')); // "Jul-01", "Jul-02", etc.
    }
  } else if (selectedRange === 'W' || selectedRange === 'M') {
      // Generate daily data points
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
          dateRange.push(date.format('MMM-DD')); // "Jul-01", "Jul-02", etc.
      }
  } else if (selectedRange === 'Y') {
      // Generate monthly data points
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'month')) {
        dateRange.push(date.format('MMM YY')); // "Jul-01", "Jul-02", etc.
    }
  }
  
  const lineChartOptions = {
    labels: [labels],
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round'
    },
    colors: linechartcolors,
    title: {
      text: title,
      style: {
        color: '#003A6F',
        fontWeight: 'normal',
      }
    },
    markers: {
      size: 5,
      colors: markercolors,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7,
      }
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      },
      column: {
        colors: ['transparent', 'transparent']
      }
    },
    xaxis: {
      categories: dateRange,
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 400,
          colors: '#666'
        },
        rotate: -45,
        offsetY: 0,
        offsetX: 0
      }
    },
    yaxis: {
      min: 0, // Ensure starting from zero
      forceNiceScale: true, // Ensures proper scaling
      labels: {
        style: { fontSize: "12px", colors: "#666" },
        formatter: (value) => Math.round(value) // Ensures whole numbers only
      }
    },
    annotations: {
      xaxis: [
        {
          x: '100%',
          y: '100%',
          borderColor: '#ccc',
          offsetY: -40,
          text: 'D|M|Y',
          textAnchor: 'end',
          borderWidth: 1,
          borderRadius: 5,
        }
      ]
    }
  };
 
  return (
    <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
      <ApexCharts options={lineChartOptions} series={series} type="line" height={350} />
    </Box>
  )
}

export default LineChart