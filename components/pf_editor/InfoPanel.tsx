import React, { useState } from "react"

import { Box, Tab, Tabs, Typography } from "@mui/material"
import ModuleInfo from "./ModuleInfo"
import PFSettings from "./PFSettings";
import ModuleList from "./ModuleList";
import JacdacBus from "./JacdacBus";

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box component='div' sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


export default function InfoPanel(props: { lastClicked, lockOrbit, setLockOrbit }) {
    const { lastClicked, lockOrbit, setLockOrbit } = props

    const [value, setValue] = useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    return (
        <>
           
            <Box component='div' sx={{ width: '100%' }}>
              <Box component='div' sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Module Info" {...a11yProps(0)} />
                  <Tab label="Settings" {...a11yProps(1)} />
                  <Tab label="JacdacBus" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                {
                  lastClicked ? <ModuleInfo lastClicked={lastClicked} /> : "Select a module"
                }
                
              </TabPanel>
              <TabPanel value={value} index={1}>
                <PFSettings lockOrbit={lockOrbit} setLockOrbit={setLockOrbit} snapAmount={undefined} setSnapAmount={undefined}></PFSettings>
              </TabPanel>

              <TabPanel value={value} index={2}>
                <JacdacBus></JacdacBus>
              </TabPanel>

            

            </Box>


        </>
    )
}



interface TabPanelProps {
  children?: React.ReactNode;
  index: number ;
  value: number | string;
}



