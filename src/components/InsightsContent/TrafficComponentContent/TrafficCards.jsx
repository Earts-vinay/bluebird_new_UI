import React, { useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataList, fetchCountListHour, fetchLast7Count } from '../../../redux/apiResponse/countingSlice';
import { selectToken } from '../../../redux/apiResponse/loginApiSlice';
import { selectedPropertyByUser } from '../../../redux/apiResponse/propertySlice';
import StatCard from '../../customStyles/StatCard';
import moment from 'moment';

const PublicUrl = process.env.PUBLIC_URL;
const commonStyles = { fontFamily: "montserrat-regular" };

const TrafficCards = () => {
  const today = moment();
  const startTime = today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = today.format('YYYY-MM-DD');
  const startonlytime = today.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const endonlytime = today.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const seventhDayAgo = today.clone().subtract(7, 'days');
  const start7thTime = seventhDayAgo.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const end7thTime = seventhDayAgo.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const seleProp = useSelector(selectedPropertyByUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const { dataList, countListHour, last7Count } = useSelector((state) => state.counting);
  const propertyId = seleProp?.id;

  useEffect(() => {
    if (propertyId && token) {
      dispatch(fetchDataList({ propertyId, startDate: startTime, endDate: endTime, token }));
      dispatch(fetchCountListHour({ propertyId, startonlytime, endonlytime, token }));
      dispatch(fetchLast7Count({ propertyId, start7thTime, end7thTime, token }));
    }
  }, [propertyId, token, dispatch, startTime, endTime, startonlytime, endonlytime, start7thTime, end7thTime]);

  // The rest of your calculations and rendering logic goes here...
  const currentDate = endTime;
  const formattedDate = currentDate;
  const filteredData = dataList.filter(item => item.date_time.slice(0, 10) === formattedDate);

  // const filteredVehicleData = vehicleData[0]?.list?.filter(item => item.date_time.slice(0, 10) === formattedDate);
  // const filteredZonesData = zoneAlert[0]?.list?.filter(item => item.date_time?.slice(0, 10) === formattedDate);

  const totalPeopleEnterToday = filteredData.reduce((acc, item) => acc + item.people_enter, 0);
  const peopleOccupancyToday = filteredData.reduce((acc, item) => acc + item.people_occupancy, 0);
  const vehicleEnterToday = filteredData.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const vehicleOccupancyToday = filteredData.reduce((acc, item) => acc + item.vechicle_occupancy, 0);

  const filteredDataStartDate = dataList.filter(item => {
    const itemDate = moment(item.date_time, 'YYYY-MM-DD');
    return itemDate.isSame(startTime, 'day');
  });

  // Calculate totals for the start date (7 days ago)
  const totalPeopleEnter = filteredDataStartDate.reduce((acc, item) => acc + item.people_enter, 0);
  const peopleOccupancy = filteredDataStartDate.reduce((acc, item) => acc + item.people_occupancy, 0);
  const vehicleEnter = filteredDataStartDate.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const vehicleOccupancy = filteredDataStartDate.reduce((acc, item) => acc + item.vechicle_occupancy, 0);

  // const Zonesalerts = zonesFilteredDataStartDate?.reduce((acc, item) => acc + item.resolved_alert_num + item.unresolved_alert_num, 0);

  // Differences
  const handlePercentageError = (value) => {
    return !isNaN(value) && isFinite(value) ? value : 0;
  };
  const percentagePeopleEnter = handlePercentageError(((totalPeopleEnterToday - totalPeopleEnter) / totalPeopleEnter) * 100).toFixed(2);
  const percentagePeopleOccupancy = handlePercentageError(((peopleOccupancyToday - peopleOccupancy) / peopleOccupancy) * 100).toFixed(2);
  const percentageVehicleEnter = handlePercentageError(((vehicleEnterToday - vehicleEnter) / vehicleEnter) * 100).toFixed(2);
  const percentageVehicleOccupancy = handlePercentageError(((vehicleOccupancyToday - vehicleOccupancy) / vehicleOccupancy) * 100).toFixed(2);

  // Peak entries and occupancies
  const filteredTime = countListHour.filter(item => item.date_time.slice(0, 10) === formattedDate);
  const highestPeopleEntryHour = filteredTime.reduce((acc, curr) => {
    if (curr.people_enter > acc.people_enter) {
      return curr;
    }
    return acc;
  }, { people_enter: 0 });
  const hightestpeopeleentrytime = moment(highestPeopleEntryHour.date_time).format('HH:mm');
  const highestPeopleOccupancyHour = filteredTime.reduce((acc, curr) => {
    if (curr.people_occupancy > acc.people_occupancy) {
      return curr;
    }
    return acc;
  }, { people_occupancy: 0 });
  const highestPeopleOccupancytime = moment(highestPeopleOccupancyHour.date_time).format('HH:mm');

  const highestVehicleEntryHour = filteredTime?.reduce((acc, curr) => {
    if (curr.vechicle_enter > acc.vechicle_enter) {
      return curr;
    }
    return acc;
  }, { vechicle_enter: 0 });
  const highestVehicleEntryTime = moment(highestVehicleEntryHour.date_time).format('HH:mm');
  const highestVehicleOccupancyHour = filteredTime.reduce((acc, curr) => {
    if (curr.vechicle_occupancy > acc.vechicle_occupancy) {
      return curr;
    }
    return acc;
  }, { vechicle_occupancy: 0 });
  const highestVehicleOccupancytime = moment(highestVehicleOccupancyHour.date_time).format('HH:mm');

  // Last 7 day peakentries and occupancy
  const sevenfiltered = last7Count?.filter(item => item.date_time.slice(0, 10) === startTime);

  const sevenhighestPeopleEntry = sevenfiltered?.reduce((acc, curr) => {
    if (curr.people_enter > acc.people_enter) {
      return curr;
    }
    return acc;
  }, { people_enter: 0 });
  const sevenhighestPeopleEntryTime = moment(sevenhighestPeopleEntry.date_time).format('HH:mm');

  const sevenhighestPeopleOccupancyHour = sevenfiltered.reduce((acc, curr) => {
    if (curr.people_occupancy > acc.people_occupancy) {
      return curr;
    }
    return acc;
  }, { people_occupancy: 0 });
  const sevenhighestPeopleOccupancyTime = moment(sevenhighestPeopleOccupancyHour.date_time).format('HH:mm');

  const sevenhighestVehicleEntryHour = sevenfiltered?.reduce((acc, curr) => {
    if (curr.vechicle_enter > acc.vechicle_enter) {
      return curr;
    }
    return acc;
  }, { vechicle_enter: 0 });
  const sevenhighestVehicleEntryTime = moment(sevenhighestVehicleEntryHour.date_time).format('HH:mm');

  const sevenhighestVehicleOccupancyHour = sevenfiltered.reduce((acc, curr) => {
    if (curr.vechicle_occupancy > acc.vechicle_occupancy) {
      return curr;
    }
    return acc;
  }, { vechicle_occupancy: 0 });
  const sevenhighestVehicleOccupancyTime = moment(sevenhighestVehicleOccupancyHour.date_time).format('HH:mm');

  // Differecnce by hour
  const sevenpercentagePeopleEnter = handlePercentageError(((highestPeopleEntryHour.people_enter - sevenhighestPeopleEntry.people_enter) / sevenhighestPeopleEntry.people_enter) * 100).toFixed(2);
  const sevenpercentagePeopleOccupancy = handlePercentageError(((highestPeopleOccupancyHour.people_occupancy - sevenhighestPeopleOccupancyHour.people_occupancy) / sevenhighestPeopleOccupancyHour.people_occupancy) * 100).toFixed(2);
  const sevenpercentageVehicleEnter = handlePercentageError(((highestVehicleEntryHour.vechicle_enter - sevenhighestVehicleEntryHour.vechicle_enter) / sevenhighestVehicleEntryHour.vechicle_enter) * 100).toFixed(2);
  const sevenpercentageVehicleOccupancy = handlePercentageError(((highestVehicleOccupancyHour.vechicle_occupancy - sevenhighestVehicleOccupancyHour.vechicle_occupancy) / sevenhighestVehicleOccupancyHour.vechicle_occupancy) * 100).toFixed(2);

  // Ratio calculation
  const todayratio = vehicleEnterToday > 0 ? (totalPeopleEnterToday / vehicleEnterToday).toFixed(2) : '0';
  const sevendayratio = vehicleEnter > 0 ? (totalPeopleEnter / vehicleEnter).toFixed(2) : '0';
  const ratiopercentage = handlePercentageError(((todayratio - sevendayratio) / sevendayratio) * 100).toFixed(2);


  const cardData = [
    {
      background: "#1b3664",
      icon: PublicUrl + "/assets/icons/PeopleTotalEntries.svg",
      title: "Total Entries",
      mainValue: totalPeopleEnterToday,
      subValue: totalPeopleEnter,
      percentage: percentagePeopleEnter,
    },
    {
      background: "#01669a",
      icon: PublicUrl + "/assets/icons/PersonPeak entries.svg",
      title: "Peak Entries",
      mainValue: highestPeopleEntryHour.people_enter,
      subValue: sevenhighestPeopleEntry.people_enter,
      peakTime: hightestpeopeleentrytime,
      percentage: sevenpercentagePeopleEnter,
    },
    {
      background: "#52a1cc",
      icon: PublicUrl + "/assets/icons/PersonPeakOccupancy.svg",
      title: "Peak Occupancy",
      mainValue: highestPeopleOccupancyHour.people_occupancy,
      subValue: sevenhighestPeopleOccupancyHour.people_occupancy,
      peakTime: highestPeopleOccupancytime,
      percentage: sevenpercentagePeopleOccupancy,
    },
    {
      background: "#46c8f5",
      icon: PublicUrl + "/assets/icons/VehicleTotalEntries.svg",
      title: "Total Entries",
      mainValue: vehicleEnterToday,
      subValue: vehicleEnter,
      percentage: percentageVehicleEnter,
    },
    {
      background: "#52a1cc",
      icon: PublicUrl + "/assets/icons/VehiclePeakEntries.svg",
      title: "Peak Entries",
      mainValue: highestVehicleEntryHour.vechicle_enter,
      subValue: sevenhighestVehicleEntryHour.vechicle_enter,
      peakTime: highestVehicleEntryTime,
      percentage: sevenpercentageVehicleEnter,
    },
    {
      background: "#abd9f4",
      icon: PublicUrl + "/assets/icons/VehiclePeakOccupancy.svg",
      title: "Peak Occupancy",
      mainValue: highestVehicleOccupancyHour.vechicle_occupancy,
      subValue: sevenhighestVehicleOccupancyHour.vechicle_occupancy,
      peakTime: highestVehicleOccupancytime,
      percentage: sevenpercentageVehicleOccupancy,
    },
  ];
  
  return (
    <>
      <Box sx={{ display: "flex", gap: "20px",flexWrap:"wrap" }}>
        <Box sx={{  width: { xs: '100%', sm: '100%', md: '79%' } }}>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {cardData.map((card, index) => (
            <Box key={index} width={{ xs: '100%', sm: '48%', md: '32%' }} mb={2}>
              <StatCard {...card} commonStyles={commonStyles} />
            </Box>
          ))}
        </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '100%', md: '19%' }}}>
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
                    <Typography variant="subtitle2" color="white" sx={{ fontSize: '14px', mb: "20px",...commonStyles }}>
                      Pedestrain by <br /> Vechile Ratio
                    </Typography>
                    <Typography variant="h1" color="white" style={{ fontSize: '50px', ...commonStyles }}>
                      {todayratio}
                     </Typography>

                  </div>
                  <div>
                    <img src={PublicUrl +"/assets/icons/Ratio.svg"} width="30px" style={{fill:"white"}} alt="" />
                  </div>
                </div>
              </CardContent>
              <CardContent sx={{ height: '50%', paddingX: '15px', paddingTop: "10px", paddingBottom: "15px !important", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ paddingTop: "65px" }}>
                    <Typography variant="h3" color="white" style={{ fontSize: '40px', ...commonStyles}}>
                    {sevendayratio}
                    </Typography>
                    <Typography variant="subtitle2" color="white" sx={commonStyles}>
                      7 days ago
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="white" style={{ textAlign: "right", paddingTop: "65px", fontSize: "20px",...commonStyles }}>
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
    </>
  )
}
export default TrafficCards