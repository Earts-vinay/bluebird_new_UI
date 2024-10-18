import React, { useState, useEffect } from 'react';
import { Container, Box, Tabs, Tab, TextField, IconButton, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, InputAdornment, Typography, Card, CardMedia, CardContent, Button, Popover } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import moment from "moment";
import { useNavigate, useParams } from 'react-router-dom';
import CameraVideo from './CameraContents/CameraVideo';
import CameraMap from './CameraContents/CameraMap';
import { useDispatch, useSelector } from 'react-redux';
import { geteventtypelist, getVectracelist } from "../../../redux/apiResponse/vecalertSlice";
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { selectedPropertyByUser } from '../../../redux/apiResponse/propertySlice';
import { selectToken } from '../../../redux/apiResponse/loginApiSlice';
import axios from 'axios';
import LiveVideo from '../../ControlCenterContent/LiveVideo';
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';


const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL

const commonStyles = {
    fontFamily: "montserrat-regular"
};
const Camera = () => {
    const { alertId } = useParams();
    const [value, setValue] = React.useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [resolved, setResolved] = useState("");
    const seleProp = useSelector(selectedPropertyByUser);
    const token = useSelector(selectToken);
    const date = useSelector(state => state.alertInside.selectedDate)
    const [alertData, setAlertData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedId, setSelectedId] = useState(null)
    const location = useLocation();
    const plate = location.state ? location.state.plate : null;


    const handleDateSelect = (date) => {
        setSelectedDate(date);

    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleArrowClick = () => {
        navigate(-1);
    };

    const handleTabChange = (event, newValue,) => {
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

        setSelectedId(prevState => ({
            ...prevState,
            is_resolved: newIsResolved
        }));

        const id = selectedId.id;

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/api/vec_alert/trace`, {
                    params: {
                        property_id: seleProp?.id,
                        start_time: date,
                        end_time: date,
                        plate_no: plate,
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
                setAlertData(response.data);
                setLoading(false);

            } catch (error) {
                setLoading(false);
                console.error('Error fetching camera data:', error);
                // Handle error...
            }
        };

        fetchData();
    }, [alertId, seleProp?.id, date, token]); 

    useEffect(() => {
        if (alertData.data && alertData.data.list) {
            const foundAlert = alertData.data.list?.find(item => item.id === parseInt(alertId));
            if (foundAlert) {
                setSelectedId(foundAlert);
            } else {
                setSelectedId(null); 
            }
        }
    }, [alertData, alertId]);


    return (

        <Container maxWidth="xxl" sx={{
            padding: 0,
            '&.MuiContainer-root': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        }}>
            <Box display="flex" gap={{ xs: '100px', md: '5px' }} flexDirection={{ xs: 'column', md: 'row' }} >
                <Box flexGrow={1} width={{ xs: '100%', md: '59%' }} height="80vh" px={{ xs: 2, md: 0 }} py={2} >
                    <Box sx={{ borderRadius: "10px" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" >
                            <Box mx="10px" display="flex" alignItems="center">

                                <ArrowBackIosNewIcon onClick={handleArrowClick} />
                                <Typography px={1} sx={commonStyles}> {selectedId?.pole?.name}</Typography>
                            </Box>


                            <Tabs
                                value={selectedTab}
                                onChange={handleTabChange}
                                sx={{
                                    borderBottom: "none",
                                    ".css-heg063-MuiTabs-flexContainer": {
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
                                <CameraVideo data={selectedId} />
                            </TabPanel>
                            <TabPanel value={selectedTab} index={1}>

                                <LiveVideo cameraId={selectedId?.camera?.id} />
                            </TabPanel>
                            <TabPanel value={selectedTab} index={2}>
                                <CameraMap />
                            </TabPanel>
                        </Box>
                    </Box>

                    <Box
                        display="flex"
                        flexWrap="wrap"
                        flexDirection={{ xs: 'row', md: 'row', sm: 'row' }}
                        backgroundColor="white"
                        borderRadius={1}
                        marginX={2}
                    >
                        <Box
                            width={{ xs: '60%', md: '59%', sm: '50%', lg: '59%' }}
                            marginBottom={{ xs: 2, md: 0, sm: 2 }}
                        >
                            {selectedId && (
                                <Card
                                    sx={{
                                        display: 'flex',
                                        marginY: { xs: 2, md: '10px' },
                                        alignItems: "center",
                                        border: 0,
                                        cursor: "pointer",
                                        mx: "5px",
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
                                        image={selectedId?.img_url || ''}
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
                                            <Typography variant='body-2' sx={{ color: "red", textAlign: "start", py: "0px", ...commonStyles, paddingTop: "5px" }}>
                                                still on property
                                            </Typography>

                                            <Typography sx={{ fontSize: "12px" }}>
                                                License Plate: {selectedId?.plate || ''}
                                            </Typography>
                                            <Typography sx={{ fontSize: "12px" }}>
                                                Type of Vehicle: {selectedId?.record?.car_type || ''}
                                            </Typography>
                                            <Typography sx={{ fontSize: "12px" }}>
                                                Color: {selectedId?.record?.color || ''}
                                            </Typography>
                                            <Typography sx={{ fontSize: "12px" }}>
                                                Make: {selectedId?.record?.brand || ''}
                                            </Typography>
                                            <Typography sx={{ fontSize: "12px" }}>
                                                Event Captured: {selectedId?.create_time || ''}
                                            </Typography>
                                            {selectedId && selectedId.is_resolved === 0 && (
                                                <FormControl sx={{ m: 1, minWidth: 120 }}>

                                                    <Select
                                                        sx={{ padding: 0 }}
                                                        value={selectedId && selectedId.is_resolved === 1 ? "Resolved" : "Unresolved"}
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
                                            {selectedId && selectedId.is_resolved === 1 && (
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
                                {selectedId?.camera?.name}
                            </Button>

                        </Box>
                    </Box>
                </Box>


                <Box width={{ xs: '100%', md: '40%', backgroundColor: "white" }} px={{ xs: 2, sm: 0, md: 0 }} py={0}>
                    <Box sx={{ backgroundColor: "#2465e9", padding: "10px", borderRadius: "10px 10px 0px 0px", display: "flex", justifyContent: "flex-end", position: "sticky", top: 0, zIndex: 1, }}>
                        <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", gap: "25px", px: 2, backdropFilter: " blur(5px)", boxShadow: "-1px 6px 31px 0 rgba(25, 96, 159, 0.1)", backgroundColor: '#2465e9' }}>
                           
                            <TextField
                                id="search"
                                type="search"
                                placeholder="Search"
                                size="small"
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
                                        <TableCell sx={{ fontWeight: "bold", ...commonStyles }}></TableCell>
                                        <TableCell sx={{ fontWeight: "bold", ...commonStyles }}>Event Type</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", ...commonStyles }}>Date & Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedId && Object.keys(selectedId)?.length > 0 ? (
                                        <TableRow>
                                            <TableCell>
                                                <img src={selectedId?.img_url} alt={`Image `} style={{ width: { lg: "150px", md: "100px", sm: "60px" }, height: '80px', borderRadius: "5px", paddingLeft: "5px" }} />
                                            </TableCell>
                                            <TableCell>{selectedId?.camera?.name}</TableCell>
                                            <TableCell> <img src={PublicUrl + '/assets/images/carx.svg'} /></TableCell>
                                            <TableCell>{selectedId?.record?.brand}<Typography sx={{ color: 'red' }}>still on  Property</Typography></TableCell>
                                            <TableCell>{selectedId?.create_time}</TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>No data available</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                </Box>
            </Box>
        </Container>


    );
};

export default Camera;
