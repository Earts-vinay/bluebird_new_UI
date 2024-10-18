import React from 'react';
import ApexCharts from 'react-apexcharts';
import { Box } from '@mui/material';

const RadialBarChart = ({ series, labels, title, colors }) => {
  const chartOptions = {
    series: series,
    chart: {
      height: 350,
      type: 'radialBar',
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
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: "65%"
        },
        track: {
          background: '#f2f2f2',
          strokeWidth: '50%'
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '22px',
            fontWeight: 600,
            offsetY: -10
          },
          value: {
            show: true,
            fontSize: '16px',
            fontWeight: 400,
            offsetY: 16,
            color: '#666',
          }
        }
      }
    },
    colors: colors,
    labels: labels,
    title: {
      text: title,
      style: {
        color: '#003A6F',
        fontWeight: 'normal',
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      markers: {
        size: 10,
        strokeWidth: 0
      }
    }
  };

  return (
    <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
      <ApexCharts options={chartOptions} series={series} type="radialBar" height={400} />
    </Box>
  );
};

export default RadialBarChart;
