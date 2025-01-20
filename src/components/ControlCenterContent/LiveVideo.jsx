import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/apiResponse/loginApiSlice";
import { Box, CircularProgress } from "@mui/material";
const LiveVideo = ({ cameraId }) => {
  const [webrtcUrl, setWebrtcUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const peerRef = useRef(null); // Added peer reference for WebRTC connection
  const BaseUrl = process.env.REACT_APP_API_URL;
  const PublicUrl = process.env.PUBLIC_URL;
  const token = useSelector(selectToken);

  const handleError = (e) => {
    e.target.src = `${PublicUrl}/assets/images/novideo.png`;
    e.target.alt = "No Image";
  };

  useEffect(() => {
    const fetchWebrtcUrl = async () => {
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

        if (response.data.code === 200) {
          setWebrtcUrl(response.data.data.webrtcUrl);
        } else {
          console.error("Error: Unexpected API response", response.data);
        }
      } catch (error) {
        console.error("Error fetching camera data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebrtcUrl();
  }, [BaseUrl, token, cameraId]);

  useEffect(() => {
    let player=null;
    if (window.ZLMRTCClient && webrtcUrl!=="") {
     
      player = new window.ZLMRTCClient.Endpoint(
        {
            element: videoRef.current,
            debug: true,// 是否打印日志
            zlmsdpUrl:webrtcUrl,//流地址
            simulcast:false,
            useCamera:true,
            audioEnable:true,
            recvOnly:true,
            videoEnable:true,
            resolution:{w:1280,h:720},
            usedatachannel:false,
        }
    );
    
    player.on(window.ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR,function(e)
    {
      // ICE 协商出错
      console.log('ICE 协商出错');
    });

    player.on(window.ZLMRTCClient.Events.WEBRTC_ON_REMOTE_STREAMS,function(e)
    {
      //获取到了远端流，可以播放
      console.log('播放成功',e.streams);
    });

    player.on(window.ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED,function(e)
    {
      // offer anwser 交换失败
      console.log('offer anwser 交换失败',e);
    });

    

    player.on(window.ZLMRTCClient.Events.CAPTURE_STREAM_FAILED,function(s)
    {
      // 获取本地流失败
      console.log('获取本地流失败',"failed");
    });

    player.on(window.ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE,function(state)
    {
      // RTC 状态变化 ,详情参考 https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
      console.log("player",player);
      console.log('当前状态==>',state);
    });

    player.on(window.ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_OPEN,function(event)
    {
      console.log('rtc datachannel 打开 :',event);
    });

    
    player.on(window.ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_ERR,function(event)
    {
      console.log('rtc datachannel 错误 :',event);
    });
    player.on(window.ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_CLOSE,function(event)
    {
      console.log('rtc datachannel 关闭 :',event);
    });
    console.log("testing");
    
   
    }
  }, [webrtcUrl]);

  return (
    <div style={{ textAlign: "center" }}>
    {loading ? (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "250px",backgroundColor:"#333333",width:"100%" }}>
         <CircularProgress  style={{color:"#000",}}/>
      </div>
    ) : (
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
      autoPlay
      onError={handleError}
    />
        
    )}
  </div>
  
  );

  
};

export default LiveVideo;
