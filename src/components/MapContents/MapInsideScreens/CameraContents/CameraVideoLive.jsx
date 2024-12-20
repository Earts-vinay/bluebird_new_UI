import React, { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import flv from 'flv.js'; // Import flv.js
import { useDispatch, useSelector } from 'react-redux';
import { getdeviceplay } from '../../../../redux/apiResponse/vecalertSlice';
import { logDOM } from '@testing-library/react';
import axios from "axios";
import { selectToken } from '../../../../redux/apiResponse/loginApiSlice';


const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL

const LiveVideo = ({ cameraId }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const deviceplaylivestram = useSelector((state) => state.VecAlert.deviceplaylivestramList);
  const videoRef = useRef(null); 
  const [flvPlayer, setFlvPlayer] = useState(null); 
  const [videoReady, setVideoReady] = useState(false); 
  const [userInteracted, setUserInteracted] = useState(false); 
  const [showNoStreamMessage, setShowNoStreamMessage] = useState(false);
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   dispatch(getdeviceplay({ camera_id: cameraId }));
  // }, [dispatch, cameraId]);

    useEffect(() => {
    if (videoReady && flvPlayer) {
      flvPlayer.play();
    }
  }, [videoReady, flvPlayer]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.post(
                `${BaseUrl}/api/camera/play`,
                { camera_id: cameraId },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded", 
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
}, [BaseUrl, token]);


  useEffect(() => {
    if (videoReady && flvPlayer) {
      flvPlayer.play();
    }
  }, []);
  

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && flv.isSupported() && alertData.data?.flvUrl) {
      const player = flv.createPlayer({
        type: 'flv',
        url: alertData.data?.flvUrl,
      });
      player?.attachMediaElement(videoElement);
      player?.load();
      setFlvPlayer(player);

      videoElement.addEventListener('canplaythrough', () => {
        setVideoReady(true); 
      });

      return () => {
        player?.destroy(); 
      };
    } else {
      setShowNoStreamMessage(true);
    }
  }, [alertData?.data?.flvUrl]);

  const handlePlay = () => {
    const videoElement = videoRef?.current;
    if (userInteracted && flvPlayer && videoElement) {
      videoElement?.play().catch((error) => {
          console.error('Failed to play video:', error);
      });
    }
  };

  const handleError = (e) => {
    e.target.src = `${PublicUrl}/assets/images/novideo.png`;
    e.target.alt = "No Image";
};

  return (
    <Box sx={{ padding: "0px !important", height:"50vh"  }}>
      {showNoStreamMessage ? (
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          
          controls
          style={{ borderRadius: "10px",objectFit:"cover" }}
          onClick={handlePlay}
          onError={handleError}
        ></video>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={PublicUrl + "/assets/images/novideo.png"} 
            alt="No Image"
            style={{ width: "92%", height: "80%", objectFit: "cover" }}
          />
        </div>
      )}
      {/* <Button
        variant="outlined"
        color="error"
        sx={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          zIndex: 1,
        }}
       
        disabled={!userInteracted} 
      >
        Live
      </Button> */}
    </Box>
  );
};

export default LiveVideo;

