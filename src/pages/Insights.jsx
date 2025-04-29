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
  const [dateRange, setDateRange] = useState({ latestStartDate: "", latestEndDate: "" });
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
      let startDate, endDate;
      let previousStartDate, previousEndDate, latestStartDate, latestEndDate;

      if (range === "D") {
        // Day: Yesterday & Today
        previousStartDate = moment().subtract(1, "days").format("YYYY-MM-DD");
        previousEndDate = moment().subtract(1, "days").format("YYYY-MM-DD");
        latestStartDate = today;
        latestEndDate = today;
      }
      else if (range === "W") {
        // Week
        const currentDay = moment().day(); 
        const lastSunday = moment().subtract(7 + currentDay, "days").startOf("day"); 
        const lastSaturday = moment(lastSunday).add(6, "days");        
        const thisSunday = moment().subtract(currentDay, "days").startOf("day"); 

        // Cards: Last week (last Sunday - last Saturday)
        previousStartDate = lastSunday.format("YYYY-MM-DD");
        previousEndDate = lastSaturday.format("YYYY-MM-DD");

        // Charts: This week (This Sunday - Current Date)
        latestStartDate = thisSunday.format("YYYY-MM-DD");
        latestEndDate = today;
      }
      else if (range === "M") {
        // Month
        const currentMonth = moment().month() + 1; 

        // Cards: Last month (March 1 - March 31)
        previousStartDate = moment().month(2).startOf("month").format("YYYY-MM-DD"); 
        previousEndDate = moment().month(2).endOf("month").format("YYYY-MM-DD"); 

        // Charts: This month (April 1 - Current Date)
        latestStartDate = moment().month(3).startOf("month").format("YYYY-MM-DD"); 
        latestEndDate = today;
      }
      else if (range === "Y") {
        // Year
        const currentYear = moment().year();
        const lastYear = currentYear - 1;

        // Cards: Last year (01-01-24 to 31-12-24)
        previousStartDate = moment(`${lastYear}-01-01`).format("YYYY-MM-DD");
        previousEndDate = moment(`${lastYear}-12-31`).format("YYYY-MM-DD");

        // Charts: This year (01-01-25 to Current Date)
        latestStartDate = moment(`${currentYear}-01-01`).format("YYYY-MM-DD");
        latestEndDate = today;
      }

      setDateRange({ previousStartDate, previousEndDate, latestStartDate, latestEndDate });
      localStorage.setItem("selectedRange", range);
      localStorage.setItem(
        "dateRange",
        JSON.stringify({ previousStartDate, previousEndDate, latestStartDate, latestEndDate })
      );

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
                value={isCustomRangeSelected ? [dayjs(dateRange.latestStartDate), dayjs(dateRange.latestEndDate)] : null}
                disabledDate={(current) => current && current > dayjs()}
                onChange={(dates) => {
                  if (dates) {
                    const latestStartDate = dates[0].format("YYYY-MM-DD");
                    const latestEndDate = dates[1].format("YYYY-MM-DD");
                
                    // Immediately reflect in UI
                    setIsCustomRangeSelected(true);
                    setDateRange((prev) => ({ ...prev, latestStartDate, latestEndDate }));
                
                    setLoading(true);
                    setTimeout(() => {
                      const diffDays = dayjs(latestEndDate).diff(dayjs(latestStartDate), "days");
                
                      const previousStartDate = dayjs(latestStartDate)
                        .subtract(diffDays + 1, "days")
                        .format("YYYY-MM-DD");
                      const previousEndDate = dayjs(latestEndDate)
                        .subtract(diffDays + 1, "days")
                        .format("YYYY-MM-DD");
                
                      setDateRange({
                        previousStartDate,
                        previousEndDate,
                        latestStartDate,
                        latestEndDate,
                      });
                
                      localStorage.setItem(
                        "dateRange",
                        JSON.stringify({
                          previousStartDate,
                          previousEndDate,
                          latestStartDate,
                          latestEndDate,
                        })
                      );
                
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
                      setIsCustomRangeSelected(false); 
                      setDateRange({ startDate: "", endDate: "" }); 
                      updateDateRange(range);
                    }}
                    sx={{
                      ...commonStyles,
                      backgroundColor: isCustomRangeSelected
                        ? "#fff" 
                        : selectedRange === range
                          ? "#52a1cc8b" 
                          : "#fff", 
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
                  <Overview dateRange={dateRange} isCustomRangeSelected={isCustomRangeSelected} selectedRange={selectedRange} customDates={customDates} />
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                  <SystemStats dateRange={dateRange} isCustomRangeSelected={isCustomRangeSelected} selectedRange={selectedRange} customDates={customDates} />
                </TabPanel>
                <TabPanel value={selectedTab} index={2}>
                  <Incident dateRange={dateRange} isCustomRangeSelected={isCustomRangeSelected} selectedRange={selectedRange} customDates={customDates} />
                </TabPanel>
                <TabPanel value={selectedTab} index={3}>
                  <TrafficComponent dateRange={dateRange} isCustomRangeSelected={isCustomRangeSelected} selectedRange={selectedRange} customDates={customDates} />
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
