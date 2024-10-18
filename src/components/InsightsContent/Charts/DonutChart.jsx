import { Box, Grid } from '@mui/material';
import React from 'react';
import ApexCharts from 'react-apexcharts';

const DonutChart = ({series, title, labels,size }) => {
    const donutChartOptions = {
        chart: {
          type: 'donut',
          height: "400px", // Adjust the height to make it smaller
          width: "100%", // Adjust the width to make it smaller
          toolbar: {
            show: false
          },
    
        },
        colors: ['#9442C8', '#E169F6', '#4472D9', '#ffd166', '#ef476f', '#06d6a0'],
        labels: labels,
        title: {
          text: title,
          style: {
            color: '#003A6F',
            fontWeight: 'normal'
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: size // Reduce the size of the donut chart
            },
            dataLabels: {
              enabled: true,
              formatter: function (val) {
                return Math.round(val) + '%'; // Round the value to the nearest integer and add the percentage sign
              }
            },
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return Math.round(val) + '%'; // Format tooltip values as rounded percentages
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
          labels: {
            colors: '#666',
          },
          markers: {
            fillColors: ['#BBA1F7', '#1BBAFD', '#FF5733', '#FFC300', '#7D3C98'],
          },
          itemMargin: {
            vertical: 5,
          },
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200 // Adjust the width for smaller screens
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };
    
  return (
    <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
    <ApexCharts options={donutChartOptions} series={series} type="donut" height={400} />
  </Box>
  )
}

export default DonutChart