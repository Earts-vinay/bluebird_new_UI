import React from 'react';
import ApexCharts from 'react-apexcharts';
import { Box } from '@mui/material';

const PieChart = ({ series, labels, title, colors }) => {
  const chartOptions = {
    series: series,
    chart: {
      type: 'pie',
      height: 350,
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
    labels: labels,
    colors: colors,
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
      offsetY: 8,
      itemMargin: {
        horizontal: 10,
        vertical: 10
      },
      formatter: function (val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    style: {
      '.apexcharts-legend-text': {
        'padding-left': '20px',
        'margin-left': '-20px'
      }
    }
  };

  return (
    <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
      <ApexCharts options={chartOptions} series={series} type="pie" height={400} />
    </Box>
  );
};

export default PieChart;
