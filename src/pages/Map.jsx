import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { useNavigate, useLocation  } from 'react-router-dom'
import { selectToken } from "../redux/apiResponse/loginApiSlice";
import { fetchDataStart, fetchDataSuccess, fetchDataFailure, selectResponseData } from "../redux/apiResponse/poleSlice";
import { useDispatch, useSelector } from 'react-redux';
import AlertSidebar from "../components/MapContents/AlertSidebar"
import MapListSidebar from "../components/MapContents/MapListSidebar";
import MapSidebar1 from "../components/MapContents/MapSidebar1";
import { Box, Container } from "@mui/material";
import { fetchMapListDataStart } from "../redux/apiResponse/maplistSlice";
import { fetchMapPoleDataStart, fetchMapPoleDataSuccess, fetchMapPoleDataFailure } from '../redux/apiResponse/mappoleSlice';
import moment from "moment";
import { selectPropertyResponseData, selectedPropertyByUser } from '../redux/apiResponse/propertySlice';
import { setPolesInBoundary } from "../redux/apiResponse/polesInBoundarySlice";
import { selectUser } from "../redux/apiResponse/authSlice";
import HeaderLayout from '../components/customStyles/HeaderLayout';

const MapContainer = ({ locations=[], propertylocations,onPropertyMarkerClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const token = useSelector(selectToken);
  const [selectedMarker, setSelectedMarker] = useState(1);
  const [responsepoleData, setResponsepoleData] = useState(locations);
  const [showBouncer, setShowBouncer] = useState(false);
  const [loading, setLoading] = useState(false);
  const alertSidebarOpen = useSelector(state => state.alertSidebarOpen);
  const [selectedProperty, setSelectedProperty] = useState("");
  const seleProp = useSelector(selectedPropertyByUser);
  const [showCustomMarker, setShowCustomMarker] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const customMarkerIconUrl = process.env.PUBLIC_URL + '/assets/images/Ellipse.svg';
  const customMarkerAlertIconUrl = process.env.PUBLIC_URL + '/assets/images/polegif1.gif';
  const propertyMarkerIconUrl = process.env.PUBLIC_URL + '/assets/images/property.svg'; 
  const [defaultCenter, setDefaultCenter] = useState({ lat: 0, lng: 0 });
  const BaseUrl = process.env.REACT_APP_API_URL
  const [alertsidebardata, setAlertSidebardata] = useState([]);
  const [poleId, setPoleId] = useState();
  const [map, setMap] = useState(null); 
  const [zoom, setZoom] = useState(13); 
  const polesInBoundary = useSelector(state => state.polesInBoundary);
  const location = useLocation();
  const { role } = location.state || {};
  const companyView = useSelector(selectUser);
  const today = moment().format('YYYY-MM-DD');
  const morningStartTime = moment(today).format('YYYY-MM-DD');
  const eveningEndTime = moment(today).format('YYYY-MM-DD');
  const [clickedRowData, setClickedRowData] = useState(null);;
  const dispatch = useDispatch();

  useEffect(() => {
    if (map && locations && locations?.length > 0) {
      const totalLat = locations?.reduce((sum, pole) => sum + parseFloat(pole['location_lat ']), 0);
      const totalLng = locations?.reduce((sum, pole) => sum + parseFloat(pole['location_lng']), 0);
      const avgLat = totalLat / locations?.length;
      const avgLng = totalLng / locations?.length;
      setDefaultCenter({ lat: avgLat, lng: avgLng });
      if (map) {
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach(location => {
          bounds.extend(new window.google.maps.LatLng(parseFloat(location['location_lat ']), parseFloat(location['location_lng'])));
        });
        const newZoom = getZoomLevel(bounds);
        setZoom(newZoom);
      }}else if (seleProp && 
      !isNaN(parseFloat(seleProp.location_lat)) && 
      !isNaN(parseFloat(seleProp.location_lng))) {
setDefaultCenter({ lat: parseFloat(seleProp.location_lat), lng: parseFloat(seleProp.location_lng) });
}
  }, [map,locations, seleProp]);

  useEffect(() => {
    if( propertylocations && propertylocations?.list && propertylocations?.list?.length > 0) {
      const propertylocationsdata = propertylocations?.list;
      const totalLat = propertylocationsdata?.reduce((sum, pole) => sum + parseFloat(pole?.location_lat), 0);
      const totalLng = propertylocationsdata?.reduce((sum, pole) => sum + parseFloat(pole?.location_lat), 0);
      const avgLat = totalLat / propertylocations?.list?.length;
      const avgLng = totalLng / propertylocations?.list?.length;
      setDefaultCenter({ lat: avgLat, lng: avgLng });
      if (map) {
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach(location => {
          bounds.extend(new window.google.maps.LatLng(parseFloat(location.location_lat), parseFloat(location.location_lat)));
        });
        const newZoom = getZoomLevel(bounds);
        setZoom(newZoom);
      }
     }
  }, [propertylocations]);


  const getZoomLevel = (bounds) => {
    const GLOBE_WIDTH = 256; 
    const ZOOM_MAX = 9;
    const ZOOM_MIN = 0; 
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const latFraction = (ne.lat() - sw.lat()) / 180;
    const lngDiff = ne.lng() - sw.lng();
    const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;
    const latZoom = Math.floor(Math.log2(1 / latFraction));
    const lngZoom = Math.floor(Math.log2(1 / lngFraction));
    const zoom = Math.min(latZoom, lngZoom, ZOOM_MAX);
    return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom));
  };

  useEffect(()=>{
    handleClickedRowData();
  },[clickedRowData])

    const handleClickedRowData = (rowData) => {
      setClickedRowData(rowData);
      if (clickedRowData?.location_lat && clickedRowData?.location_lng) {
        const lat = parseFloat(clickedRowData?.location_lat);
        const lng = parseFloat(clickedRowData?.location_lng);
        setDefaultCenter({ lat: lat, lng: lng });
        setZoom(20);
    };
    };
  useEffect(() => {
    setIsLoaded(true);
 }, []);
 
  const customMarkerIcon = {
    url: customMarkerIconUrl,
  };

  const customMarkerAlertIcon = {
    url: customMarkerAlertIconUrl,
  };

 const handleInfoClose = () => {
    setSelectedMarker(null);
  };

  const handleInfo1Close = () => {
    setSelectedMarker(null);

  };

 const handleZoomChanged = () => {
    if (map) {
      const newZoom = map.getZoom(); 
      const center = map.getCenter().toJSON(); 
      try {
        const bounds = map.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast(); 
          const sw = bounds.getSouthWest(); 
          const polesInBoundary = locations?.filter(pole => {
            const lat = parseFloat(pole['location_lat ']);
            const lng = parseFloat(pole['location_lng']);
            return lat >= sw.lat() && lat <= ne.lat() && lng >= sw.lng() && lng <= ne.lng();
          });
          dispatch(setPolesInBoundary(polesInBoundary));
          setPolesInBoundary(polesInBoundary);
        } else {
          console.warn('Bounds not available.');
        }
      } catch (error) {
        console.error('Error getting boundary:', error);
      }
      setZoom(newZoom);
    }
  };

  const handleMarkerClick = (location, marker, poleId) => {
    setIsSidebarOpen(false);
    setPoleId(poleId);
    const pole_id = location?.id;
    setSelectedMarker(marker);
    setSelectedProperty(seleProp?.id);
    setAlertSidebardata(null);
    if (seleProp && seleProp?.id) {
      dispatch(fetchMapPoleDataStart(seleProp?.id));
      const params = new URLSearchParams();
      params.append('pole_id', pole_id);
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };
     axios.get(`${BaseUrl}/api/vec_alert/listbypole`, {
          params: {
            property_id: seleProp?.id,
            pole_id: pole_id,
          },
          headers: headers,
        })
        .then((res) => {
          const { data } = res?.data;
          if (res.data.code === 200) {
            dispatch(fetchMapPoleDataSuccess(data));
          
          } else {
            dispatch(fetchMapPoleDataFailure(data?.msg));
          }
        })
        .catch((err) => {
          dispatch(fetchMapPoleDataFailure('Failed to fetch data'));
        })
        .finally(() => {
          setLoading(false); 
        });
    } else {   
    }
    setTimeout(() => {
    }, 20000);
  };

  const onLoad = (map) => {
    setMap(map);
  }
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const mapStyles = {
    height: '82vh',
    width: '100%',
    borderRadius: '10px',
  };
 
  const mapOptions = {
    mapTypeControl: false,
    zoomControl: true,
    streetViewControl: false, // Disable Street View control
    fullscreenControl: false, // Disable Fullscreen control
    minZoom: 11,
    styles: [
      { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      { featureType: 'administrative', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      { featureType: 'all', elementType: 'all', stylers: [{ hue: '#84bef1' }] },
    ],
  };

  return (
    <>
    <Container maxWidth="xxl">
    <HeaderLayout >
      <div> 
        {isLoaded && (
          <LoadScript googleMapsApiKey="AIzaSyAmaZMMaAgoUxEmbWdg1Xv0d2dSibZcZs8" >
            <GoogleMap mapContainerStyle={mapStyles}
              onLoad={onLoad}  onUnmount={onUnmount}
              zoom={zoom} center={defaultCenter} options={mapOptions} onZoomChanged={handleZoomChanged} >
              {locations?.map((location, index) => (
                <Marker   key={index}
                  position={{ lat: Number(location["location_lat "]), lng: Number(location["location_lng"]) }}
                  icon={location?.alert_count_list?.unresolved_alert_num !== 0 ? customMarkerAlertIcon : customMarkerIcon}
                  label={{
                    text: location?.alert_count_list?.unresolved_alert_num > 0 ? String(location?.alert_count_list?.unresolved_alert_num) : ''.toString,
                    color: "white", 
                  }}
                  onClick={() => handleMarkerClick(location, index, location?.name)}
                />
              ))}

              <Box sx={{ paddingTop: "20px", paddingX: "20px" }}>
                <MapListSidebar polesInBoundaryData={polesInBoundary} setClickedRowData={handleClickedRowData}  role={1} />
              </Box>
               <MapSidebar1 />
              {selectedMarker === 0 || selectedMarker > 0 ? (
                <AlertSidebar selectedMarker={1} onClose={() => setSelectedMarker(null)} poleId={poleId} />
              ) : (
                <></>
              )}
            </GoogleMap>
          </LoadScript>
        )}
      </div>  
      </HeaderLayout> 
      </Container>
       </>
  );
};

const Map = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [selectedProperty, setSelectedProperty] = useState("");
  const responsePoleData = useSelector(selectResponseData);
  const property = useSelector(selectPropertyResponseData);
  const BaseUrl = process.env.REACT_APP_API_URL;
  const seleProp = useSelector(selectedPropertyByUser);
  const navigate = useNavigate();
  const today = moment().format('YYYY-MM-DD');
  const morningStartTime = moment(today).format('YYYY-MM-DD');
  const eveningEndTime = moment(today).format('YYYY-MM-DD');

  useEffect(() => {
    dispatch(fetchMapListDataStart());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDataStart());
  }, [dispatch]);
 
  useEffect(() => {
    if (seleProp?.id) {
      dispatch(fetchDataStart(seleProp?.id));
      try {
        axios.get(
          `${BaseUrl}/api/vec_alert/pole?property_id=${seleProp?.id}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${token}`
            }
          }
        ).then((res) => {
          const { data } = res?.data;
          if (res?.data?.code === 200) {
            dispatch(fetchDataSuccess(data));
   
            dispatch(setPolesInBoundary(data));
          } else {
            dispatch(fetchDataFailure(data.msg));

          }
        }).catch((err) => {
          dispatch(fetchDataFailure('Failed to fetch data'));
        });
      } catch (error) {
        dispatch(fetchDataFailure(error.message));
      }
    }
  }, [seleProp, dispatch, token, morningStartTime, eveningEndTime]);

  return (
    <div>
      <MapContainer locations={responsePoleData} propertylocations={property}     />
    </div>
  );
};

export default Map;




