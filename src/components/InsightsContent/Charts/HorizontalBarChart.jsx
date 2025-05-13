import { Box } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";

const HorizontalBarChart = ({seriesData,title,categories}) => {
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "80%",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toFixed(),
      style: {
        colors: ["#555"],
      },
      offsetX: -10
    },
    xaxis: {
      categories: categories,
      title: {
        // text: "Age Groups",
      },
    },
    yaxis: {
      title: {
        // text: "Number of People",
      },
    },
    tooltip: {
      enabled: true,
    },
    grid: {
      strokeDashArray: 4,
      borderColor: "#e7e7e7",
    },
    colors: ["#A78BFA"], // Light purple
    title: {
      text: title,
      align: "left",
      style: {
        color: "#003A6F",
        fontWeight: 'normal',
      },
    },
  };

  const chartSeries = [
    {
      name: "Count", // Can also be dynamic if needed
      data: seriesData,
    },
  ];

  return (
    <div id="chart">
          <Box style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px", boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)" }}>
          <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
          </Box>
     
    </div>
  );
};

export default HorizontalBarChart;
