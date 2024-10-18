import { useEffect,useState } from "react";
import { GoogleMap, LoadScript, Marker ,Polyline, InfoWindow, MarkerF} from '@react-google-maps/api';
import { useDispatch,useSelector } from "react-redux";
import { selectedPropertyByUser } from '../../../../redux/apiResponse/propertySlice';
import  { fetchCameraMapPoleDataStart, fetchCameraMapPoleDataSuccess, fetchCameraMapPoleDataFailure,selectResponseCameraMapPoleData } from '../../../../redux/apiResponse/CameramappoleSlice';
import { selectToken } from '../../../../redux/apiResponse/loginApiSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from "moment";
import {Grid, Typography} from '@mui/material';

const CameraMapPole = ({data}) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [path, setPath] = useState([]);
  const[mapPoleData, setMapPoleData] = useState([]);
const [selectedMarker, setSelectedMarker] = useState(null);
const [hoveredMarker, setHoveredMarker] = useState(null);
const [isHovering, setIsHovering] = useState(false);
const Vectracelist = useSelector((state)=> state.VecAlert.vecAlertTrace);
const dispatch = useDispatch();
const seleProp = useSelector(selectedPropertyByUser);
const plate = data?.plate;
const BaseUrl = process.env.REACT_APP_API_URL;
const propertyId = seleProp.id;
const token = useSelector(selectToken);
const [loading, setLoading] = useState(true);
const lat  = data?.pole?.location_lat;
const lng = data?.pole?.location_lng;
const [lastItem, setLastItem] = useState(null);
const CameraPolemapData = useSelector(selectResponseCameraMapPoleData);
const [Cameramappolepopup, setCameramappolepopupdata ] = useState([]);
const[poleFilteredData, setPoleFilteredData] = useState([]);
const [defaultCenter, setDefaultCenter] = useState({ lat: 0, lng: 0 }); 
const today = moment().format('YYYY-MM-DD');
const [selectedMarkerInfo, setSelectedMarkerInfo] = useState(null);
const [filteredData, setFilteredData] = useState();
const [isLoading, setIsLoading] = useState(true);

const morningStartTime = moment(today).format('YYYY-MM-DD');
const eveningEndTime = moment(today).format('YYYY-MM-DD');


  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const sortedList = [...(Cameramappolepopup?.list ?? [])]
  .reduce((uniqueList, item) => {
    if (!uniqueList.poleIds.has(item.pole.id)) {
      uniqueList.list.push(item);
      uniqueList.poleIds.add(item.pole.id);
    }
    return uniqueList;
  }, { list: [], poleIds: new Set() })
  .list
  .sort((a, b) => {
    const timeA = new Date(a.create_time);
    const timeB = new Date(b.create_time);
    return timeA - timeB;
  });

  useEffect(() => {
    if (CameraPolemapData && CameraPolemapData?.length > 0) {
    const totalLat = CameraPolemapData.reduce((acc, loc) => acc + parseFloat(loc.location_lat), 0);
    const totalLng = CameraPolemapData.reduce((acc, loc) => acc + parseFloat(loc.location_lng), 0);
    const avgLat = totalLat / CameraPolemapData?.length;
    const avgLng = totalLng / CameraPolemapData?.length;
    setDefaultCenter({ lat: avgLat, lng: avgLng });
      
    }
  }, [CameraPolemapData]);

const calculatePath = () => {
  return CameraPolemapData?.map(item => ({
    lat: parseFloat(item?.location_lat),
    lng: parseFloat(item?.location_lng),
    id:(item.id),
  }));
};

  const filterDataByCreateTime = () => {
    const sortedData = Cameramappolepopup.sort((a, b) => new Date(a.create_time) - new Date(b.create_time));
    setFilteredData(sortedData);
  };

useEffect(() => {
  const path = calculatePath();
  setPath(path);
  getlastitempath();

}, [CameraPolemapData]);

useEffect(() => {
  
  const fetchData = async () => {
    dispatch(fetchCameraMapPoleDataStart());
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
        
        setCameramappolepopupdata(data);
        dispatch(fetchCameraMapPoleDataSuccess(data.list.map(item => item.pole)));
        getlastitempath(); 
        setIsLoading(false);
        if (Cameramappolepopup?.length > 0) {
          filterDataByCreateTime();
        }
        toast.success(data.msg);
      } else {
        dispatch(fetchCameraMapPoleDataFailure(data.msg));
        toast.error(data.msg);
        setIsLoading(false);
      }
    } catch (error) {
      dispatch(fetchCameraMapPoleDataFailure(error.message));
    }
  };

  fetchData(); 
}, [token, propertyId]
)

const getlastitempath = () => {
  if (path && path?.length > 0) {
    setLastItem(path[path?.length - 1]);
  }
}

  const customMarkerIcon = {
    url: process.env.PUBLIC_URL + '/assets/images/Ellipsebig.png', 
    
  };
  const showlastItemMarkerIcon = {
    url: process.env.PUBLIC_URL + '/assets/images/Carfinal.svg',
  };
  
  const mapStyles = {
    height: '80vh',
    width: '100%',
    borderRadius: '10px',
  };
  const mapOptions = {
    clickableIcons: false, 
    mapTypeControl: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [
          { visibility: 'off' },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [
          { visibility: 'off' },
        ],
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [
          { visibility: 'off' },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'labels',
        stylers: [
          { visibility: 'off' },
        ],
      },
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [
          {
            hue: '#84bef1',
          },
        ],
      },
    ],
  };
  useEffect(() => {
  }, [selectedMarkerInfo]); 
  
  const handleMarkerClick = ( pole) => {
     setSelectedMarkerInfo(pole);
  };
  
  const handleCloseInfoWindow = () => {
    setSelectedMarkerInfo(null);
  };

  const infoWindowContent = (
    <Grid  spacing={2}>
      <Grid  sx={{display:'flex',flexDirection:"row"}}>
    <Grid  >
       <img
                          src={selectedMarkerInfo?.img_url}
                          alt={`Image`}
                          style={{
                            width: { lg: "150px", md: "150px", sm: "180px" },
                            height: '80px',
                            borderRadius: "5px",

                          }}
                          onError={(e) => {
                            e.target.src = "/assets/images/noimage.png";
                            e.target.alt = "No Image";

                          }}
                        />
  </Grid>
  <Grid sx={{paddingLeft:"20px"}}>
  <Typography sx={{ fontSize: "13px",color: "grey" }}>
                    Camera:<span style={{color:"#194e7e"}}><b> {selectedMarkerInfo?.camera?.name || ''}</b></span>
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                    Zone: <span style={{color:"#194e7e"}}><b> {selectedMarkerInfo?.zones[0]?.name || ''}</b></span>
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                    Pole: <span style={{color:"#194e7e"}}><b> {selectedMarkerInfo?.pole?.name || ''}</b></span>
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                    Event Captured: <span style={{color:"#194e7e"}}><b>{selectedMarkerInfo?.create_time || ''} </b></span>
                </Typography>
  </Grid>
      </Grid>
  
  </Grid>
  
  );
  const lastItempole = sortedList[sortedList.length - 1];
  return (
    <>
 <div style={{ height: "50vh", maxWidth: "98vw", marginLeft: "20px", marginRight: "20px", borderRadius: "10px", overflow: "hidden" }}>
      {isLoaded && (
        <LoadScript googleMapsApiKey="AIzaSyAmaZMMaAgoUxEmbWdg1Xv0d2dSibZcZs8">
            <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter} options={mapOptions}>
              {CameraPolemapData?.length === 0 && (
                <div style={{
                  position: 'absolute',
                  top: "30%",
                  left: "10%",
                  textAlign: "center",
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "5px",

                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}>
                  There are no trace records found for the plate number {plate} for today
                </div>
              )}
              {sortedList?.map((pole, index) => {
                const lat = parseFloat(pole?.pole.location_lat);
                const lng = parseFloat(pole?.pole.location_lng);
                if (isNaN(lat) || isNaN(lng)) {
                  return null;
                }

                return (
                  <Marker
                    key={index}
                    position={{ lat: lat, lng: lng }}
                    icon={{
                      url: process.env.PUBLIC_URL + '/assets/images/Ellipsebig.png',
                      scaledSize: new window.google.maps.Size(24, 24),
                      anchor: new window.google.maps.Point(12, 12),
                    }}
                    onClick={() => handleMarkerClick(pole)}
                    label={{
                      text: (index + 1).toString(),
                      color: 'white',
                    }}
                  />
                );
              })}

              {selectedMarkerInfo && (
                <InfoWindow
                  position={{ lat: parseFloat(selectedMarkerInfo.pole.location_lat), lng: parseFloat(selectedMarkerInfo.pole.location_lng) }}
                  onCloseClick={handleCloseInfoWindow}
                >
                  <div>{infoWindowContent}</div>
                </InfoWindow>
              )}

              {path && path.length > 0 && (
                <Polyline
                  path={path}
                  options={{ strokeColor: "blue", strokeOpacity: 1.0, strokeWeight: 2 }}
                />
              )}

              {lastItempole && lastItempole.pole && lastItempole.pole.location_lat && lastItempole.pole.location_lng && (
                <Marker
                  position={{ lat: parseFloat(lastItempole.pole.location_lat), lng: parseFloat(lastItempole.pole.location_lng) }}
                  icon={showlastItemMarkerIcon}
                />
              )}
            </GoogleMap>
        </LoadScript>
      )}
    </div>
  </>
  );
};

export default CameraMapPole;
