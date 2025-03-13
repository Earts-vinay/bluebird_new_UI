import { Box } from '@mui/material';
import React from 'react';
import ApexCharts from 'react-apexcharts';

const DonutChart = ({ series, title, labels, size, donutcolors, markercolors, customDataLabels }) => {
  console.log("customDataLabels", customDataLabels);
  
  const donutChartOptions = {
    chart: {
      type: 'donut',
      height: "400px",
      width: "100%",
      toolbar: { show: false },
    },
    colors: donutcolors,
    labels: labels,
    title: {
      text: title,
      style: { color: '#003A6F', fontWeight: 'normal' },
    },
    plotOptions: {
      pie: {
        donut: {
          size: size,
        },
      }
    },
    dataLabels: {
      enabled: true,
      customDataLabels
    },
    tooltip: {
      y: {
        formatter: function (_, { seriesIndex }) {
          return customDataLabels && customDataLabels[seriesIndex] !== undefined 
            ? `${customDataLabels[seriesIndex]}` 
            : "N/A"; 
        }
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      fontWeight: 400,
      labels: { colors: '#666' },
      markers: { fillColors: markercolors },
      itemMargin: { vertical: 5 },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' },
      }
    }]
  };

  return (
    <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
      <ApexCharts options={donutChartOptions} series={series} type="donut" height={400} />
    </Box>
  );
};

export default DonutChart;
