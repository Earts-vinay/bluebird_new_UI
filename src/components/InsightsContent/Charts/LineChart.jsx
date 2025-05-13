import { Box } from '@mui/material';
import moment from 'moment';
import React from 'react';
import ApexCharts from 'react-apexcharts';

const LineChart = ({
  series = [],
  title = '',
  labels = [],
  linechartcolors = ['#003A6F'],
  diffDays,
  markercolors = ['#003A6F'],
  startDate,
  endDate,
  selectedRange = 'W',
  responseDates = [],
  customDates,
  isCustomRangeSelected = false,
}) => {
  const today = moment();
  const startTime = startDate ? moment(startDate).format('YYYY-MM-DD') : today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = endDate ? moment(endDate).format('YYYY-MM-DD') : today.format('YYYY-MM-DD');

  let dateRange = [];

  const daysDifference = moment(endTime).diff(moment(startTime), 'days');

  if (isCustomRangeSelected) {
    if (customDates === 'month') {
      dateRange = responseDates?.map(date => moment(date, 'YYYY-MM').format('MMM-DD')) || [];
    } else if (daysDifference === 0) {
      for (let hour = 0; hour < 24; hour++) {
        dateRange.push(moment({ hour }).format('HH:mm'));
      }
    } else if (daysDifference <= 30) {
      dateRange = responseDates?.map(date => moment(date, 'YYYY-MM-DD').format('MMM-DD')) || [];
    } else {
      dateRange = responseDates?.map(date => moment(date, 'YYYY-MM-DD').format('MMM')) || [];
    }
  } else {
    if (selectedRange === 'D') {
      for (let hour = 0; hour < 24; hour++) {
        dateRange.push(moment({ hour }).format('HH:mm'));
      }
    } else if (selectedRange === 'W' || selectedRange === 'M') {
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'days')) {
        dateRange.push(date.format('MMM-DD'));
      }
    } else if (selectedRange === 'Y') {
      for (let date = moment(startTime); date.isSameOrBefore(endTime); date.add(1, 'month')) {
        dateRange.push(date.format('MMM'));
      }
    }
  }

  const allDataPoints = series.flatMap(s => s.data).filter(val => typeof val === 'number' && !isNaN(val));
  const padding = 5;
  const dynamicMin = allDataPoints.length > 0 ? Math.max(0, Math.min(...allDataPoints) - padding) : 0;
  const dynamicMax = allDataPoints.length > 0 ? Math.max(...allDataPoints) + padding : 10;

  const lineChartOptions = {
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
        dynamicAnimation: { enabled: true, speed: 350 },
      },
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
      hover: { size: 7 },
    },
    grid: {
      row: { colors: ['transparent', 'transparent'], opacity: 0.5 },
      column: { colors: ['transparent', 'transparent'] },
    },
    xaxis: {
      categories: dateRange.length > 0 ? dateRange : ['No Data'],
      labels: {
        style: { fontSize: '14px', fontWeight: 400, colors: '#666' },
        rotate: -45,
      },
    },
    yaxis: {
      min: dynamicMin,
      max: dynamicMax,
      forceNiceScale: true, // Let ApexCharts adjust the scale for better tick intervals
      tickAmount: 5, // Limit ticks to avoid overcrowding
      labels: {
        style: { fontSize: '12px', colors: '#666' },
        formatter: (value) => {
          if (value == null || isNaN(value)) return '0';
          if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
          if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
          return Math.round(value).toString(); // Display raw numbers for values < 1000
        },
      },
    },
    annotations: {
      xaxis: [
        {
          x: dateRange[dateRange.length - 1] || '',
          borderColor: '#ccc',
          label: {
            text: 'D|M|Y',
            style: { color: '#666', background: '#fff' },
            orientation: 'horizontal',
            offsetY: -40,
          },
        },
      ],
    },
  };

  return (
    <Box
      style={{
        backgroundColor: 'white',
        borderRadius: '5px',
        padding: '15px',
        boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
      }}
    >
      <ApexCharts
        options={lineChartOptions}
        series={series.length > 0 ? series : [{ name: 'No Data', data: [] }]}
        type="line"
        height={350}
      />
    </Box>
  );
};

export default LineChart;