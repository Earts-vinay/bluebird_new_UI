import React, { useState, useEffect } from 'react';
import { Container, Box, Tabs, Tab, TextField, IconButton, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, InputAdornment, Typography, Card, CardMedia, CardContent, Button, Popover } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import moment from "moment";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { useLocation } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { selectedPropertyByUser } from '../../../redux/apiResponse/propertySlice';
import { selectToken } from '../../../redux/apiResponse/loginApiSlice';
import { setShowNavbar } from '../../../redux/apiResponse/navBarSlice';
import axios from 'axios';
import CameraPoleVideo from './CameraContents/CameraPoleVideo';
import CameraMapPole from './CameraContents/CameraMappole';
import { toast } from "react-toastify";
import { setSelectedDateSlice } from '../../../redux/apiResponse/alertInsideSlice'
import { fetchVecAlertTraceDataStart, fetchVecAlertTraceDataSuccess, fetchVecAlertTraceDataFailure } from "../../../redux/apiResponse/VecAlertTrace"
import CameraVideoLive from './CameraContents/CameraVideoLive';
import Loader from '../../Loader';


const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL

const commonStyles = {
    fontFamily: "montserrat-regular"
};
const CameraPole = () => {

    const { cameraId } = useParams();
    const [value, setValue] = React.useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [resolved, setResolved] = useState("");
    const seleProp = useSelector(selectedPropertyByUser);
    const token = useSelector(selectToken);
    const [alertData, setAlertData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const propertyId = seleProp.id;
    const dispatch = useDispatch();
    const date = useSelector(state => state.alertInside.selectedDate)
    const [selectedDate, setSelectedDate] = useState(date);
    const [genblockData, setGenAIgenAIblockData] = useState([]);
    const [genrowData, setGenRowData] = useState(null);
    const today = moment().format('YYYY-MM-DD');
    const location = useLocation();
    const plate = location.state ? location.state.plate : null;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermGen, setSearchTermGen] = useState('');
  
    const morningStartTime = moment(today).format('YYYY-MM-DD');

   
    const eveningEndTime = moment(today).format('YYYY-MM-DD');

    const handleDateSelect = (date) => {
        const startDate = (moment(date).format("YYYY-MM-DD"))
        setSelectedDate(startDate);
        dispatch(setSelectedDateSlice(startDate))
        setAnchorEl(null); 
    };

    useEffect(() => {
        if (genblockData && genblockData?.list && genblockData?.list?.length > 0) {
            setGenRowData(genblockData?.list[0]);
        }

    }, [genblockData]);
   

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${BaseUrl}/api/vec_alert/trace?property_id=${propertyId}&plate_no=${plate}`,
                    {
                      
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json", 
                        },
                    }
                );

                const { data } = response.data;

                if (response.data.code === 200) {
                    const resolvedData = data.list.filter(item => item.is_resolved === 1);
                    const unresolvedData = data.list.filter(item => item.is_resolved === 0);
                    const sortedData = [...unresolvedData, ...resolvedData];
            
                    setGenAIgenAIblockData({
                      ...data,
                      list: sortedData,
                    })
                    toast.success(data.msg);
                    setLoading(false);
                } else {
                    setLoading(false);
                    toast.error(data.msg);

                }
            } catch (error) {
                setLoading(false);
            }
        };

        fetchData(); 

    }, [token, propertyId]
    )
    const handlerowClick = (item) => {
        setGenRowData(item)
    }

    useEffect(() => {
    if (alertData && alertData && alertData?.list && alertData?.list.length > 0) {
            setSelectedItem(alertData?.list[0]);
        }
    }, [alertData]);

    const filteredList = alertData?.list?.filter((item) =>
        item.camera?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleSearchChangeGen = (event) => {
        setSearchTermGen(event.target.value);
    };

    const filteredAlertData = alertData?.list?.filter((item) => {
        const cameraName = item.camera?.name.toLowerCase();
        const eventType = item.record?.plate.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        return (
            (cameraName && cameraName.includes(searchLower)) ||
            (eventType && eventType.includes(searchLower))
        );
    });
    const filteredGentData = genblockData?.list?.filter((item) => {
        const cameraName = item.camera?.name.toLowerCase();
        const eventType = item.record?.plate.toLowerCase();
        const searchLower = searchTermGen.toLowerCase();

        return (
            (cameraName && cameraName.includes(searchLower)) ||
            (eventType && eventType.includes(searchLower))
        );
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleArrowClick = () => {
        navigate(-1);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const TabPanel = ({ value, index, children }) => (
        <div hidden={value !== index}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );

    const handleChange = async (event) => {
        const newValue = event.target.value;
        const newIsResolved = newValue === "Resolved" ? 1 : 0;

        setSelectedItem(prevState => ({
            ...prevState,
            is_resolved: newIsResolved
        }));

        const id = selectedItem.id;

        const params = new URLSearchParams();
        params.append('id', id);
        params.append('is_resolved', newIsResolved);

        axios.defaults.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`
        }

        try {
            const response = await axios.post(
                `${BaseUrl}/api/vec_alert/resolved`,
                params.toString(),
            );

            if (response.data.code === 200) {

                toast.success("Alert have been successfully resolved");
            }
        } catch (error) {
            console.error('Error marking as resolved:', error);
        }
    };
    const handleAlertRowClick = (item) => {
        setSelectedItem(item);
    }

    useEffect(() => {

        dispatch(fetchVecAlertTraceDataStart());
        try {
            axios.get(
                `${BaseUrl}/api/vec_alert?property_id=${propertyId}&camera_id=${cameraId}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${token}`
                    }
                }
            ).then((res) => {
                const { data } = res.data;
                if (res.data.code === 200) {
                    dispatch(fetchVecAlertTraceDataSuccess(data));
                    const resolvedData = data.list.filter(item => item.is_resolved === 1);
                    const unresolvedData = data.list.filter(item => item.is_resolved === 0);
                    const sortedData = [...unresolvedData, ...resolvedData];
            
                    setAlertData({
                      ...data,
                      list: sortedData,
                    })
                    setLoading(false);
                } else {
                    dispatch(fetchVecAlertTraceDataFailure(data.msg));
                }
            }).catch((err) => {
                dispatch(fetchVecAlertTraceDataFailure('Failed to fetch data'));
            });
        } catch (error) {
            setLoading(false);
            dispatch(fetchVecAlertTraceDataFailure(error.message));
        }

    }, []);
    useEffect(() => {
        dispatch(setShowNavbar(false));
        return () => {
            dispatch(setShowNavbar(true));
        }
    }, [])
    return (

        <Container maxWidth="xxl" sx={{
            padding: 0,
            '&.MuiContainer-root': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        }}>
            {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
          <Loader loading={loading} />
        </Box>
      ) : (
            <Box display="flex" gap={{ xs: '100px', md: '5px' }} flexDirection={{ xs: 'column', md: 'row' }} sx={{ minHeight: "80vh" }}>
                <Box display="flex" flexDirection="column" width={{ xs: '100%', md: '57%' }} px={{ xs: 2, md: 0 }} height="98vh">
                    <Box sx={{ borderRadius: "10px", flexGrow: 1 }} pt={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" >
                            <Box mx="10px" display="flex" alignItems="center">

                                <ArrowBackIosNewIcon onClick={handleArrowClick} />
                                <Typography px={1} sx={commonStyles}>{alertData.list?.[0]?.pole?.name}</Typography>
                            </Box>


                            <Tabs
                                value={selectedTab}
                                onChange={handleTabChange}
                                sx={{
                                    borderBottom: "none",
                                    ".MuiTabs-flexContainer": {
                                        backgroundColor: "white",
                                        height: "80%",
                                        borderRadius: "5px",
                                        boxShadow: "0 0 5px 0 rgba(36, 101, 233, 0.5)",
                                        marginX: "10px",
                                        fontWeight: "bold",
                                        ...commonStyles
                                    },
                                }}
                                TabIndicatorProps={{ style: { display: "none" } }}
                                size="small"
                            >
                                {[
                                    " Event Video",
                                    " Live Streaming",
                                    " Gen AI View",

                                ].map((label, index) => (
                                    <Tab
                                        key={index}
                                        label={label}
                                        sx={{
                                            textTransform: "capitalize",
                                            backgroundColor: selectedTab === index && "#BCD0F8",
                                            color: selectedTab === index && " black !important",
                                            minHeight: "30px !important",
                                            margin: "5px",
                                            borderRadius: "5px",

                                        }}
                                    />
                                ))}
                            </Tabs>
                        </Box>

                        <Box mt={0}>
                            <TabPanel value={selectedTab} index={0} >
                                <CameraPoleVideo data={selectedItem} />
                            </TabPanel>
                            <TabPanel value={selectedTab} index={1}>
                                <CameraVideoLive cameraId={selectedItem?.camera?.id} />


                            </TabPanel>
                            <TabPanel value={selectedTab} index={2}>
                                <CameraMapPole data={selectedItem} />
                            </TabPanel>

                        </Box>
                    </Box>

                    <Box flexGrow={1}display="flex"  paddingX={2} >
                    {selectedTab !== 2 ? (
                        <Box
                            display="flex"
                            flexWrap="wrap"
                            flexDirection={{ xs: 'row', md: 'row', sm: 'row' }}
                            backgroundColor="white"
                            width="100%"
                            borderRadius={1}
                            marginTop="auto"
                        >
                            <Box
                                width={{ xs: '60%', md: '59%', sm: '50%', lg: '59%' }}
                                marginBottom={{ xs: 2, md: 0, sm: 2 }}
                            >

                                <Card
                                    sx={{
                                        display: 'flex',
                                        marginY: { xs: 2, md: '6px' },
                                        alignItems: "center",
                                        border: 0,
                                        cursor: "pointer",
                                        mx: "5px",
                                        boxShadow: "none"
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            width: { sm: "40%", md: "50%", lg: "40%" },
                                            height: "20vh",
                                            px: "5px",
                                            borderRadius: "10px",
                                        }}
                                        image={selectedItem?.img_url || ''}
                                        alt="Camera Image"
                                        onError={(e) => {
                                            e.target.src = `${PublicUrl}/assets/images/noimage.png`;
                                            e.target.alt = "No Image";
                                        }}
                                    />


                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flex: '1 0 auto', fontSize: "10px" }}>
                                            <Typography color="black" sx={{ fontSize: "14px" }}>
                                                Blacklisted Vehicle Detected
                                            </Typography>
                                            <Typography variant='body-2' sx={{ color: "red", textAlign: "start", py: "0px", ...commonStyles, paddingTop: "5px" }}> {selectedItem?.is_in_property === 1 ? "Still on property" : selectedItem?.is_in_property === 0 ? "Not on property" : ""}</Typography>
                                            <Typography sx={{ fontSize: "12px" }}>
                                                License Plate: {selectedItem?.plate || ''}
                                            </Typography>
                                            <Typography sx={{ fontSize: "12px" }}>
                                                Type of Vehicle: {selectedItem?.record?.car_type || ''}
                                            </Typography>
                                            <Typography sx={{ fontSize: "12px" }}>
                                                Color: {selectedItem?.record?.color || ''}
                                            </Typography>
                                            <Typography sx={{ fontSize: "12px" }}>
                                                Make: {selectedItem?.record?.brand || ''}
                                            </Typography>
                                            <Typography sx={{ fontSize: "12px" }}>
                                                Event Captured: {selectedItem?.create_time || ''}
                                            </Typography>
                                            {selectedItem && selectedItem.is_resolved === 0 && (
                                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                    <Select
                                                        sx={{ padding: 0 }}
                                                        value={selectedItem && selectedItem.is_resolved === 1 ? "Resolved" : "Unresolved"}
                                                        onChange={(event) => handleChange(event)}
                                                        displayEmpty
                                                        size='small'
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                    >
                                                        <MenuItem value="Unresolved">Unresolved</MenuItem>
                                                        <MenuItem value="Resolved">Resolved</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )}
                                            {selectedItem && selectedItem.is_resolved === 1 && (
                                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                    <Select
                                                        sx={{ padding: 0 }}
                                                        value="Resolved"
                                                        disabled
                                                        displayEmpty
                                                        size='small'
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                    >
                                                        <MenuItem value="Resolved">Resolved</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )}
                                        </CardContent>
                                    </Box>
                                </Card>

                            </Box>
                            <Box
                                width={{ xs: '100%', md: '40%', sm: '40%' }}
                                p={{ xs: 2, md: 0, sm: 2 }}
                                height={{ xs: 'auto', md: '160px' }}
                                overflow="auto"
                            >
                                <Typography style={{ paddingTop: "10px" }}>Triggered on:</Typography>

                                <Button

                                    variant="outlined"

                                    style={{ margin: '8px' }}
                                >
                                    {selectedItem?.camera?.name}
                                </Button>

                            </Box>
                        </Box>
                    ) : (

                        <Box
                            display="flex"
                            flexWrap="wrap"
                            flexDirection={{ xs: 'row', md: 'row', sm: 'row' }}
                            backgroundColor="white"
                            borderRadius={1}
                            width="100%"
                            marginTop="auto"
                        >
                            <Box
                                width={{ xs: '60%', md: '59%', sm: '50%', lg: '59%' }}
                                marginBottom={{ xs: 2, md: 0, sm: 2 }}
                            >
                                {genrowData ? (
                                    <Card
                                        sx={{
                                            display: 'flex',
                                            marginY: { xs: 2, md: '6px' },
                                            alignItems: "center",
                                            border: 0,
                                            cursor: "pointer",
                                            mx: "5px",
                                            boxShadow: "none"
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: { sm: "40%", md: "50%", lg: "40%" },
                                                height: "20vh",
                                                px: "5px",
                                                borderRadius: "10px",
                                            }}
                                            image={genrowData?.img_url || ''}
                                            alt="Camera Image"
                                            onError={(e) => {
                                                e.target.src = `${PublicUrl}/assets/images/noimage.png`;
                                                e.target.alt = "No Image";
                                            }}
                                        />
                                           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <CardContent sx={{ flex: '1 0 auto', fontSize: "10px" }}>
                                                <Typography color="black" sx={{ fontSize: "14px" }}>
                                                    Blacklisted Vehicle Detected
                                                </Typography>
                                                <Typography variant='body-2' sx={{ color: "red", textAlign: "start", py: "0px", ...commonStyles, paddingTop: "5px" }}> {genrowData?.is_in_property === 1 ? "Still on property" : genrowData?.is_in_property === 0 ? "Not on property" : ""}</Typography>

                                                <Typography sx={{ fontSize: "12px" }}>
                                                    License Plate: {genrowData?.record?.plate || ''}
                                                </Typography>
                                                <Typography sx={{ fontSize: "12px" }}>
                                                    Type of Vehicle: {genrowData?.record?.car_type || ''}
                                                </Typography>
                                                <Typography sx={{ fontSize: "12px" }}>
                                                    Color: {genrowData?.record?.color || ''}
                                                </Typography>
                                                <Typography sx={{ fontSize: "12px" }}>
                                                    Make: {genrowData?.record?.brand || ''}
                                                </Typography>
                                                <Typography sx={{ fontSize: "12px" }}>
                                                    Event Captured: {genrowData?.create_time || ''}
                                                </Typography>
                                                {genrowData && genrowData.is_resolved === 0 && (
                                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                        <Select
                                                            sx={{ padding: 0 }}
                                                            value={genrowData && genrowData.is_resolved === 1 ? "Resolved" : "Unresolved"}
                                                            onChange={(event) => handleChange(event)}
                                                            displayEmpty
                                                            size='small'
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                        >
                                                            <MenuItem value="Unresolved">Unresolved</MenuItem>
                                                            <MenuItem value="Resolved">Resolved</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                )}
                                                {genrowData && genrowData.is_resolved === 1 && (
                                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                        <Select
                                                            sx={{ padding: 0 }}
                                                            value="Resolved"
                                                            disabled
                                                            displayEmpty
                                                            size='small'
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                        >
                                                            <MenuItem value="Resolved">Resolved</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </CardContent>
                                        </Box>
                                    </Card>

                                ) : (
                                    <>
                                        <Typography sx={{ position: "absolute", top: '70%', left: "5%" }}>No Data Available</Typography>
                                    </>
                                )}

                            </Box>     
                             <Box
                                width={{ xs: '100%', md: '40%', sm: '40%' }}
                                p={{ xs: 2, md: 0, sm: 2 }}
                                height={{ xs: 'auto', md: '160px' }}
                                overflow="auto"
                            >
                                <Typography style={{ paddingTop: "10px" }}>Triggered on:</Typography>

                                <Button

                                variant="outlined"

                              style={{ margin: '8px' }}
>
                            {selectedItem?.camera?.name}
                                  </Button>
                            </Box>

                        </Box>
                    )}
                    </Box>
                </Box>


                <Box width={{ xs: '100%', md: '42%', backgroundColor: "white" }} px={{ xs: 2, sm: 0, md: 0 }} py={0} sx={{ height: "98vh" }}>
                    {selectedTab !== 2 ? (
                        <Box>
                            <Box sx={{ backgroundColor: "#2465e9", padding: "10px", borderRadius: "10px 10px 0px 0px", display: "flex", justifyContent: "flex-end", zIndex: 1, }}>
                                <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", gap: "25px", px: 2, backdropFilter: " blur(5px)", boxShadow: "-1px 6px 31px 0 rgba(25, 96, 159, 0.1)", backgroundColor: '#2465e9' }}>
                                    <TextField
                                        id="search"
                                        type="search"
                                        placeholder="Search"
                                        size="small"
                                        onChange={handleSearchChange}
                                        inputProps={{ autoComplete: "off" }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ backgroundColor: "white", border: "none", borderRadius: "5px" }}
                                    />
                                </Box>
                            </Box>

                            <Box height="90vh" overflow="auto">

                                <TableContainer>
                                    <Table style={{ background: "linear-gradient(332deg, rgba(255, 255, 255, 0.75) 99%, rgba(255, 255, 255, 0.4) 15%)", borderRadius: "5px" }}>
                                        <TableHead>
                                            <TableRow sx={{ position: 'sticky', top: 0, }}>
                                                <TableCell></TableCell>
                                                <TableCell sx={{ fontWeight: "bold", ...commonStyles }}>Camera</TableCell>
                                                <TableCell sx={{ width:"10px" }} ></TableCell>
                                                <TableCell sx={{ fontWeight: "bold", ...commonStyles,width:"100px" }}>Event Type</TableCell>
                                                <TableCell sx={{ fontWeight: "bold", ...commonStyles }}>Date & Time</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {filteredAlertData?.map((item, index) => (
                        <TableRow key={item.id} onClick={() => handleAlertRowClick(item)} sx={{ backgroundColor: selectedItem?.id === item?.id ? 'rgba(199, 216, 250, 0.32)' : index % 2 === 0 ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.4)' }}>
                            <TableCell>
                                <img src={item.img_url} alt={`Image ${item.id}`} style={{ width: { lg: "150px", md: "100px", sm: "60px" }, height: '80px', borderRadius: "5px", paddingLeft: "5px" }} />
                            </TableCell>
                            <TableCell>{item.camera?.name}</TableCell>
                            <TableCell > <img src={PublicUrl + '/assets/images/carx.svg'} style={{width:"30px"}}/></TableCell>
                            <TableCell>{item.record?.plate}
                                <Typography sx={{ color: 'red',fontSize:"10px",...commonStyles }}> {item.is_in_property === 1 ? "Still on property" : item.is_in_property === 0 ? "Not on property" : ""}</Typography>
                            </TableCell>
                            <TableCell>{item.create_time}</TableCell>
                        </TableRow>
                    ))}
                    {filteredAlertData?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5}>No data available</TableCell>
                        </TableRow>
                    )}
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Box>
                                <Box sx={{ backgroundColor: "#2465e9", padding: "10px", borderRadius: "10px 10px 0px 0px", display: "flex", justifyContent: "flex-end", zIndex: 1, }}>
                                    <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", gap: "25px", px: 2, backdropFilter: " blur(5px)", boxShadow: "-1px 6px 31px 0 rgba(25, 96, 159, 0.1)", backgroundColor: '#2465e9' }}>
                                        <TextField
                                            id="search"
                                            type="search"
                                            onChange={handleSearchChangeGen}
                                            placeholder="Search"
                                            size="small"
                                            inputProps={{ autoComplete: "off" }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ backgroundColor: "white", border: "none", borderRadius: "5px" }}
                                        />
                                    </Box>
                                </Box>

                                <Box height="90vh" overflow="auto">

                                    <TableContainer>
                                        <Table style={{ background: "linear-gradient(332deg, rgba(255, 255, 255, 0.75) 99%, rgba(255, 255, 255, 0.4) 15%)", borderRadius: "5px" }}>
                                            <TableHead>
                                                <TableRow sx={{ position: 'sticky', top: 0, }}>
                                                    <TableCell></TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", ...commonStyles }}>Camera</TableCell>
                                                    <TableCell  sx={{ width:"10px" }}></TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", ...commonStyles,width:"100px" }}>Event Type</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", ...commonStyles }}>Date & Time</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredGentData?.map((item, index) => (
                                                    <TableRow key={item.id} onClick={() => handlerowClick(item)} sx={{ backgroundColor: genrowData?.id === item?.id ? 'rgba(199, 216, 250, 0.32)' : index % 2 === 0 ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.4)' }} >
                                                        <TableCell>
                                                            <img src={item.img_url} alt={`Image ${item.id}`} style={{ width: { lg: "150px", md: "100px", sm: "60px" }, height: '80px', borderRadius: "5px", paddingLeft: "5px" }} />
                                                        </TableCell>
                                                        <TableCell>{item.camera?.name}</TableCell>
                                                        <TableCell> <img src={PublicUrl + '/assets/images/carx.svg'} style={{width:"30px"}}/></TableCell>
                                                        <TableCell>{item.record?.plate}<Typography sx={{ color: 'red',fontSize:"10px",...commonStyles }}> {item.is_in_property === 1 ? "Still on property" : item.is_in_property === 0 ? "Not on property" : ""}</Typography></TableCell>
                                                        <TableCell>{item.create_time}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {filteredGentData?.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={5}>No data available</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
      )}
        </Container>
  );
};

export default CameraPole;
