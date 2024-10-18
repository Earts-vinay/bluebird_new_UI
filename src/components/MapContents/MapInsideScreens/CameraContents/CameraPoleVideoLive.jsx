import React, { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import flv from 'flv.js';
import { useDispatch, useSelector } from 'react-redux';
import { getdeviceplay } from "../../../../redux/apiResponse/vecalertSlice";

const PublicUrl = process.env.PUBLIC_URL

const CameraPoleVideoLive = ({ data }) => {
  const dispatch = useDispatch();
  const deviceplaylivestram = useSelector((state) => state.VecAlert.deviceplaylivestram);
  const videoRef = useRef(null);
  const [flvPlayer, setFlvPlayer] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showNoStreamMessage, setShowNoStreamMessage] = useState(false);

  useEffect(() => {
    
    const camera_id = data?.data?.camera.id;
    dispatch(getdeviceplay({ camera_id: camera_id }));
    const videoElement = videoRef.current;
    if (videoElement && flv.isSupported() && deviceplaylivestram?.flvUrl) {
      const player = flv.createPlayer({
        type: 'flv',
        url: deviceplaylivestram.flvUrl,
      });
      player.attachMediaElement(videoElement);
      player.load();
      setFlvPlayer(player);

      videoElement.addEventListener('canplaythrough', () => {
        setVideoReady(true);
      });

      return () => {
        player.destroy();
      };
    } else {
      setShowNoStreamMessage(true); 
    }
  }, [dispatch, deviceplaylivestram?.flvUrl, data?.data?.camera.id]);

  useEffect(() => {
    if (videoReady && flvPlayer) {
      flvPlayer.play();
    }
  }, [videoReady, flvPlayer]);

  return (
    <Box sx={{ padding: "0px !important", height: "57vh" }}>
      {showNoStreamMessage ? (
        <div style={{display:"flex",justifyContent:"center"}}>
          <img
        src={PublicUrl + "/assets/images/novideo.png"} 
        alt="No Image"
        style={{ width: "92%", height: "80%", objectFit: "cover" }}
      /></div>
      ) : (
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          controls
          style={{ borderRadius: "10px",objectFit:"cover" }}
        ></video>
      )}
      <Button variant="outlined" color="error" sx={{
        position: "absolute",
        bottom: "10px",
        right: "10px",
        zIndex: 1,
      }}>
        Live
      </Button>
    </Box>
  );
};

export default CameraPoleVideoLive;
