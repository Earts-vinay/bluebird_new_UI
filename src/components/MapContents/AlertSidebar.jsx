import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import Axios
import { useSelector } from 'react-redux';
import { selectResponseData } from '../../redux/apiResponse/poleSlice';
import CloseIcon from '@mui/icons-material/Close';
import { Snackbar, Button,SnackbarContent } from '@mui/material';
import { Box, IconButton, Paper,Typography,Table,TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material';
import { Link,useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import { selectToken } from '../../redux/apiResponse/loginApiSlice';
import{selectResponseMapPoleData, fetchMapPoleDataStart, clearResponseMapPoleData} from '../../redux/apiResponse/mappoleSlice';
import { useDispatch } from 'react-redux';
import {  useParams } from 'react-router-dom';

const PublicUrl = process.env.PUBLIC_URL
const commonStyles = {
  fontFamily: "montserrat-regular"
};

const AlertSidebar = ({ selectedMarker, onClose,  poleId  }) => {
  const platenumber= useParams();
  const pole_id = useParams();
  const responsemappoledata = useSelector(selectResponseMapPoleData);
  const token = useSelector(selectToken); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [alertData, setAlertData] = useState(null); 
  const nodeRef = useRef(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
const arraylength = responsemappoledata?.length;
const responsePoleData = useSelector(selectResponseData);
const responsepoleId = responsePoleData?.id;
  const matchedPoleData = responsePoleData?.data?.filter(item => item.pole.id === poleId);

  useEffect(() => {
  
      setIsSidebarOpen(!!selectedMarker);
    
  }, [selectedMarker]);

  const handleSidebarToggle = () => {
    dispatch(clearResponseMapPoleData());
    setIsSidebarOpen(!isSidebarOpen);
    onClose();
  };
  const getCameraLength = (data) => {
    return data?.map(item => item?.cameras?.length);
  };
  const cameraLengths = getCameraLength(responsemappoledata);
  const handleShowalert = (item, cameraId) => {
  const camera = item.cameras.find(cam => cam.id === cameraId);
  if (camera) {
      const alertsForCamera = item.alert_list.filter(alert => alert.camera_id === cameraId);
      if (alertsForCamera.length > 0) {
        const unresolvedAlert = alertsForCamera.find(alert => alert.is_resolved === 0);
   const plate = item?.alert_list[0].plate;
  
        if (unresolvedAlert) {
          navigate(`/camerapole/${cameraId}`,  { state: { plate: plate } } );
        } else {
          setOpen(true);
        }
      } else {
        setOpen(true);
      }
    } else {
      console.error("Camera not found with ID:", cameraId);
    }
  };
  const handlesnackClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    dispatch(fetchMapPoleDataStart());
  })

  return (
    <Box display="flex" justifyContent="center">
       <>
      <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={() => handlesnackClose({ vertical: 'top', horizontal: 'right' })} >
          <SnackbarContent
        style={{ backgroundColor: 'white',color:'black' }} 
        message="There are no alerts for this camera"
        action={
          <Button color="secondary" size="small"onClick={() => handlesnackClose({ vertical: 'top', horizontal: 'right' })}>
            Close
          </Button>
        }
      />
          </Snackbar>
    </>
    {poleId !== undefined && arraylength !== undefined  &&  arraylength !== null &&  (
        <>
          {isSidebarOpen && (
            <Draggable>
              <Paper style={{
                width: 350,
                transition: 'width 0.3s, left 0.3s',
                overflow: 'auto',
                zIndex: 1000,
                borderRadius: '5px',
                position: 'absolute',
                transform: 'translate(0, 0)',
                background: 'linear-gradient(119deg, #ebeffa 2%, #e8ebfd 30%, #f0ecf9 51%, #efeefb 70%, #eef7ff 100%)',
              }}
                sx={{
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 0 5px 0 rgba(25, 96, 159, 0.1)',
                  border: 'solid 1px #fff',
                  borderRadius: '10px',
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: '#2465e9',
                      textAlign: 'start',
                      paddingY: '10px',
                      paddingX: '10px',
                      color: 'white',
                    }}
                  >
                    { poleId}
                    {',' + "     " + cameraLengths + '' + '  cameras'}
                    <CloseIcon
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        color: 'white',
                        cursor: 'pointer',
                        paddingY: '6px',
                        paddingX: '10px',
                      }}
                      onClick={handleSidebarToggle}
                    />
                  </Typography>
                  <TableContainer sx={{ maxHeight: 300 }}>
                    <Table>
                    <TableBody sx={{backgroundColor:"white",}}>
      {responsemappoledata?.map(item => (
        <React.Fragment key={item.id}>
          {item.cameras.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>
                <Typography sx={{ padding: '10px' }}>
                  For pole {item.id}, there are no cameras.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            item.cameras.map(camera => (
              <TableRow key={camera.id} style={{ textDecoration: 'none',
                 backgroundColor: item.alert_list.some(alert => alert.camera_id === camera.id && alert.is_resolved === 0) ? '#faebeb' : 'transparent'
               }} onClick={() => { handleShowalert(item,camera.id) }}>
                 <TableCell>
      <Typography variant="body1"  style={{ 
    color: item.alert_list.some(alert => alert.camera_id === camera.id && alert.is_resolved === 0) ? 'red' : 'black',
  }}>
        {camera.name}
      </Typography>
      </TableCell>
                <TableCell width="20%" sx={{ paddingY: "12px", ...commonStyles }}>
                  <img src={camera.screen_capture} alt="Camera Image" style={{ width: '150px', height: '80px', borderRadius: "5px" }}
                  onError={(e) => {
                    e.target.src = `${PublicUrl}/assets/images/noimage.png`;
                    e.target.alt = "No Image";
                }}/>
                </TableCell>
              </TableRow>
            ))
          )}
        </React.Fragment>
      ))}
    </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            </Draggable>
          )}
        </>
      )}
    
  </Box>
  );
};

export default AlertSidebar;
