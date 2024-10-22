import { Box, Grid } from '@mui/material';
import React from 'react';
import ApexCharts from 'react-apexcharts';


const BarChart = ({ series, title, labels }) => {
  const chartOptions = {
    colors: ['#46c8f5',"#01669a"],
    labels:[labels],
    chart: {
      type: 'bar',
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
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        horizontal: false,
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: labels,
    },
    yaxis: {},
    fill: {
      opacity: 1
    },
    tooltip: {},
    legend: {
      position: 'bottom',
      offsetY: 2,
      markers: {
        width: 12,
        height: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0
      },
      offsetY: 2,
    },
    title: {
      text: title,
      style: {
        color: '#003A6F',
        fontWeight: 'normal',
      }
    }
  };

  return (
      <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
        <ApexCharts options={chartOptions} series={series} type="bar" height={350} />
      </Box>
  );
};

export default BarChart;
