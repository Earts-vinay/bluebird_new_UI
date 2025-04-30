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
  const today = moment();
  const startTime = startDate || today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = endDate || today.format('YYYY-MM-DD');

  let dateRange = [];

  // Helper function to calculate days difference
  const daysDifference = moment(endTime).diff(moment(startTime), 'days');

  if (isCustomRangeSelected) {
    if (customDates === "month") {
      // Monthly custom range
      dateRange = responseDates?.map(date => moment(date, "YYYY-MM").format("MMM - DD")) || [];
    } else if (daysDifference === 0) {
      // Same day: show hours
      for (let hour = 0; hour < 24; hour++) {
        dateRange.push(moment({ hour }).format("HH:mm"));
      }
    } else if (daysDifference <= 30) {
      // Less than or equal to 1 month: show MMM-DD
      dateRange = responseDates?.map(date => moment(date, "YYYY-MM-DD").format("MMM-DD")) || [];
    } else {
      // More than 1 month: show MMM
      dateRange = responseDates?.map(date => moment(date, "YYYY-MM-DD").format("MMM")) || [];
    }
  } else {
    // Non-custom range logic
    if (selectedRange === 'D') {
      // Daily: show hours
      for (let hour = 0; hour < 24; hour++) {
        dateRange.push(moment({ hour }).format("HH:mm"));
      }
    } else if (selectedRange === 'W' || selectedRange === 'M') {
      // Weekly or Monthly: show MMM-DD
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
        dateRange.push(date.format('MMM-DD'));
      }
    } else if (selectedRange === 'Y') {
      // Yearly: show MMM
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'month')) {
        dateRange.push(date.format('MMM'));
      }
    }
  }

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
        rotate: -45
      }
    },
    yaxis: {
      min: dynamicMin,
      max: dynamicMax,
      forceNiceScale: false,
      labels: {
        style: { fontSize: "12px", colors: "#666" },
        formatter: (value) => {
          if (value >= 1000000) return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
          if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
          return Math.round(value);
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