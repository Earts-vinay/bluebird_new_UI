// import React, { useEffect, useRef, useState } from 'react';
// import { Box, Button } from '@mui/material';
// import flv from 'flv.js'; // Import flv.js
// import { useDispatch, useSelector } from 'react-redux';
// import { getdeviceplay } from '../../redux/apiResponse/vecalertSlice';

// const LiveVideo = ({ cameraId }) => {
//   const dispatch = useDispatch();
//   const deviceplaylivestram = useSelector((state) => state.VecAlert.deviceplaylivestram);
//   const videoRef = useRef(null); // Ref for the video element
//   const [flvPlayer, setFlvPlayer] = useState(null); // State to track FLV player instance
//   const [videoReady, setVideoReady] = useState(false); // State to track video readiness
//   const [userInteracted, setUserInteracted] = useState(false); // State to track user interaction
//   const [showNoStreamMessage, setShowNoStreamMessage] = useState(false);

//   useEffect(() => {
//     dispatch(getdeviceplay({ camera_id: cameraId }));
//   }, [dispatch, cameraId]);


//   useEffect(() => {
//     if (videoReady && flvPlayer) {
//       flvPlayer.play();
//     }
//   }, [videoReady, flvPlayer]);

//   useEffect(() => {

//     const videoElement = videoRef.current;
//     if (videoElement && flv.isSupported() && deviceplaylivestram?.flvUrl) {
//       const player = flv.createPlayer({
//         type: 'flv',
//         url: deviceplaylivestram.flvUrl, // Use the FLV URL from your API response
//       });
//       player.attachMediaElement(videoElement);
//       player.load();
//       setFlvPlayer(player);

//       videoElement.addEventListener('canplaythrough', () => {
//         setVideoReady(true); // Set videoReady to true when video is ready to play
//       });

//       return () => {
//         player.destroy(); // Cleanup FLV player when component unmounts
//       };
//     }else{
//       setShowNoStreamMessage(true);
//     }
//   }, [deviceplaylivestram?.flvUrl]);

//   return (
//     <Box sx={{ padding: "0px !important",  }}>
//       {showNoStreamMessage ? (
//         <video
//           ref={videoRef}
//           width="100%"
//           height="100%"
//           controls
//           style={{ borderRadius: "10px" }}
//           onClick={() => setUserInteracted(true)}
//         ></video>
//       ):(
//         <div style={{display:"flex",justifyContent:"center"}}>
//           <img
//         src="/assets/images/novideo.png" // Provide a placeholder image path
//         alt="No Image"
//         style={{ width: "92%", height: "80%", objectFit: "cover" }}
//       /></div>
//       )}
//       <Button
//         variant="outlined"
//         color="error"
//         sx={{
//           position: "absolute",
//           bottom: "10px",
//           right: "10px",
//           zIndex: 1,
//         }}
//         // onClick={handlePlay} // Trigger video playback on button click
//         disabled={!userInteracted} // Disable button until user interacts with the video
//       >
//         Live
//       </Button>
//     </Box>
//   );
// };

// export default LiveVideo;


import React, { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import flv from 'flv.js'; // Import flv.js
import { useDispatch, useSelector } from 'react-redux';
import { getdeviceplay } from '../../redux/apiResponse/vecalertSlice';
import { logDOM } from '@testing-library/react';
import axios from "axios";
import { selectToken } from '../../redux/apiResponse/loginApiSlice';

const BaseUrl = process.env.REACT_APP_API_URL;
const PublicUrl = process.env.PUBLIC_URL

const LiveVideo = ({ cameraId }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const deviceplaylivestram = useSelector((state) => state.VecAlert.deviceplaylivestramList);
  const videoRef = useRef(null); // Ref for the video element
  const [flvPlayer, setFlvPlayer] = useState(null); // State to track FLV player instance
  const [videoReady, setVideoReady] = useState(false); // State to track video readiness
  const [userInteracted, setUserInteracted] = useState(false); // State to track user interaction
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
                `${BaseUrl}/api/device/play`,
                { camera_id: cameraId },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded", // Set content type to form data
                  },
                }
            );
            setAlertData(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching camera data:', error);
            // Handle error...
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
        url: alertData.data?.flvUrl, // Use the FLV URL from your API response
      });
      player?.attachMediaElement(videoElement);
      player?.load();
      setFlvPlayer(player);

      videoElement.addEventListener('canplaythrough', () => {
        setVideoReady(true); // Set videoReady to true when video is ready to play
      });

      return () => {
        player?.destroy(); // Cleanup FLV player when component unmounts
      };
    } else {
      setShowNoStreamMessage(true);
    }
  }, [alertData?.data?.flvUrl]);

  const handlePlay = () => {
    const videoElement = videoRef?.current;
    if (userInteracted && flvPlayer && videoElement) {
      videoElement?.play().catch((error) => {
        // Handle the play() promise rejection
        console.error('Failed to play video:', error);
      });
    }
  };

  const handleError = (e) => {
    e.target.src = `${PublicUrl}/assets/images/novideo.png`;
    e.target.alt = "No Image";
};

  return (
    <Box sx={{ padding: "0px !important",   }}>
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
       onClick={handlePlay}
       onError={(e) => {
        e.target.src = `${PublicUrl}/assets/images/noimage.png`;
        e.target.alt = "No Image";
      }}
     ></Box>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={PublicUrl + "/assets/images/novideo.png"} // Provide a placeholder image path
            alt="No Image"
            style={{ width: "92%", height: "80%", objectFit: "cover" }}
          />
        </div>
      )}
   
    </Box>
  );
};

export default LiveVideo;
