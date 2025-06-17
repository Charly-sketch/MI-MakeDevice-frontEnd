import { Box, CssBaseline, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";

export default function TabSwitch(props: { setViewable: (number) => void }) {
  const { setViewable } = props;

  const [tabValue, setTabValue] = useState(1); // default is 1 for programming

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    setViewable(newValue);
  };

  return (
    <Box
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
      }}
      component="div"
    >
      <Tabs
        value={tabValue}
        onChange={handleChange}
        variant="fullWidth"
        centered
        indicatorColor="primary"
        textColor="inherit"
      >
        <Tab label="Programming" />
        <Tab label="Layout" />
        <Tab label="Case" />
        {/* <Tab label="Enclosures" /> */}
        <Tab label="Testing" />
      </Tabs>
    </Box>
  );
}
