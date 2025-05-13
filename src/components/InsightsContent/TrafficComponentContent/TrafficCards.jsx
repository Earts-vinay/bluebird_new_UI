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

  // latest max people & Vehicle calculations
const maxPeoplePeakItem = dataYearList?.reduce((maxItem, currentItem) =>
  (currentItem.people_enter_peak || 0) > (maxItem?.people_enter_peak || 0) ? currentItem : maxItem, null
);
const maxMoreDaysPeoplePeakItem = dataYearList?.reduce((maxItem, currentItem) =>
  (currentItem.people_enter || 0) > (maxItem?.people_enter || 0) ? currentItem : maxItem, null
);
const maxPeoplePeakOccupancy = dataYearList?.reduce((maxItem, currentItem) =>
  (currentItem.people_occupancy_peak || 0) > (maxItem?.people_occupancy_peak || 0) ? currentItem : maxItem, null
);
const maxVehiclePeakItem = dataYearList?.reduce((maxItem, currentItem) =>
  (currentItem.vechicle_enter_peak || 0) > (maxItem?.vechicle_enter_peak || 0) ? currentItem : maxItem, null
);
const maxMoreDaysVehiclePeakItem = dataYearList?.reduce((maxItem, currentItem) =>
  (currentItem.vechicle_enter || 0) > (maxItem?.vechicle_enter || 0) ? currentItem : maxItem, null
);
const maxVehiclePeakOccupancy = dataYearList?.reduce((maxItem, currentItem) =>
  (currentItem.vechicle_occupancy_peak || 0) > (maxItem?.vechicle_occupancy_peak || 0) ? currentItem : maxItem, null
);

// latest calculations
const latestPeopleEnter = dataYearList?.reduce((acc, item) => acc + (item.people_enter || 0), 0) || 0;
const latestMoreDaysPeoplePeakEnter = maxMoreDaysPeoplePeakItem?.people_enter || 0;
const latestMoreDaysPeoplePeakTime = maxMoreDaysPeoplePeakItem?.date_time || "";

const latestPeoplePeakEnter = maxPeoplePeakItem?.people_enter_peak || 0;
const latestPeoplePeakTime = maxPeoplePeakItem?.people_enter_peaktime
  ? maxPeoplePeakItem.people_enter_peaktime.split(" ").reverse().join(" ")
  : "";

const latestPeopleOccupancy = maxPeoplePeakOccupancy?.people_occupancy_peak || 0;
const latestPeoplePeakTimeOccupancy = maxPeoplePeakOccupancy?.people_occupancy_peaktime
  ? maxPeoplePeakOccupancy.people_occupancy_peaktime.split(" ").reverse().join(" ")
  : "";

const latestVehicleEnter = dataYearList?.reduce((acc, item) => acc + (item.vechicle_enter || 0), 0) || 0;
const latestMoreDaysVehiclePeakEnter = maxMoreDaysVehiclePeakItem?.vechicle_enter || 0;
const latestMoreDaysVehiclePeakTime = maxMoreDaysVehiclePeakItem?.date_time

const latestVehiclePeakEnter = maxVehiclePeakItem?.vechicle_enter_peak || 0;
const latestVehiclePeakTime = maxVehiclePeakItem?.vechicle_enter_peaktime
  ? maxVehiclePeakItem.vechicle_enter_peaktime.split(" ").reverse().join(" ")
  : "";

const latestVehicleOccupancy = maxVehiclePeakOccupancy?.vechicle_occupancy_peak || 0;
const latestVehiclePeakOccupancyTime = maxVehiclePeakOccupancy?.vechicle_occupancy_peak_time
  ? maxVehiclePeakOccupancy.vechicle_occupancy_peak_time.split(" ").reverse().join(" ")
  : "";


// format numbers
const latestPeopleEnterFormatted = formatNumber(latestPeopleEnter);
const latestMoreDaysPeoplePeakEnterFormatted = formatNumber(latestMoreDaysPeoplePeakEnter);
const latestPeoplePeakEnterFormatted = formatNumber(latestPeoplePeakEnter);
const latestPeopleOccupancyFormatted = formatNumber(latestPeopleOccupancy);
const latestVehicleEnterFormatted = formatNumber(latestVehicleEnter);
const latestMoreDaysVehiclePeakEnterFormatted = formatNumber(latestMoreDaysVehiclePeakEnter)
const latestVehiclePeakEnterFormatted = formatNumber(latestVehiclePeakEnter);
const latestVehicleOccupancyFormatted = formatNumber(latestVehicleOccupancy);

// previous max people & Vehicle calculations
const previousMaxPeoplePeakItem = previousDataList?.reduce((maxItem, currentItem) =>
  (currentItem.people_enter_peak || 0) > (maxItem?.people_enter_peak || 0) ? currentItem : maxItem, null
);
const previousMaxMoreDaysPeoplePeakItem = previousDataList?.reduce((maxItem, currentItem) =>
  (currentItem.people_enter || 0) > (maxItem?.people_enter || 0) ? currentItem : maxItem, null
);

const previousPeoplePeakOccupancy = previousDataList?.reduce((maxItem, currentItem) =>
  (currentItem.people_occupancy_peak || 0) > (maxItem?.people_occupancy_peak || 0) ? currentItem : maxItem, null
);
const previousMaxVehiclePeakItem = previousDataList?.reduce((maxItem, currentItem) =>
  (currentItem.vechicle_enter_peak || 0) > (maxItem?.vechicle_enter_peak || 0) ? currentItem : maxItem, null
);

const previousMaxMoreDaysVehiclePeakItem = previousDataList?.reduce((maxItem, currentItem) =>
  (currentItem.vechicle_enter || 0) > (maxItem?.vechicle_enter || 0) ? currentItem : maxItem, null
);
const previousMaxVehiclePeakOccupancy = previousDataList?.reduce((maxItem, currentItem) =>
  (currentItem.vechicle_occupancy_peak || 0) > (maxItem?.vechicle_occupancy_peak || 0) ? currentItem : maxItem, null
);

// previous calculations
const previousPeopleEnter = previousDataList?.reduce((acc, item) => acc + (item.people_enter || 0), 0) || 0;
const previousMoreDaysPeoplePeakEnter = previousMaxMoreDaysPeoplePeakItem?.people_enter || 0;
const previousMoreDaysPeoplePeakTime = previousMaxMoreDaysPeoplePeakItem?.date_time || ""

const previousPeoplePeakEnter = previousMaxPeoplePeakItem?.people_enter_peak || 0;
const previousPeoplePeakTime = previousMaxPeoplePeakItem?.people_enter_peaktime
  ? previousMaxPeoplePeakItem.people_enter_peaktime.split(" ").reverse().join(" ")
  : "";

const previousPeopleOccupancy = previousPeoplePeakOccupancy?.people_occupancy_peak || 0;
const previousPeoplePeakOccupancyTime = previousPeoplePeakOccupancy?.people_occupancy_peaktime
  ? previousPeoplePeakOccupancy.people_occupancy_peaktime.split(" ").reverse().join(" ")
  : "";

const previousVehicleEnter = previousDataList?.reduce((acc, item) => acc + (item.vechicle_enter || 0), 0) || 0;
const previousPeakvehicleEnter = previousMaxVehiclePeakItem?.vechicle_enter_peak || 0;

const previousMoreDaysPeakvehicleEnter = previousMaxMoreDaysVehiclePeakItem?.vechicle_enter || 0;
const previousMoreDaysVehiclePeakTime = previousMaxMoreDaysVehiclePeakItem?.date_time || ""

const previousVehiclePeakTime = previousMaxVehiclePeakItem?.vechicle_enter_peaktime
  ? previousMaxVehiclePeakItem.vechicle_enter_peaktime.split(" ").reverse().join(" ")
  : "";

const previousVehicleOccupancy = previousMaxVehiclePeakOccupancy?.vechicle_occupancy_peak || 0;
const previousVehiclePeakOccupancyTime = previousMaxVehiclePeakOccupancy?.vechicle_occupancy_peak_time
  ? previousMaxVehiclePeakOccupancy.vechicle_occupancy_peak_time.split(" ").reverse().join(" ")
  : "";

  const previousPeopleEnterFormatted = formatNumber(previousPeopleEnter);
  const previousPeopleMoreDaysPeakEnterFormatted = formatNumber(previousMoreDaysPeoplePeakEnter);

  const previousPeoplePeakEnterFormatted = formatNumber(previousPeoplePeakEnter);
  const previousPeopleOccupancyFormatted = formatNumber(previousPeopleOccupancy);
  const previousVehicleEnterFormatted = formatNumber(previousVehicleEnter);
  const previousMoreDaysPeakvehicleEnterFormatted = formatNumber(previousMoreDaysPeakvehicleEnter)
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

            console.log("multiple days",dateRange, selectedRange, isCustomRangeSelected);
            

  // const cardData = [
  //   {
  //     background: "#1b3664",
  //     icon: PublicUrl + "/assets/icons/PeopleTotalEntries.svg",
  //     title: "Total Entries",
  //     mainValue: latestPeopleEnterFormatted,
  //     subValue: previousPeopleEnterFormatted,
  //     percentage: percentagePeopleEnter,
  //     daysago: daysago
  //   },
  //   {
  //     background: "#01669a",
  //     icon: PublicUrl + "/assets/icons/peak_entries.svg",
  //     title: "Peak Entries",
  //     mainValue:
  //       (selectedRange === "D" &&
  //        dateRange.latestStartDate == dateRange.latestEndDate)
  //         ? latestPeoplePeakEnterFormatted
  //         :  latestMoreDaysPeoplePeakEnterFormatted,
    
  //     subValue:
  //       (selectedRange === "D" &&
  //        dateRange.previousStartDate == dateRange.previousEndDate)
  //         ? previousPeoplePeakEnterFormatted
  //         :  previousPeopleMoreDaysPeakEnterFormatted,
    
  //     peakTime: 
  //     (selectedRange === "D" &&
  //       dateRange.previousStartDate == dateRange.previousEndDate)
  //        ? latestPeoplePeakTime
  //        :  latestMoreDaysPeoplePeakTime,

  //     previousPeakTime:
  //     (selectedRange === "D" &&
  //       dateRange.previousStartDate == dateRange.previousEndDate)
  //        ? previousPeoplePeakTime
  //        :  previousMoreDaysPeoplePeakTime,

  //     percentage: percentagePeoplePeakEnter,
  //     daysago: daysago
  //   },
    
  //   {
  //     background: "#52a1cc",
  //     icon: PublicUrl + "/assets/icons/PersonPeakOccupancy.svg",
  //     title: "Peak Occupancy",
  //     mainValue: latestPeopleOccupancyFormatted,
  //     subValue: previousPeopleOccupancyFormatted,
  //     peakTime: latestPeoplePeakTimeOccupancy,
  //     previousPeakTime:previousPeoplePeakOccupancyTime,

  //     percentage: percentagePeopleOccupancy,
  //     daysago: daysago
  //   },
  //   {
  //     background: "#46c8f5",
  //     icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
  //     title: "Total Entries",
  //     mainValue: latestVehicleEnterFormatted,
  //     subValue: previousVehicleEnterFormatted,
  //     percentage: percentageVehicleEnter,
  //     daysago: daysago
  //   },
  //   {
  //     background: "#52a1cc",
  //     icon: PublicUrl + "/assets/icons/VehiclePeakEntries.svg",
  //     title: "Peak Entries",
  //     mainValue:
  //     (selectedRange === "D" &&
  //       dateRange.latestStartDate == dateRange.latestEndDate)
  //        ? latestVehiclePeakEnterFormatted
  //        :  latestMoreDaysVehiclePeakEnterFormatted,

  //     subValue:
  //     (selectedRange === "D" &&
  //       dateRange.previousStartDate == dateRange.previousEndDate)
  //        ? previousPeakvehicleEnterFormatted
  //        :  previousMoreDaysPeakvehicleEnterFormatted,

  //     peakTime: 
  //     (selectedRange === "D" &&
  //       dateRange.previousStartDate == dateRange.previousEndDate)
  //        ? latestVehiclePeakTime
  //        :  latestMoreDaysVehiclePeakTime,

  //     previousPeakTime:
  //     (selectedRange === "D" &&
  //       dateRange.previousStartDate == dateRange.previousEndDate)
  //        ? previousVehiclePeakTime
  //        :  previousMoreDaysVehiclePeakTime,

  //     percentage: percentagePeakVehicleEnter,
  //     daysago: daysago
  //   },
  //   {
  //     background: "#abd9f4",
  //     icon: PublicUrl + "/assets/icons/VehiclePeakOccupancy.svg",
  //     title: "Peak Occupancy",
  //     mainValue: latestVehicleOccupancyFormatted,
  //     subValue: previousVehicleOccupancyFormatted,
  //     peakTime: latestVehiclePeakOccupancyTime,

  //     previousPeakTime:previousVehiclePeakOccupancyTime,
  //     percentage: percentageVehicleOccupancy,
  //     daysago: daysago
  //   },
  // ];

  const isSingleDaySelection =
  dateRange.latestStartDate === dateRange.latestEndDate &&
  dateRange.previousStartDate === dateRange.previousEndDate;

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
    icon: PublicUrl + "/assets/icons/peak_entries.svg",
    title: "Peak Entries",
    mainValue: isSingleDaySelection
      ? latestPeoplePeakEnterFormatted
      : latestMoreDaysPeoplePeakEnterFormatted,

    subValue: isSingleDaySelection
      ? previousPeoplePeakEnterFormatted
      : previousPeopleMoreDaysPeakEnterFormatted,

    peakTime: isSingleDaySelection
      ? latestPeoplePeakTime
      : latestMoreDaysPeoplePeakTime,

    previousPeakTime: isSingleDaySelection
      ? previousPeoplePeakTime
      : previousMoreDaysPeoplePeakTime,

    percentage: percentagePeoplePeakEnter,
    daysago: daysago
  },
  {
    background: "#52a1cc",
    icon: PublicUrl + "/assets/icons/PersonPeakOccupancy.svg",
    title: "Peak Occupancy",
    mainValue: latestPeopleOccupancyFormatted,
    subValue: previousPeopleOccupancyFormatted,
    peakTime: latestPeoplePeakTimeOccupancy,
    previousPeakTime: previousPeoplePeakOccupancyTime,
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
    mainValue: isSingleDaySelection
      ? latestVehiclePeakEnterFormatted
      : latestMoreDaysVehiclePeakEnterFormatted,

    subValue: isSingleDaySelection
      ? previousPeakvehicleEnterFormatted
      : previousMoreDaysPeakvehicleEnterFormatted,

    peakTime: isSingleDaySelection
      ? latestVehiclePeakTime
      : latestMoreDaysVehiclePeakTime,

    previousPeakTime: isSingleDaySelection
      ? previousVehiclePeakTime
      : previousMoreDaysVehiclePeakTime,

    percentage: percentagePeakVehicleEnter,
    daysago: daysago
  },
  {
    background: "#abd9f4",
    icon: PublicUrl + "/assets/icons/VehiclePeakOccupancy.svg",
    title: "Peak Occupancy",
    mainValue: latestVehicleOccupancyFormatted,
    subValue: previousVehicleOccupancyFormatted,
    peakTime: latestVehiclePeakOccupancyTime,
    previousPeakTime: previousVehiclePeakOccupancyTime,
    percentage: percentageVehicleOccupancy,
    daysago: daysago
  }
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
                <Box key={index} width={{ xs: '100%', sm: '48%', md: '32.2%' }} mb={2}>
                  <StatCard {...card} commonStyles={commonStyles} />
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '100%', md: '19.5%' } }}>
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
                <CardContent sx={{ height: '50%', paddingX: '15px', paddingTop: "35px", paddingBottom: "15px !important", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginTop:"16px" }}>
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