import React, { useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataList, fetchCountListHour, fetchLast7Count } from '../../../redux/apiResponse/countingSlice';
import { selectToken } from '../../../redux/apiResponse/loginApiSlice';
import { selectedPropertyByUser } from '../../../redux/apiResponse/propertySlice';
import StatCard from '../../customStyles/StatCard';
import moment from 'moment';
import Loader from '../../Loader';

const PublicUrl = process.env.PUBLIC_URL;
const commonStyles = { fontFamily: "montserrat-regular" };

const TrafficCards = ({ dateRange, selectedRange, isCustomRangeSelected }) => {
  const today = moment();
  const startTime = dateRange.startDate
  const endTime = dateRange.endDate
  const startonlytime = today.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const endonlytime = today.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const seventhDayAgo = today.clone().subtract(7, 'days');
  const start7thTime = seventhDayAgo.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const end7thTime = seventhDayAgo.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const seleProp = useSelector(selectedPropertyByUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const { dataList, dataYearList, loading, countListHour, last7Count } = useSelector((state) => state.counting);
  const propertyId = seleProp?.id;

  useEffect(() => {
    if (propertyId && token) {
      // dispatch(fetchDataList({ propertyId, startDate: startTime, endDate: endTime, token }));
      dispatch(fetchCountListHour({ propertyId, startonlytime, endonlytime, token }));
      dispatch(fetchLast7Count({ propertyId, start7thTime, end7thTime, token }));
    }
  }, [propertyId, token, dispatch, startTime, endTime, startonlytime, endonlytime, start7thTime, end7thTime]);

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

  // const filteredVehicleData = vehicleData[0]?.list?.filter(item => item.date_time.slice(0, 10) === formattedDate);
  // const filteredZonesData = zoneAlert[0]?.list?.filter(item => item.date_time?.slice(0, 10) === formattedDate);

  const totalPeopleEnterToday = filteredData.reduce((acc, item) => acc + item.people_enter, 0);
  const PeakPeopleEnterToday = filteredData.reduce((acc, item) => acc + item.people_enter_peak, 0);
  const peopleOccupancyToday = filteredData.reduce((acc, item) => acc + item.people_occupancy_peak, 0);
  const vehicleEnterToday = filteredData.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const PeakvehicleEnterToday = filteredData.reduce((acc, item) => acc + item.vechicle_enter_peak, 0);
  const vehicleOccupancyToday = filteredData.reduce((acc, item) => acc + item.vechicle_occupancy_peak, 0);

  const totalPeopleEnterTodayFormatted = formatNumber(totalPeopleEnterToday);
  const PeakPeopleEnterTodayFormatted = formatNumber(PeakPeopleEnterToday);
  const peopleOccupancyTodayFormatted = formatNumber(peopleOccupancyToday);
  const vehicleEnterTodayFormatted = formatNumber(vehicleEnterToday);
  const PeakvehicleEnterTodayFormatted = formatNumber(PeakvehicleEnterToday);
  const vehicleOccupancyTodayFormatted = formatNumber(vehicleOccupancyToday);


  const filteredDataStartDate = dataYearList?.filter(item => {
    const itemDate = moment(item.date_time, 'YYYY-MM-DD');
    return itemDate.isSame(startTime, 'day');
  });

  // Calculate totals for the start date (7 days ago)
  const totalPeopleEnter = filteredDataStartDate.reduce((acc, item) => acc + item.people_enter, 0);
  const PeakPeopleEnter = filteredDataStartDate.reduce((acc, item) => acc + item.people_enter_peak, 0);
  const peopleOccupancy = filteredDataStartDate.reduce((acc, item) => acc + item.people_occupancy_peak, 0);
  const vehicleEnter = filteredDataStartDate.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const PeakvehicleEnter = filteredDataStartDate.reduce((acc, item) => acc + item.vechicle_enter_peak, 0);
  const vehicleOccupancy = filteredDataStartDate.reduce((acc, item) => acc + item.vechicle_occupancy_peak, 0);

  const totalPeopleEnterFormatted = formatNumber(totalPeopleEnter);
  const PeakPeopleEnterFormatted = formatNumber(PeakPeopleEnter);
  const peopleOccupancyFormatted = formatNumber(peopleOccupancy);
  const vehicleEnterFormatted = formatNumber(vehicleEnter);
  const PeakvehicleEnterFormatted = formatNumber(PeakvehicleEnter);
  const vehicleOccupancyFormatted = formatNumber(vehicleOccupancy);

  // const Zonesalerts = zonesFilteredDataStartDate?.reduce((acc, item) => acc + item.resolved_alert_num + item.unresolved_alert_num, 0);

  // Differences
  const handlePercentageError = (value) => {
    return !isNaN(value) && isFinite(value) ? value : 0;
  };
  const percentagePeopleEnter = handlePercentageError(((totalPeopleEnterToday - totalPeopleEnter) / totalPeopleEnter) * 100).toFixed(2);
  const percentagePeakPeopleEnter = handlePercentageError(((PeakPeopleEnterToday - PeakPeopleEnter) / PeakPeopleEnter) * 100).toFixed(2);
  const percentagePeopleOccupancy = handlePercentageError(((peopleOccupancyToday - peopleOccupancy) / peopleOccupancy) * 100).toFixed(2);
  const percentageVehicleEnter = handlePercentageError(((vehicleEnterToday - vehicleEnter) / vehicleEnter) * 100).toFixed(2);
  const percentagePeakVehicleEnter = handlePercentageError(((PeakvehicleEnterToday - PeakvehicleEnter) / PeakvehicleEnter) * 100).toFixed(2);
  const percentageVehicleOccupancy = handlePercentageError(((vehicleOccupancyToday - vehicleOccupancy) / vehicleOccupancy) * 100).toFixed(2);

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
  const todayratio = vehicleEnterToday > 0 ? (totalPeopleEnterToday / vehicleEnterToday).toFixed(2) : '0';
  const sevendayratio = vehicleEnter > 0 ? (totalPeopleEnter / vehicleEnter).toFixed(2) : '0';
  const ratiopercentage = handlePercentageError(((todayratio - sevendayratio) / sevendayratio) * 100).toFixed(2);

  // Calculate the difference in days only if a custom range is selected
  const dayDifference = isCustomRangeSelected
    ? moment(endTime).diff(moment(startTime), "days")
    : null;

  // Define the `daysago` message
  const daysago = isCustomRangeSelected
    ? `${dayDifference} days ago`
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
      mainValue: totalPeopleEnterTodayFormatted,
      subValue: totalPeopleEnterFormatted,
      percentage: percentagePeopleEnter,
      daysago: daysago
    },
    {
      background: "#01669a",
      icon: PublicUrl + "/assets/icons/PersonPeak entries.svg",
      title: "Peak Entries",
      mainValue: PeakPeopleEnterTodayFormatted,
      subValue: PeakPeopleEnterFormatted,
      peakTime: peakpopleentryTime,
      percentage: percentagePeakPeopleEnter,
      daysago: daysago
    },
    {
      background: "#52a1cc",
      icon: PublicUrl + "/assets/icons/PersonPeakOccupancy.svg",
      title: "Peak Occupancy",
      mainValue: peopleOccupancyTodayFormatted,
      subValue: peopleOccupancyFormatted,
      peakTime: peakpopleOccupancyTime,
      percentage: percentagePeopleOccupancy,
      daysago: daysago
    },
    {
      background: "#46c8f5",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Total Entries",
      mainValue: vehicleEnterTodayFormatted,
      subValue: vehicleEnterFormatted,
      percentage: percentageVehicleEnter,
      daysago: daysago
    },
    {
      background: "#52a1cc",
      icon: PublicUrl + "/assets/icons/VehiclePeakEntries.svg",
      title: "Peak Entries",
      mainValue: PeakvehicleEnterTodayFormatted,
      subValue: PeakvehicleEnterFormatted,
      peakTime: peakVehicleEnterTime,
      percentage: percentagePeakVehicleEnter,
      daysago: daysago
    },
    {
      background: "#abd9f4",
      icon: PublicUrl + "/assets/icons/VehiclePeakOccupancy.svg",
      title: "Peak Occupancy",
      mainValue: vehicleOccupancyTodayFormatted,
      subValue: vehicleOccupancyFormatted,
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
                        {todayratio}
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
                        {sevendayratio}
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