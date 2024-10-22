import React from 'react';
import ApexCharts from 'react-apexcharts';
import { Box } from '@mui/material';

const HeatmapChart = ({ series }) => {
  const chartOptions = {
    series: series,
    chart: {
      height: "100%",
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#93d5ed","#45a5f5","#008FFB"],
    title: {
      text: 'Alerts HeatMap Chart',
      style: {
        color: '#003A6F',
        fontWeight: 'normal'
      }
    },
    xaxis: {
      categories: Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' + i : i}:00`)
    },
    yaxis: {
      categories: ['Metric1', 'Metric2', 'Metric3', 'Metric4', 'Metric5'],
      reversed: true
    }
  };

  return (
    <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
      <ApexCharts options={chartOptions} series={chartOptions.series} type="heatmap" height={280} />
    </Box>
  );
};

export default HeatmapChart;
