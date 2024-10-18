import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ background, icon, title, mainValue, subValue, subLabel, percentage, percentageLabel, peakTime, commonStyles }) => (
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="subtitle2" color="white" sx={{ fontSize: '14px', ...commonStyles }}>
            {title}
          </Typography>
          <Typography variant="h1" color="white" style={{ fontSize: '30px', fontWeight: "bold",...commonStyles }}>
            {mainValue}
          </Typography>
        </div>
        <div>
          <img src={icon} width="30px" style={{ fill: "white" }} alt="" />
        </div>
      </div>
    </CardContent>
    <CardContent sx={{ height: '50%', paddingX: '15px', paddingTop: "10px", paddingBottom: "5px !important", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h3" color="white" style={{ fontSize: '20px',...commonStyles }}>
            {subValue}
          </Typography>
          <Typography variant="subtitle2" color="white" sx={commonStyles}>
            7 days ago
          </Typography>
        </div>
        {peakTime && (
          <div>
            <Typography variant="h3" color="white" style={{ fontSize: '15px',...commonStyles }}>
              {peakTime}
            </Typography>
            <Typography variant="subtitle2" color="white" sx={commonStyles}>
              Peak Time
            </Typography>
          </div>
        )}
        <div>
          <Typography variant="subtitle2" color="white" style={{ textAlign: "right",...commonStyles }}>
            {percentage}%
          </Typography>
          <Typography variant="subtitle2" color="white" sx={commonStyles}>
            Difference
          </Typography>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
