import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ background, icon, title, mainValue, subValue, subLabel,previousPeakDate, percentage,peakDate, percentageLabel, peakTime, previousPeakTime, commonStyles, daysago }) => (
  <Card
    sx={{
      borderRadius: '10px',
      background: background,
      boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)",
      backdropFilter: "blur(20px)",
      opacity: "0.9",
      border: '1px solid white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    }}
  >
    <CardContent sx={{ height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

      <Typography variant="subtitle2" color="white" sx={{ fontSize: '14px', ...commonStyles }}>
        {title}
      </Typography>
      <Box sx={{display:'flex',justifyContent:"space-between"}}>
    
      <Box sx={{ display: "flex",flexDirection:"column", alignItems: "start",height:"100px",gap:"32px" }}>
        <Box>
          <Typography variant="h1" color="white" style={{ fontSize: '30px',width:"70px", fontWeight: "bold", ...commonStyles }}>
            {mainValue}
          </Typography>
        </Box>
        <div>
          <Typography variant="h3" color="white" style={{ fontSize: '20px', ...commonStyles }}>
            {subValue}
          </Typography>
          <Typography variant="subtitle2" color="white" sx={commonStyles}>
            {daysago}
          </Typography>
        </div>
   
      </Box>

      <Box sx={{ display: "flex",flexDirection:"column", alignItems: "start",justifyContent:"space-between",height:"85%" }}>
        <Box sx={{height:"30px", width:"80px"}}>
        {peakTime && (
          <div style={{ marginTop:"10px" }}>
            <Typography variant="h3" color="white" style={{ fontSize: '12px', ...commonStyles }}>
              {peakTime}
            </Typography>
        
          </div>
        )}
        </Box>
        <Box sx={{ display: "flex",flexDirection:"column", alignItems: "end",justifyContent:"end", }}>
        {previousPeakTime && (
          <Box sx={{height:"20px",width:"80px",}}>
            <Typography variant="h3" color="white" style={{  fontSize: '12px',height:"26px", ...commonStyles }}>
            {previousPeakTime}
            </Typography>
            <Typography variant="subtitle2" color="white" sx={commonStyles}>
              Peak Time
            </Typography>
          </Box>
        )}
        </Box>
        </Box>

        <Box sx={{ display: "flex",flexDirection:"column", alignItems: "end",height:"100px",gap:"30px" }}>
        <Box>
        <Box sx={{textAlign:"end",width:"30px",height:"40px"}}>
          <img src={icon} width="30px" style={{ fill: "white" }} alt="" />
        </Box>
        </Box>
      
        <div>
          <Typography variant="subtitle2" color="white" style={{ textAlign: "right", ...commonStyles }}>
            {percentage}%
          </Typography>
          <Typography variant="subtitle2" color="white" sx={commonStyles}>
            Difference
          </Typography>
        </div>
        </Box>

        </Box>
    </CardContent>
  </Card>
);

export default StatCard;
