import React, { useState } from "react";
import { Box, Container, Tabs, Tab, Typography, IconButton } from "@mui/material";
import Overview from "../components/InsightsContent/Overview";
import SystemStats from "../components/InsightsContent/SystemStats";
import Incident from "../components/InsightsContent/Incident";
import TrafficComponent from "../components/InsightsContent/TrafficComponent";
import RefreshIcon from '@mui/icons-material/Refresh';
import moment from 'moment';
import HeaderLayout from "../components/customStyles/HeaderLayout";

const commonStyles = { fontFamily: "montserrat-regular"};

const TabPanel = ({ value, index, children }) => (
  <div hidden={value !== index}>
    {value === index && (
      <Box p={0}>
        {children}
      </Box>
    )}
  </div>
);

const Insights = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Container maxWidth="xxl" >
      <HeaderLayout >
        
        <Box
         
          sx={{
         
            borderRadius: "10px",
            paddingLeft: "20px",
            paddingTop: "26px",
            height: "75.5vh",
            overflow: "hidden",
           
            
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              width:{lg:"38%",md:"78%",sm:"78%",xs:"100%"},
              borderRadius: "5px",
              boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)",
              marginBottom: "10px",
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                ".MuiTabs-flexContainer": {
                  height: "50px",
                  ...commonStyles
                },
              }}
              TabIndicatorProps={{ style: { display: "none" } }}
            >
              {[
                "Overview",
                "System Stats",
                "Incident Response",
                "Traffic & Activity",
              ].map((label, index) => (
                <Tab
                  key={index}
                  label={label}
                  sx={{
                    textTransform: "capitalize",
                    backgroundColor: selectedTab === index ? "#BCD0F8" : "inherit",
                    color: selectedTab === index ? "black" : "inherit",
                    minHeight: "30px",
                    margin: "5px",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </Tabs>
        
          </Box>
       
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              paddingRight: "20px",
            }}
          >
               <Box display="flex" justifyContent="end" alignItems="center" style={{ paddingRight: "30px !important" }}>
          <Typography variant="body-2">Last Updated {moment().format('HH:mm')}</Typography>
          <IconButton color="primary" >
            <RefreshIcon />
          </IconButton>
        </Box>
            <TabPanel value={selectedTab} index={0}>
              <Overview />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <SystemStats />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <Incident />
            </TabPanel>
            <TabPanel value={selectedTab} index={3}>
              <TrafficComponent />
            </TabPanel>
          </Box>
        </Box>
      </HeaderLayout>
      </Container>
    </>
  );
};

export default Insights;
