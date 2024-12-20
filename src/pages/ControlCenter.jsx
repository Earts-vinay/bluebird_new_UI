import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Typography, Button, Select, MenuItem, TextField, Container, InputAdornment, InputLabel, FormControl, Pagination, Dialog, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  fetchControlCenterList,
  createControlCenter,
  fetchControlCenterById,
  updateControlCenterById,
  deleteControlCenterById,
  deleteControlCenterByIdAndCamera,
} from "../redux/apiResponse/controlCenterSlice"; 
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { FaCirclePlay, FaPlay, FaPlayCircle } from "react-icons/fa";
import { fetchDeviceList } from "../redux/apiResponse/deviceSlice";
import { DeviceComponent } from "../components";
import Loader from "../components/Loader";
import { selectedPropertyByUser } from "../redux/apiResponse/propertySlice";
import LiveVideo from "../components/ControlCenterContent/LiveVideo";
import { toast } from "react-toastify";
import CustomButton from "../components/customStyles/CustomButton";
import { setShowNavbar } from "../redux/apiResponse/navBarSlice";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HeaderLayout from "../components/customStyles/HeaderLayout";
import CustomDialog from "../components/customStyles/CustomDialog";
import CustomTextField from "../components/customStyles/CustomTextField";
import CustomSearch from "../components/customStyles/CustomSearch";


const PublicUrl = process.env.PUBLIC_URL;
const commonStyles = { fontFamily: "montserrat-regular" };

const ControlCenter = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [addCamera, setAddCamera] = useState(false);
  const [isError, setIsError] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [selectedViewObj, setSelectedViewObj] = useState({});
  const [viewName, setViewName] = useState("");
  const [duplicateViewName, setDuplicateViewName] = useState("");
  const [updateViewName, setUpdateViewName] = useState("");
  const [deleteViewObj, setDeleteViewObj] = useState({});
  const dispatch = useDispatch();
  const seleProp = useSelector(selectedPropertyByUser);
  console.log("seleProp",seleProp);
  
  const controlCenter = useSelector(
    (state) => state.ControlCenter.ControlCenter
  );
  const devicesList = useSelector((state) => state.Device.deviceList);
  const status = useSelector((state) => state.ControlCenter.status);
  const error = useSelector((state) => state.ControlCenter.error);
  const [selectedView, setSelectedView] = useState("All Cameras");
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6); // Adjust the number of items per page as needed
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const [showLiveVideo, setShowLiveVideo] = useState(false);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [hiddenPlayButtons, setHiddenPlayButtons] = useState([]);
  const propertyId = seleProp?.id
  console.log("propertyIdfhdusifhuo",propertyId);
  
  const handlePlayClick = (cameraId) => {
    setSelectedCameraId(cameraId);
    setShowLiveVideo(true); // Show live video when play button is clicked
    setHiddenPlayButtons([cameraId]); // Hide the clicked play button
  };


  const handleViewChange = (event) => {
    setSelectedView(event.target.value);
  };
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000);

    return () => clearTimeout(timer); 
  }, []);
  useEffect(() => {
    dispatch(fetchControlCenterList(seleProp?.id));
    dispatch(fetchDeviceList(seleProp?.id));
  }, [dispatch, seleProp]);


  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    let filteredList = [];
    if (selectedView === "" || selectedView === "All Cameras") {
      if (devicesList?.data && devicesList?.data?.list?.length > 0) {
        devicesList?.data?.list?.forEach((item) => {
          item.cameras.forEach((c) =>
            filteredList.push({
              ...c,
             
             
            })
          );
        
        });
      }
    } else {
      const find = controlCenter?.data?.list?.find(
        (item) => item.name === selectedView
      );
      if (find) {
        for (const item of controlCenter.data.list) {
          if (item.name === selectedView) {
            item.cameras?.forEach((c) =>
              filteredList.push({
                ...c,
                view_id: item.id,
                total_cameras: item.cameras.length,
              })
            );
            break;
          }
        }
      }
    }
 console.log("control certernew",controlCenter,filteredList);
 
    filteredList = filteredList.filter((camera) =>
      camera.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    filteredList.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredCameras(filteredList);
  }, [selectedView, controlCenter.data, page, searchValue, devicesList]);


  const handleCameraToggle = (cameraId) => {
    console.log("selected cameras", selectedCameras, controlCenter, selectedView);
    const isSelected = selectedCameras.includes(cameraId);


    if (isSelected) {
      if (selectedCameras.length === 1) {
        const obj = devicesList.data.list.find(
          (obj, ind) => obj.id === selectedCameras[0]
        );
        toast.error(`If you delete this ${obj.name} camera, the entire view will get deleted.`);
      }
      setSelectedCameras(selectedCameras.filter((id) => id !== cameraId));
    } else {
      setSelectedCameras([...selectedCameras, cameraId]);
    }
  };

  const handleCameraAddToggle = (cameraId) => {
    const isSelected = selectedCameras.includes(cameraId);
    if (isSelected) {
      setSelectedCameras(selectedCameras.filter((id) => id !== cameraId));
    } else {
      setSelectedCameras([...selectedCameras, cameraId]);
    }
  };

  const handleAddNow = () => {
    setOpenDialog(true);
    setSelectedCameras([]);
  };
  const handleDeleteNow = (cameraObj) => {
    setDeleteViewObj(cameraObj);
    setOpenDeleteDialog(true);
  };

  const handleAddCamera = () => {
    setAddCamera(true);
    setSelectedCameras([]);
  };

  const handleDuplicate = () => {
    setOpenDuplicateDialog(true);
  };

  const handleSave = async () => {
    const selectedViewbyuser = controlCenter.data.list.find(
      (view) => view.name === selectedView
    );
    const selectedViewbyuser1 = controlCenter.data.list.find(
      (view) => view.name === duplicateViewName
    );
    if (duplicateViewName !== "") {
      const yourFormData = {
        name: duplicateViewName,
        camera_id: selectedViewbyuser?.camera_id,
        property_id: seleProp?.id,
      };
      if (selectedViewbyuser1 !== undefined) {
        setIsError("View name already exists.");
        return;
      }
      const { payload } = await dispatch(createControlCenter(yourFormData));
      if (payload.msg === "ok") {
        setOpenDuplicateDialog(false);
        setSelectedView(duplicateViewName);
        setDuplicateViewName("");
        setIsError("")
      }
    } else {
      setIsError('Enter View Name')
    }
  };

  const handleSubmit = async () => {
    const selectedViewbyuser = controlCenter.data.list.find(
      (view) => view.name === viewName
    );
    if (selectedViewbyuser) {
      setIsError("View name already exists");
      return;
    }
    try {
      const yourFormData = {
        name: viewName,
        camera_id: selectedCameras.toString(),
        property_id: seleProp?.id,
      };
      const { payload } = await dispatch(createControlCenter(yourFormData));
      if (payload.msg === "ok") {
        setSelectedCameras([]);
        setViewName("");
        setIsError("");
        setSelectedView(viewName);
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  
  const handleUpdate = async () => {
    setOpenEditDialog(true);
    const selectedViewbyuser = controlCenter.data.list.find(
      (view) => view.name === selectedView
    );
    const fetchData = async () => {
      if (selectedViewbyuser.id !== undefined) {
        try {
          const { payload } = await dispatch(
            fetchControlCenterById(selectedViewbyuser.id)
          );
          const { data } = payload;
          if (data && data.camera_id) {
            const { camera_id } = data;
            setSelectedCameras([
              ...camera_id.split(",").map((val) => Number(val)),
            ]);
            setUpdateViewName(selectedView);
          } else {
            console.error(
              "Data or camera_id property not found in the API response."
            );
          }
        } catch (error) {
          console.error(
            "Error fetching data from the control center API:",
            error
          );
        }
      }
    };
    fetchData();
    setSelectedViewObj(selectedViewbyuser);
  };

  const handleDelete = async () => {
    if (deleteViewObj.total_cameras > 1) {
      const { payload } = await dispatch(
        deleteControlCenterByIdAndCamera({
          formData: {
            user_view_id: deleteViewObj.view_id,
            camera_id: deleteViewObj.id,
          },
          propertyId,
        })
      );
      if (payload.msg === "ok") {
        setDeleteViewObj({});
        setOpenDeleteDialog(false);
      }
    } else {
      const { payload } = await dispatch(
        deleteControlCenterById({ id: deleteViewObj.view_id, propertyId })
      );
      if (payload.msg === "ok") {
        setDeleteViewObj({});
        setOpenDeleteDialog(false);
        setSelectedView("All Cameras");
      }
    }
  };
  

  const handleUpdateByDevice = async () => {
    const selectedViewbyuser = controlCenter.data.list.find(
      (view) => view.name === updateViewName
    );
    if (
      selectedViewbyuser !== undefined &&
      selectedViewbyuser.name !== selectedView
    ) {
      setIsError("View name already exists.");
      return;
    } else {
      if (selectedCameras.length >= 1) {
        const yourFormData = {
          name: updateViewName ? updateViewName : selectedView,
          camera_id: selectedCameras.toString(),
        };
        const { payload } = await dispatch(
          updateControlCenterById({
            id: selectedViewObj.id,
            formData: yourFormData,
          })
        );
        if (payload.msg === "ok") {
          setSelectedCameras([]);
          setSelectedView(updateViewName);
          setUpdateViewName("");
          setIsError("")
          setOpenEditDialog(false);
        }
      } else {
        console.log(selectedCameras);
        const viewObj = controlCenter.data.list?.find(obj => obj.name === selectedView);
        console.log(viewObj);
        const { payload } = await dispatch(
          deleteControlCenterById(viewObj.id)
        );
        if (payload.msg === "ok") {
          setOpenEditDialog(false);
          setSelectedView("All Cameras");
        }
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setViewName("");
    setIsError("");
    setSearchText("")
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const handleCloseEditDialog = () => {
    setSelectedCameras([]);
    setIsError("");
    setUpdateViewName("");
    setOpenEditDialog(false);
  };
  const handleCloseDuplicateDialog = () => {
    setOpenDuplicateDialog(false);
    setDuplicateViewName("");
    setIsError("")
  };

  const handleCloseAddCamera = () => {
    setAddCamera(false);
  };

  const paginatedData = filteredCameras?.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  console.log("paginatedData",paginatedData);
  

  return (
    <div>
      <Container maxWidth="xxl">
        <HeaderLayout >
          <>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              paddingTop: "20px",
              px: "20px",
              zIndex: 1,
              background: "linear-gradient(-60.13deg, #F3FBFF 0%, #FFFFFF 33%, #F0FAFD 52%, #F7FCFF 75%, #CBE8F8 100%)",
            }}>
              <Box
                display="flex"
                justifyContent=""
                gap={2}
                width={800}
                height={40}
              >
                <FormControl style={{ width: "30%" }} size="small">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedView}
                    onChange={handleViewChange}
                    IconComponent={KeyboardArrowDownIcon}
                    MenuProps={{ PaperProps: { style: { maxHeight: 185, border: "#06122b" } } }}
                  >
                    <MenuItem key={"default"} value={"All Cameras"} >
                      All Cameras
                    </MenuItem>
                    {controlCenter.data &&
                      controlCenter.data.list.length > 0 &&
                      controlCenter.data.list.map((item) => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                {selectedView === "" || selectedView === "All Cameras" ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAddNow}
                    sx={{ textTransform: "capitalize", border:"1px solid #06122b"  }}
                  >
                    <AddIcon sx={{color:"#1c3664"}}/>
                  </Button>
                ) : null}
                {selectedView === "" ||
                  selectedView === "All Cameras" ? null : (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleUpdate}
                      sx={{ textTransform: "capitalize",border:"1px solid #06122b" }}
                    >
                      <BorderColorOutlinedIcon  sx={{color:"#1c3664"}}/>
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleDuplicate}
                      sx={{ textTransform: "capitalize" , border:"1px solid #06122b"}}
                    >
                      <LibraryAddOutlinedIcon sx={{color:"#1c3664"}}/>
                    </Button>
                  </>
                )}
              </Box>
              <TextField
                label="Search by Camera"
                variant="outlined"
                style={{ marginBottom: "20px" }}
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                InputLabelProps={{
                  style: { fontFamily: 'montserrat-regular', fontSize: "14px" },
                }}
                sx={{
                  "&:hover .MuiOutlinedInput-root": {
                    "& > fieldset": { border: '1px solid #0000004d 30%' },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": { border: "solid 1px #0000004d 30%" },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "#06122b" }} />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ autoComplete: "off" }}

              />
            </Box>
            {/* Content */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                <Loader loading={loading} />
              </Box>
            ) : (

              <Box
                sx={{
                  mt: "50px",
                  mb: "100px",
                  height: "calc(100% - 130px)",
                  overflowY: "auto",
                  padding: "20px"
                }}
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100vh",
                    }}
                  >
                    <HashLoader size={50} color="#2465e9" loading={loading} />
                  </div>
                ) : (
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="start"
                    gap="15px"
                    minHeight="50vh"
                    overflow="auto"
                    marginY="10px"
                  >
         {paginatedData.length > 0 ? (
                      paginatedData.map((camera, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "start",
                            gap: "10px",
                            overflow: "hidden",
                            borderRadius: "10px",

                            height: { xs: "24%", sm: "24%", md: "25%", lg: "48%", xl: "45%", xxl: "50%" },
                            width: { xs: "95%", sm: "47%", md: "47%", lg: "31%", xl: "32%", xxl: "32%" },
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              gap: "8px",
                              background: "transparent",
                              width: "100%",
                              height: "100%",
                              border: "none",
                              boxShadow: "none",
                              borderRadius: "10px",
                            }}
                          >
                            {showLiveVideo && camera.id === selectedCameraId ? (
                              <Box width="100%" height="255px">
                                <LiveVideo cameraId={camera.id} />
                              </Box>
                            ) : (
                              <Box sx={{ position: "relative" }}>
                                {/* image container */}
                                <Box
                                  component="img"
                                  src={camera.screen_capture}
                                  alt=""
                                  sx={{
                                    width: "100%",
                                    height: "255px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                    transition: 'height 0.3s ease, width 0.3s ease',
                                  }}
                                />
                                {!hiddenPlayButtons.includes(camera.id) && (
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                    }}
                                  >
                                    <FaPlay
                                      fontSize="200%"
                                      color="white"
                                      cursor="pointer"
                                      onClick={() => handlePlayClick(camera.id)}
                                    />
                                  </Box>
                                )}
                              </Box>

                            )}
                            <Box sx={{ display: "flex", justifyContent: "space-between", background: "linear-gradient( #000000ad, rgba(64, 84, 64, 0))", borderRadius: "10px", position: "absolute", top: 0, width: "100%" }}>
                              <Box>
                                <Typography
                                  variant="body2"
                                  style={{
                                    opacity: 0.7,
                                    padding: "15px",
                                    color: "white",
                                  }}
                                >
                                  {camera.name}
                                </Typography>
                              </Box>
                              <Box>
                                {selectedView !== "All Cameras" && (
                                  <Typography
                                    onClick={() => handleDeleteNow(camera)}
                                    sx={{
                                      color: "white",
                                      cursor: "pointer",
                                      paddingY: "15px",
                                      paddingX: "10px",
                                    }}
                                  >
                                    <CloseIcon />
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </div>
                        </Box>
                      ))
                    ) : (
                      <div>No cameras ..</div>
                    )}

                  </Box>
                )}
              </Box>
            )}
            {/* Footer */}
            <Box
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                pb: "10px",
                background: "linear-gradient(-60.13deg, #F3FBFF 0%, #FFFFFF 33%, #F0FAFD 52%, #F7FCFF 75%, #F0FAFD 100%)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center !important",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "5px",
                  }}
                >
                  <Pagination
                    count={Math.ceil(filteredCameras.length / rowsPerPage)}
                    color="primary"
                    page={page + 1}
                    onChange={(event, value) => setPage(value - 1)}
                  />
                </Box>
              </Box>
            </Box>

            {/* Add View */}
            <CustomDialog open={openDialog} onClose={handleCloseDialog} title="Add View" >
              <DialogContent>
                <CustomTextField value={viewName} onChange={(e) => { setViewName(e.target.value); }} error={Boolean(isError)} helperText={<div style={{ height: '13px', marginBottom: "8px" }}>{isError}</div>} label="Enter view name here" required />
                <CustomSearch value={searchText} onChange={handleSearch} label="Search by Camera Name" />

                <Typography fontSize="14px" sx={commonStyles}>
                  Camera List
                </Typography>
                <TableContainer sx={{ height: "200px" }}>
                  <Table>
                    <TableHead></TableHead>
                    <TableBody>
  {devicesList?.data && devicesList?.data?.list ? (
    devicesList?.data?.list
      .filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name in ascending order
      .map((device) =>
        device.cameras?.map((camera) => ( // Iterate through the `camera` array
          <TableRow key={camera.id}>
            <TableCell>
              <img
                src={camera.screen_capture}
                style={{
                  width: "120px",
                  height: "75px",
                  borderRadius: "5px",
                }}
                onError={(e) => {
                  e.target.src = `${PublicUrl}/assets/images/noimage.png`;
                  e.target.alt = "No Image";
                }}
              />
            </TableCell>
            <TableCell>{camera.name}</TableCell>
            <TableCell>
              {device.healthy_info.is_online ? "Online" : "Offline"}
            </TableCell>
            <TableCell>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleCameraAddToggle(camera.id)}
                sx={{
                  textTransform: "capitalize",
                  width: "100px",
                  "&:hover": {
                    borderColor: "#bcccd6", // Hover border color
                  },
                  borderColor: "#bcccd6", // Default border color
                  color: selectedCameras.includes(camera.id)
                    ? "#06122b"
                    : "#06122b",
                }}
              >
                {selectedCameras.includes(camera.id) ? "Remove" : "Add"}
              </Button>
            </TableCell>
          </TableRow>
        ))
      )
  ) : (
    <TableRow>
      <TableCell colSpan={4}>No data available</TableCell>
    </TableRow>
  )}
</TableBody>

                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomButton onClick={handleCloseDialog}>
                  Cancel
                </CustomButton>
                {selectedCameras.length > 0 && viewName !== "" ? (
                  <CustomButton onClick={handleSubmit}>Save</CustomButton>
                ) : (
                  <CustomButton onClick={handleSubmit} disabled>
                    Save
                  </CustomButton>
                )}
              </DialogActions>
            </CustomDialog>

            {/*Edit Dialog */}
              <CustomDialog open={openEditDialog} onClose={handleCloseEditDialog} title=" Edit View">
              <DialogContent>
                <CustomTextField value={updateViewName}  onChange={(e) => setUpdateViewName(e.target.value)}  error={Boolean(isError)} helperText={<div style={{ height: '13px', marginBottom: "8px" }}>{isError}</div>} label="Enter view name here"/>
                <TableContainer sx={{ height: "250px" }}>
                  <Table>
                  <TableBody>
  {devicesList?.data && devicesList?.data?.list ? (
    devicesList.data.list.map((device) =>
      device.cameras?.map((camera) => ( // Iterate over `camera` array
        <TableRow key={camera.id}>
          <TableCell>
            <img
              src={camera.screen_capture}
              style={{
                width: "120px",
                height: "75px",
                borderRadius: "5px",
              }}
              onError={(e) => {
                e.target.src = `${PublicUrl}/assets/images/noimage.png`;
                e.target.alt = "No Image";
              }}
            />
          </TableCell>
          <TableCell>{camera.name}</TableCell>
          <TableCell>
            {device.healthy_info.is_online === true ? "Online" : "Offline"}
          </TableCell>
          <TableCell>
            {selectedCameras.includes(camera.id) ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleCameraToggle(camera.id)}
                sx={{
                  textTransform: "capitalize",
                  width: "100px",
                  color: "#06122b",
                  borderColor: "#bcccd6",
                  "&:hover": {
                    borderColor: "#bcccd6", // Hover border color
                  },
                }}
              >
                Remove
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleCameraToggle(camera.id)}
                sx={{
                  textTransform: "capitalize",
                  width: "100px",
                  color: "#06122b",
                  borderColor: "#bcccd6",
                  "&:hover": {
                    borderColor: "#bcccd6", // Hover border color
                  },
                }}
              >
                Add
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))
    )
  ) : (
    <TableRow>
      <TableCell colSpan={4}>No data available</TableCell>
    </TableRow>
  )}
</TableBody>

                  </Table>
                </TableContainer>
              </DialogContent>
              {/* Dialog actions */}
              <DialogActions
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CustomButton
                  onClick={() => {
                    handleCloseEditDialog();
                    setUpdateViewName("");
                    setIsError("")
                    setSelectedCameras([]);
                  }}
                >
                  Cancel
                </CustomButton>
                <CustomButton onClick={handleUpdateByDevice}>
                  {" "}
                  Update
                </CustomButton>
              </DialogActions>
              </CustomDialog>

            {/* Delete View */}
              <CustomDialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} title="Delete View">
              <DialogContent sx={{display:'flex',justifyContent:"center"}}>
                <Typography sx={commonStyles} width={400} >
                  {paginatedData?.length === 1 ? `If you delete this ${deleteViewObj?.name} camera, the entire view will get deleted` : `Please confirm to delete ${deleteViewObj?.name}`}
                </Typography>
              </DialogContent>
              <DialogActions
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "capitalize",
                }}
              >
                <CustomButton onClick={handleCloseDeleteDialog}>
                  Cancel
                </CustomButton>
                <CustomButton onClick={handleDelete}>Confirm</CustomButton>
              </DialogActions>
              </CustomDialog>

            {/* Duplicate */}
              <CustomDialog open={openDuplicateDialog} onClose={handleCloseDuplicateDialog} title=" Duplicate view">
              <DialogContent>
                <Typography sx={commonStyles} width="500px">
                  Add New Name
                </Typography>
                <CustomTextField value={duplicateViewName}  onChange={(e) => setDuplicateViewName(e.target.value)} error={Boolean(isError)} helperText={<div style={{ height: '13px' }}>{isError}</div>} label="Enter view name here"/>
              </DialogContent>
              <DialogActions
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "capitalize",
                }}
              >
                <CustomButton onClick={handleSave}>Save</CustomButton>
              </DialogActions>
              </CustomDialog>
          </>
        </HeaderLayout>
      </Container>
    </div>
  );
};
export default ControlCenter;
