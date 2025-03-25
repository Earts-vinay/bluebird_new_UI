import React, { useState, useEffect } from "react";
import { Box, Container, Tabs, Tab, Button } from "@mui/material";
import { DatePicker } from "antd";
import moment from "moment";
import Overview from "../components/InsightsContent/Overview";
import SystemStats from "../components/InsightsContent/SystemStats";
import Incident from "../components/InsightsContent/Incident";
import TrafficComponent from "../components/InsightsContent/TrafficComponent";
import HeaderLayout from "../components/customStyles/HeaderLayout";
import Loader from "../components/Loader";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const commonStyles = { fontFamily: "montserrat-regular" };

const TabPanel = ({ value, index, children }) => (
  <div hidden={value !== index}>{value === index && <Box p={0}>{children}</Box>}</div>
);

const Insights = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRange, setSelectedRange] = useState("W");
  const [customDates, setCustomDates] = useState("W");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [loading, setLoading] = useState(false);
  const [isCustomRangeSelected, setIsCustomRangeSelected] = useState(false);

  useEffect(() => {
    const storedRange = localStorage.getItem("selectedRange");
    if (storedRange) {
      setSelectedRange(storedRange);
      updateDateRange(storedRange);
    } else {
      updateDateRange("W");
    }
  }, []);

  const updateDateRange = (range) => {
    setLoading(true);
    setTimeout(() => {
      const today = moment().format("YYYY-MM-DD");
      let startDate = today;
      let endDate = today;

      if (range === "D") {
        startDate = moment().subtract(1, "days").format("YYYY-MM-DD");
      } else if (range === "W") {
        startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
      } else if (range === "M") {
        startDate = moment().subtract(1, "month").format("YYYY-MM-DD");
      } else if (range === "Y") {
        startDate = moment().subtract(1, "year").format("YYYY-MM-DD");
      }

      setDateRange({ startDate, endDate });
      localStorage.setItem("selectedRange", range);
      localStorage.setItem("dateRange", JSON.stringify({ startDate, endDate }));
      setLoading(false);
    }, 1000);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="xxl">
      <HeaderLayout>
        <Box
          sx={{
            borderRadius: "10px",
            paddingLeft: "20px",
            paddingTop: "26px",
            height: "75.5vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box
              sx={{
                backgroundColor: "#fff",
                width: "550px",
                borderRadius: "5px",
                boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)",
                marginBottom: "10px",
                height: "40px",
              }}
            >
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                sx={{
                  ".MuiTabs-flexContainer": {
                    height: "40px",
                    ...commonStyles,
                  },
                }}
                TabIndicatorProps={{ style: { display: "none" } }}
              >
                {["Overview", "System Stats", "Incident Response", "Traffic & Activity"].map(
                  (label, index) => (
                    <Tab
                      key={index}
                      label={label}
                      sx={{
                        textTransform: "capitalize",
                        backgroundColor: selectedTab === index ? "#52a1cc8b" : "inherit",
                        color: "#000 !important",
                        minHeight: "30px",
                        margin: "5px",
                        borderRadius: "5px",
                        fontWeight: "light",
                      }}
                    />
                  )
                )}
              </Tabs>
            </Box>

            <Box display="flex" alignItems="center" sx={{ paddingRight: "30px", gap: "10px" }}>
            <RangePicker
  disabledDate={(current) => current && current > dayjs()}
  onChange={(dates) => {
    if (dates) {
      setLoading(true);
      setIsCustomRangeSelected(true);

      setTimeout(() => {
        const startDate = dates[0].format("YYYY-MM-DD");
        const endDate = dates[1].format("YYYY-MM-DD");

        // Calculate the difference in days
        const diffDays = dayjs(endDate).diff(dayjs(startDate), "days");

        // Set type conditionally
        const customType = diffDays >= 30 ? "month" : "date";

        setDateRange({ startDate, endDate });
        setCustomDates(customType); // Store this in state
        setLoading(false);
      }, 1000);
    }
  }}
  style={{ marginLeft: "10px" }}
/>


              <Box sx={{ border: "1px solid #ccc", borderRadius: "5px" }}>
                {["D", "W", "M", "Y"].map((range) => (
                  <Button
                    key={range}
                    onClick={() => {
                      setSelectedRange(range);
                      setIsCustomRangeSelected(false); // Reset custom range selection
                      updateDateRange(range);
                    }}
                    sx={{
                      ...commonStyles,
                      backgroundColor: isCustomRangeSelected
                        ? "#fff" // When custom range is selected, buttons remain white
                        : selectedRange === range
                          ? "#52a1cc8b" // When button is selected, it turns blue
                          : "#fff", // Default white
                      color: "#000",
                      border: "none",
                      minWidth: "40px",
                      height: "30px",
                      fontWeight: "bold",
                      transition: "background-color 0.3s ease-in-out",
                    }}
                    disabled={loading}
                  >
                    {range}
                  </Button>
                ))}
              </Box>

            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: "auto", paddingRight: "20px" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "88%" }}>
                <Loader size={50} sx={{ color: "#52a1cc" }} />
              </Box>
            ) : (
              <>
                <TabPanel value={selectedTab} index={0}>
                  <Overview dateRange={dateRange} isCustomRangeSelected={isCustomRangeSelected} selectedRange={selectedRange} customDates={customDates}/>
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                  <SystemStats dateRange={dateRange} isCustomRangeSelected={isCustomRangeSelected} selectedRange={selectedRange} customDates={customDates}/>
                </TabPanel>
                <TabPanel value={selectedTab} index={2}>
                  <Incident dateRange={dateRange} isCustomRangeSelected={isCustomRangeSelected} selectedRange={selectedRange} customDates={customDates}/>
                </TabPanel>
                <TabPanel value={selectedTab} index={3}>
                  <TrafficComponent dateRange={dateRange} isCustomRangeSelected={isCustomRangeSelected} selectedRange={selectedRange} customDates={customDates}/>
                </TabPanel>
              </>
            )}
          </Box>
        </Box>
      </HeaderLayout>
    </Container>
  );
};

export default Insights;
