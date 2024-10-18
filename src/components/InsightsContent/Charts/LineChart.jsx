import { Box, Grid } from '@mui/material';
import moment from 'moment';
import React from 'react';
import ApexCharts from 'react-apexcharts';

const LineChart = ({ series, title, labels,colors }) => {
    const today = moment();
    const startTime = today.clone().subtract(7, 'days').format('YYYY-MM-DD');
    const endTime = today.format('YYYY-MM-DD');
    const lineChartOptions = {
        labels:[labels],
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
        colors: ['#BBA1F7',"#1BBAFD"],
        title: {
          text:  title,
          style: {
            color: '#003A6F',
            fontWeight: 'normal',
          }
        },
        markers: {
          size: 5,
          colors: ['#BBA1F7',"#1BBAFD"],
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
          categories: [],
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
          labels: {
            style: {
              fontSize: '14px',
              fontWeight: 400,
              colors: '#666'
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
      const dateRange = [];
      for (let date = moment(startTime); date <= moment(endTime); date.add(1, 'days')) {
        dateRange.push(date.format('ddd')); // Use 'ddd' format for days of the week (e.g., Mon, Tue, etc.)
      }
      lineChartOptions.xaxis.categories = dateRange;
  return (
    <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
    <ApexCharts options={lineChartOptions} series={series} type="line" height={350} />
    </Box>
  )
}

export default LineChart