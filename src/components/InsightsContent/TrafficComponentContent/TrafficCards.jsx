import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useSelector } from 'react-redux';
import StatCard from '../../customStyles/StatCard';
import Loader from '../../Loader';

const PublicUrl = process.env.PUBLIC_URL;
const commonStyles = { fontFamily: "montserrat-regular" };

const TrafficCards = ({ dateRange, selectedRange, isCustomRangeSelected }) => {
  const startTime = dateRange.latestStartDate
  const endTime = dateRange.latestEndDate

  const { dataList, dataYearList, loading, previousDataList, countListHour, last7Count } = useSelector((state) => state.counting);

  // The rest of your calculations and rendering logic goes here...
  const currentDate = endTime;
  const formattedDate = currentDate;
  const filteredData = dataYearList.filter(item => item.date_time.slice(0, 10) === formattedDate);
  //formats
  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"; // Convert to Millions
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"; // Convert to Thousands
    return num?.toString(); // Keep as is if less than 1K
  };

  //latest calculations
  const latestPeopleEnter = dataYearList?.reduce((acc, item) => acc + item.people_enter, 0);
  const latestPeoplePeakEnter = dataYearList?.reduce((acc, item) => acc + item.people_enter_peak, 0);
  const latestPeopleOccupancy = dataYearList?.reduce((acc, item) => acc + item.people_occupancy_peak, 0);
  const latestVehicleEnter = dataYearList?.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const latestVehiclePeakEnter = dataYearList?.reduce((acc, item) => acc + item.vechicle_enter_peak, 0);
  const latestVehicleOccupancy = dataYearList?.reduce((acc, item) => acc + item.vechicle_occupancy_peak, 0);

  const latestPeopleEnterFormatted = formatNumber(latestPeopleEnter);
  const latestPeoplePeakEnterFormatted = formatNumber(latestPeoplePeakEnter);
  const latestPeopleOccupancyFormatted = formatNumber(latestPeopleOccupancy);
  const latestVehicleEnterFormatted = formatNumber(latestVehicleEnter);
  const latestVehiclePeakEnterFormatted = formatNumber(latestVehiclePeakEnter);
  const latestVehicleOccupancyFormatted = formatNumber(latestVehicleOccupancy);


  // Previous claculations
  const previousPeopleEnter = previousDataList?.reduce((acc, item) => acc + item.people_enter, 0);
  const previousPeoplePeakEnter = previousDataList?.reduce((acc, item) => acc + item.people_enter_peak, 0);
  const previousPeopleOccupancy = previousDataList?.reduce((acc, item) => acc + item.people_occupancy_peak, 0);
  const previousVehicleEnter = previousDataList?.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const previousPeakvehicleEnter = previousDataList?.reduce((acc, item) => acc + item.vechicle_enter_peak, 0);
  const previousVehicleOccupancy = previousDataList?.reduce((acc, item) => acc + item.vechicle_occupancy_peak, 0);

  const previousPeopleEnterFormatted = formatNumber(previousPeopleEnter);
  const previousPeoplePeakEnterFormatted = formatNumber(previousPeoplePeakEnter);
  const previousPeopleOccupancyFormatted = formatNumber(previousPeopleOccupancy);
  const previousVehicleEnterFormatted = formatNumber(previousVehicleEnter);
  const previousPeakvehicleEnterFormatted = formatNumber(previousPeakvehicleEnter);
  const previousVehicleOccupancyFormatted = formatNumber(previousVehicleOccupancy);

  // Differences
  const handlePercentageError = (value) => {
    return !isNaN(value) && isFinite(value) ? value : 0;
  };
  const percentagePeopleEnter = handlePercentageError(((latestPeopleEnter - previousPeopleEnter) / previousPeopleEnter) * 100).toFixed(2);
  const percentagePeoplePeakEnter = handlePercentageError(((latestPeoplePeakEnter - previousPeoplePeakEnter) / previousPeoplePeakEnter) * 100).toFixed(2);
  const percentagePeopleOccupancy = handlePercentageError(((latestPeopleOccupancy - previousPeopleOccupancy) / previousPeopleOccupancy) * 100).toFixed(2);
  const percentageVehicleEnter = handlePercentageError(((latestVehicleEnter - previousVehicleEnter) / previousVehicleEnter) * 100).toFixed(2);
  const percentagePeakVehicleEnter = handlePercentageError(((latestVehiclePeakEnter - previousPeakvehicleEnter) / previousPeakvehicleEnter) * 100).toFixed(2);
  const percentageVehicleOccupancy = handlePercentageError(((latestVehicleOccupancy - previousVehicleOccupancy) / previousVehicleOccupancy) * 100).toFixed(2);

  //peak entries and occupance time
  const getCurrentTime = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

  const peakpopleentryTime = filteredData.reduce((acc, item) => {
    const time = item.people_enter_peaktime?.split(" ")[1] || getCurrentTime();
    return acc + time;
  }, "");

  const peakpopleOccupancyTime = filteredData.reduce((acc, item) => {
    const time = item.people_occupancy_peaktime?.split(" ")[1] || getCurrentTime();
    return acc + time;
  }, "");

  const peakVehicleEnterTime = filteredData.reduce((acc, item) => {
    const time = item.vechicle_enter_peaktime?.split(" ")[1] || getCurrentTime();
    return acc + time;
  }, "");

  const peakVehicleOccupancyTime = filteredData.reduce((acc, item) => {
    const time = item.vechicle_occupancy_peak_time?.split(" ")[1] || getCurrentTime();
    return acc + time;
  }, "");


  // Ratio calculation
  const latestRatio = latestVehicleEnter > 0 ? (latestPeopleEnter / latestVehicleEnter).toFixed(2) : '0';
  const previousRatio = previousVehicleEnter > 0 ? (previousPeopleEnter / previousVehicleEnter).toFixed(2) : '0';
  const ratiopercentage = handlePercentageError(((latestRatio - previousRatio) / previousRatio) * 100).toFixed(2);

  // Define the `daysago` message
  const daysago = isCustomRangeSelected
    ? "Last Period"
    : selectedRange === "D"
      ? "A day ago"
      : selectedRange === "W"
        ? "Last Week"
        : selectedRange === "M"
          ? "Last Month"
          : selectedRange === "Y"
            ? "Last Year"
            : "week";

  const cardData = [
    {
      background: "#1b3664",
      icon: PublicUrl + "/assets/icons/PeopleTotalEntries.svg",
      title: "Total Entries",
      mainValue: latestPeopleEnterFormatted,
      subValue: previousPeopleEnterFormatted,
      percentage: percentagePeopleEnter,
      daysago: daysago
    },
    {
      background: "#01669a",
      icon: PublicUrl + "/assets/icons/PersonPeakOccupancy.svg",
      title: "Peak Entries",
      mainValue: latestPeoplePeakEnterFormatted,
      subValue: previousPeoplePeakEnterFormatted,
      peakTime: peakpopleentryTime,
      percentage: percentagePeoplePeakEnter,
      daysago: daysago
    },
    {
      background: "#52a1cc",
      icon: PublicUrl + "/assets/icons/PersonPeakOccupancy.svg",
      title: "Peak Occupancy",
      mainValue: latestPeopleOccupancyFormatted,
      subValue: previousPeopleOccupancyFormatted,
      peakTime: peakpopleOccupancyTime,
      percentage: percentagePeopleOccupancy,
      daysago: daysago
    },
    {
      background: "#46c8f5",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Total Entries",
      mainValue: latestVehicleEnterFormatted,
      subValue: previousVehicleEnterFormatted,
      percentage: percentageVehicleEnter,
      daysago: daysago
    },
    {
      background: "#52a1cc",
      icon: PublicUrl + "/assets/icons/VehiclePeakEntries.svg",
      title: "Peak Entries",
      mainValue: latestVehiclePeakEnterFormatted,
      subValue: previousPeakvehicleEnterFormatted,
      peakTime: peakVehicleEnterTime,
      percentage: percentagePeakVehicleEnter,
      daysago: daysago
    },
    {
      background: "#abd9f4",
      icon: PublicUrl + "/assets/icons/VehiclePeakOccupancy.svg",
      title: "Peak Occupancy",
      mainValue: latestVehicleOccupancyFormatted,
      subValue: previousVehicleOccupancyFormatted,
      peakTime: peakVehicleOccupancyTime,
      percentage: percentageVehicleOccupancy,
      daysago: daysago
    },
  ];

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Loader loading={loading} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Box sx={{ width: { xs: '100%', sm: '100%', md: '79%' } }}>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between">
              {cardData.map((card, index) => (
                <Box key={index} width={{ xs: '100%', sm: '48%', md: '32%' }} mb={2}>
                  <StatCard {...card} commonStyles={commonStyles} />
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '100%', md: '19%' } }}>
            <Box
              sx={{
                width: { xs: '100%', sm: '100%', md: '100%' },
                mb: 2,
              }}
            >
              <Card
                sx={{
                  borderRadius: '10px',
                  background: "#ef7b73",
                  boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)",
                  backdropFilter: "blur(20px)",
                  opacity: "0.9",
                  border: '1px solid white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <CardContent sx={{ height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Typography variant="subtitle2" color="white" sx={{ fontSize: '14px', mb: "20px", ...commonStyles }}>
                        Pedestrain by <br /> Vechile Ratio
                      </Typography>
                      <Typography variant="h1" color="white" style={{ fontSize: '50px', ...commonStyles }}>
                        {latestRatio}
                      </Typography>

                    </div>
                    <div>
                      <img src={PublicUrl + "/assets/icons/Ratio.svg"} width="30px" style={{ fill: "white" }} alt="" />
                    </div>
                  </div>
                </CardContent>
                <CardContent sx={{ height: '50%', paddingX: '15px', paddingTop: "10px", paddingBottom: "15px !important", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ paddingTop: "65px" }}>
                      <Typography variant="h3" color="white" style={{ fontSize: '40px', ...commonStyles }}>
                        {previousRatio}
                      </Typography>
                      <Typography variant="subtitle2" color="white" sx={commonStyles}>
                        {daysago}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="white" style={{ textAlign: "right", paddingTop: "65px", fontSize: "20px", ...commonStyles }}>
                        {ratiopercentage}%
                      </Typography>
                      <Typography variant="subtitle2" color="white" sx={commonStyles}>
                        Difference
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}
export default TrafficCards