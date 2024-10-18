import { Box, Typography } from '@mui/material';
import ReactPlayer from 'react-player';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';



const CameraVideo = ({ data }) => {
  const dispatch = useDispatch();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
    
      setHasFetched(true);
    }
  }, [dispatch, hasFetched]);

  return (
    <>
     
      <Box sx={{ padding: "0px !important", "&.css-19kzrtu": { padding: "0px !important" }, height: "50vh" }}>
        {data && (
          <video controls width="100%" height="100%" style={{ borderRadius: "10px", padding: "0px !important", "&.css-19kzrtu": { padding: "0px !important" },objectFit:"cover" }}>
            <source src={data?.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </Box>
    </>
  )
}

export default CameraVideo;
