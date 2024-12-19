import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import flv from 'flv.js';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../redux/apiResponse/loginApiSlice';

const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL;

const LiveVideo = ({ cameraId }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const videoRef = useRef(null);
  const [flvPlayer, setFlvPlayer] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showNoStreamMessage, setShowNoStreamMessage] = useState(false);
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${BaseUrl}/api/camera/play`,
          { camera_id: cameraId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        setAlertData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching camera data:', error);
      }
    };

    fetchData();
  }, [BaseUrl, token, cameraId]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !flv.isSupported() || !alertData?.data?.flvUrl) {
      setShowNoStreamMessage(true);
      return;
    }

    const player = flv.createPlayer({
      type: 'flv',
      url: alertData.data.flvUrl,
    });

    player.attachMediaElement(videoElement);
    player.load();

    player.on(flv.Events.ERROR, (errorType, errorDetail) => {
      console.error('FLV.js Error:', errorType, errorDetail);
      setShowNoStreamMessage(true);
    });

    videoElement.addEventListener('canplaythrough', () => {
      setVideoReady(true);
    });

    setFlvPlayer(player);

    return () => {
      player.unload();
      player.detachMediaElement();
      player.destroy();
    };
  }, [alertData?.data?.flvUrl]);

  const handleError = (e) => {
    e.target.src = `${PublicUrl}/assets/images/novideo.png`;
    e.target.alt = "No Image";
  };

  return (
    <Box sx={{ padding: "0px !important" }}>
      {showNoStreamMessage ? (
       
        <Box
        component="video"
        ref={videoRef}
        width="100%"
        sx={{
          height: "255px",
          borderRadius: '10px',
          objectFit: 'cover',
        }}
        controls
        onError={handleError}
      />
 
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={`${PublicUrl}/assets/images/novideo.png`}
          alt="No Video"
          style={{ width: "92%", height: "80%", objectFit: "cover" }}
        />
      </div>
         )}
  </Box>
  );
};

export default LiveVideo;
