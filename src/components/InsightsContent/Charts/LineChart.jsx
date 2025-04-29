import { Box } from '@mui/material';
import moment from 'moment';
import React from 'react';
import ApexCharts from 'react-apexcharts';

const LineChart = ({ 
  series, 
  title, 
  labels, 
  linechartcolors, 
  diffDays, 
  markercolors, 
  startDate, 
  endDate, 
  selectedRange, 
  responseDates, 
  customDates, 
  isCustomRangeSelected 
}) => {
  console.log("daysdiff", selectedRange,diffDays,customDates,responseDates);

  const today = moment();
  const startTime = startDate || today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = endDate || today.format('YYYY-MM-DD');

  let dateRange = [];
  console.log("daterange",dateRange);
  if (isCustomRangeSelected ) {
    dateRange = responseDates?.map(date => moment(date, "YYYY-MM").format("MMM")) || [];
   
    
  } else if (isCustomRangeSelected && customDates === "month") {
    dateRange = responseDates?.map(date => moment(date, "YYYY-MM").format("MMM - DD")) || [];
   
    
  } else {
    if (selectedRange === 'D' && diffDays === 0 && !isCustomRangeSelected) {
      for (let hour = 0; hour < 24; hour++) {
        dateRange.push(moment({ hour }).format("HH:mm"));
      }
    } else if (selectedRange === 'D' && diffDays === 0 && isCustomRangeSelected) {
      for (let hour = 0; hour < 24; hour++) {
        dateRange.push(moment({ hour }).format("HH:mm"));
      }
    } else if (selectedRange === 'D' && isCustomRangeSelected) {
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
        dateRange.push(date.format('MMM-DD'));
      }
    } else if (selectedRange === 'W' || selectedRange === 'M') {
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
        dateRange.push(date.format('MMM-DD'));
      }
    } else if (selectedRange === 'Y' && !isCustomRangeSelected) {
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'month')) {
        dateRange.push(date.format('MMM'));
      }
    } else if (selectedRange === 'Y' && isCustomRangeSelected) {
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
        dateRange.push(date.format('MMM-DD'));
      }
    }
  }

  // ➡️ Calculate dynamic min and max values
  const allDataPoints = series.flatMap(s => s.data);
  const padding = 5;
  const dynamicMin = Math.max(0, Math.min(...allDataPoints) - padding);
  const dynamicMax = Math.max(...allDataPoints) + padding;

  const lineChartOptions = {
    labels: [labels],
    chart: {
      height: 350,
      type: 'line',
      zoom: { enabled: false },
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3, lineCap: 'round' },
    colors: linechartcolors,
    title: { text: title, style: { color: '#003A6F', fontWeight: 'normal' } },
    markers: {
      size: 5,
      colors: markercolors,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 7 }
    },
    grid: {
      row: { colors: ['transparent', 'transparent'], opacity: 0.5 },
      column: { colors: ['transparent', 'transparent'] }
    },
    xaxis: {
      categories: dateRange,
      labels: {
        style: { fontSize: '14px', fontWeight: 400, colors: '#666' },
        rotate: -45,
        offsetY: 0,
        offsetX: 0
      }
    },
    yaxis: {
      min: dynamicMin,
      max: dynamicMax,
      forceNiceScale: false,
      labels: {
        style: { fontSize: "12px", colors: "#666" },
        formatter: (value) => {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
          } else if (value >= 1000) {
            return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
          } else {
            return Math.round(value);
          }
        }
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
  );
};

export default LineChart;
