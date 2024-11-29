import React, { useState, useEffect } from 'react'
import { Box, Container, IconButton, Paper, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SnowshoeingIcon from "@mui/icons-material/Snowshoeing";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { clearTokenAndUser, selectToken } from "../../redux/apiResponse/loginApiSlice";
import moment from "moment";
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from 'axios';
import { selectedPropertyByUser } from '../../redux/apiResponse/propertySlice';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';


const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL
const commonStyles = { fontFamily: "montserrat-regular", color: "#285986", fontWeight: "bold" };

const MapSidebar1 = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const token = useSelector(selectToken);
  const [countingData, setCountingData] = useState({});
  const seleProp = useSelector(selectedPropertyByUser);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_KEY = '1dbe261b7b4cc4b640856fe8cce860af';
  const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const weatherResponse = await axios.get(`${API_BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        setWeatherData(weatherResponse?.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setIsLoading(false);
      }
    };

    if (seleProp && seleProp?.location_lat != null && seleProp?.location_lng != null) {
      const { location_lat, location_lng } = seleProp;
      fetchWeatherData(location_lat, location_lng);
    } else {
      console.error('Latitude and/or longitude not available in seleProp.');
      setIsLoading(false);
    }
  }, [API_BASE_URL, API_KEY, seleProp]);


  const moment = require('moment');
  const today = moment();
  const startTime = today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endTime = today.format('YYYY-MM-DD');

  const propertyId = '2';
  const zoneId = '45';
  const startDate = startTime;
  const endDate = endTime;

  const [dataList, setDataList] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/counting/property`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            property_id: seleProp?.id,
            time_type: 'date',
            start_time: startDate,
            end_time: endDate,
          },
        });
        if (response?.data?.code === 200 && response?.data?.data?.length > 0) {
          setDataList(response?.data?.data[0].list);
        } else {

        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const currentDate = endDate;
  const formattedDate = currentDate;
  const filteredData = dataList.filter(item => item.date_time.slice(0, 10) === formattedDate);

  const totalPeopleEnterToday = filteredData.reduce((acc, item) => acc + item.people_enter, 0);
  const peopleOccupancyToday = filteredData.reduce((acc, item) => acc + item.people_occupancy, 0);
  const vehicleEnterToday = filteredData.reduce((acc, item) => acc + item.vechicle_enter, 0);
  const vehicleOccupancyToday = filteredData.reduce((acc, item) => acc + item.vechicle_occupancy, 0);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          marginTop: "20px",
        }}
      >
        <Paper
          elevation={3}
          style={{
            width: isSidebarOpen ? 300 : 35,

            transition: "width 0.3s",
            boxShadow: "none",
            overflow: "hidden",
            position: "relative",
            top: "0px",
            right: "0",
            height: "260px",
            borderRadius: "5px"
          }}
          sx={{
            filter: 'drop-shadow(0 0 10px #b1b1b1d4)',
            backgroundImage: isSidebarOpen ? `url(${PublicUrl}/assets/images/mapsidebar.png)` : `url(${PublicUrl}/assets/images/halfmapsidebar.png)`,
            backgroundColor: "transparent",
            overflow: "hidden",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',


          }}
        >
          <div style={{ padding: "0px", }}>
            {isSidebarOpen && (
              <Box >
                <Box sx={{
                  backgroundColor: "#016699", display: "flex", justifyContent: "space-around", alignContent: "center", position: "relative",
                  left: "30px", width: "270px"
                }}>
                  <Typography
                    variant="body2"
                    sx={{

                      textAlign: "center",
                      paddingY: "5px",
                      borderRadius: "5px 0px 0px 0px",
                      color: "white",
                    }}
                  >
                    {moment().format("DD-MM-YY | HH:mm")}
                  </Typography>
                  <Box textAlign="center" display="flex" alignItems="center" gap={0.5}>

                    <img src={PublicUrl + "/assets/images/clear-sky.png"} alt="" width="20px" height="20px" />
                    {weatherData ? (
                      <div>
                        <Typography variant="body2" color="white">
                          {Math.round(weatherData.main.temp)}°C
                        </Typography>
                      </div>
                    ) : (
                      <Typography variant="body2" color="white">
                        - -
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
            {isSidebarOpen && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    position: "relative",
                    left: "60px", width: "280px",
                    gap: 1,
                    alignItems: "center",

                    paddingY: "15px"
                  }}
                >
                  <SnowshoeingIcon sx={{ ...commonStyles }} />
                  <Typography sx={{ ...commonStyles, fontSize: "16px" }}>Pedestrian</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "80px",
                    justifyContent: "center",

                    position: "relative",
                    left: "25px",
                    width: "280px"
                  }}
                >
                  <Typography variant="body2" sx={{ ...commonStyles }}>Entered Today</Typography>
                  <Typography variant="body2" sx={{ ...commonStyles }} >{totalPeopleEnterToday}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "67.5px",
                    justifyContent: "center",

                    position: "relative",
                    left: "25px",
                    width: "280px",
                    paddingBottom: "15px"
                  }}
                >
                  <Typography variant="body2" sx={{ ...commonStyles }}>
                    Total occupancy
                  </Typography>
                  <Typography variant="body2" sx={{ ...commonStyles }}>{peopleOccupancyToday}</Typography>
                </Box>
                <Box sx={{ border: "solid 0.1px #c3cfdc;", marginX: "40px" }}></Box>
                <Box sx={{ paddingY: "0px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      position: "relative",
                      left: "60px",
                      width: "280px",
                      paddingY: "10px",
                      paddingTop: "20px"
                    }}
                  >
                    <DirectionsCarIcon sx={{ ...commonStyles }} />
                    <Typography sx={{ ...commonStyles, fontSize: "16px" }}>Vehicle</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "80px",
                      justifyContent: "center",

                      position: "relative",
                      left: "25px",
                      width: "280px"
                    }}
                  >
                    <Typography variant="body2" sx={{ ...commonStyles }}>
                      Entered Today
                    </Typography>
                    <Typography variant="body2" sx={{ ...commonStyles }}>{vehicleEnterToday}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "67.5px",
                      justifyContent: "center",

                      position: "relative",
                      left: "25px",
                      width: "280px"
                    }}
                  >
                    <Typography variant="body2" sx={{ ...commonStyles }}>
                      Total occupancy
                    </Typography>
                    <Typography variant="body2" sx={{ ...commonStyles }}>{vehicleOccupancyToday}</Typography>
                  </Box>
                </Box>
              </>
            )}
          </div>

        </Paper>

        <IconButton
          onClick={toggleSidebar}
          borderRadius="50%"
          sx={{
            paddingX: "0px",
            position: "relative",
            top: "10px",
            left: "25px",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
        {isSidebarOpen ? <FaAngleRight /> : <FaAngleLeft /> }
        </IconButton>
      </div>
    </>
  )
}

export default MapSidebar1