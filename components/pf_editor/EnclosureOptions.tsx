// @ts-nocheck
import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Box,
  Tab,
  Tabs,
  Grid,
  FormGroup,
  InputLabel,
  MenuItem,
  NoSsr,
  Select,
  TextField,
} from "@mui/material";
import {
  downloadSTLEnclosure,
  get2DStencil,
  getLidSVG,
  getSTLBlob,
} from "./enclosureFunctions";
import SVGModelCard from "../models/SVGModelCard";
import { generateGerber } from "./generators/generateGerber";
import PressFitBox from "./PressFitBox";
import Enclosure_3dModel from "./enclosurePreview/Enclosure_3dModel";
import Enclosure_TabbedBox from "./enclosurePreview/Enclosure_TabbedBox";
import Enclosure_Stencil from "./enclosurePreview/Enclosure_Stencil";
const STLModelCard = lazy(() => import("../models/STLModelCard"));

const enclosureOptions = {
  exportOptions: {
    format: {
      lid: "svg",
      base: "stl",
    },
  },
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EnclosureOptions(props: {
  enclosureDimensions: { width: number; height: number };
  enclosureOptionsOpen: boolean;
  setEnclosureOptionsOpen;
  scene;
}) {
  const {
    enclosureDimensions,
    enclosureOptionsOpen,
    setEnclosureOptionsOpen,
    scene,
  } = props;

  const [lidExportFormat, setLidExportFormat] = useState("STL");
  const [baseExportFormat, setBaseExportFormat] = useState("STL");

  const [baseURL, setBaseURL] = useState(null);
  const [lidURL, setLidURL] = useState(null);

  const [lidObject, setLidObject] = useState(null);
  const [baseObject, setBaseObject] = useState(null);

  const [genCarrierPCB, setGenCarrierPCB] = useState(true);

  const [svgArr, setSVGArr]: [] = useState(null); //enclosureDimensions ? getLidSVG(enclosureDimensions, scene) : []

  const [lidStencil, setLidStencil] = useState(null);

  const [exp3DModel, setExp3DModel] = useState(false);
  const [expTabbedBox, setExpTabbedBox] = useState(false);
  const [expStencils, setExpStencils] = useState(false);

  const handleRefreshPreview = async () => {
    const blobs = await getSTLBlob(
      enclosureDimensions,
      scene,
      enclosureOptions
    );

    const myLidStencil = await get2DStencil(
      enclosureDimensions,
      scene,
      enclosureOptions
    );
    setLidStencil(myLidStencil[0]);

    setBaseURL(window.URL.createObjectURL(blobs.base));

    setLidURL(window.URL.createObjectURL(blobs.lid));

    const result = await getLidSVG(enclosureDimensions, scene);
    if (result.length > 1) {
      // console.log('resulting arr: ', result)
      setSVGArr(result);
      // console.log('svgArr: ', svgArr)
    }
  };

  /* 
        const testBox = PressFitBox({
          height: 200, //enclosureDimensions.height,
          width:100, // enclosureDimensions.width, 
          depth: 50, //enclosureDimensions.depth,
          tabs: 7,
          thickness: 3, 
          backlash: 0.1
        })
  
        // console.log('my boxx', testBox)
  
  
        const tabbedBoxBlob = new Blob([testBox], { type: "image/svg+xml" }) */

  //setExpTabbedBox(window.URL.createObjectURL(tabbedBoxBlob))

  useEffect(() => {
    enclosureOptions.exportOptions.format.lid = lidExportFormat;
    enclosureOptions.exportOptions.format.base = baseExportFormat;
  }, [lidExportFormat, baseExportFormat]);

  const handleClose = (event) => {
    setEnclosureOptionsOpen(false);

    const value = event.target.value;

    //const carrierPCBBoxValue = document.getElementById('isCarrierPCBBox');
    // console.log('carrier checkbox val: ', genCarrierPCB)

    if (value && value === "export") {
      downloadSTLEnclosure(
        {
          height: enclosureDimensions.height,
          width: enclosureDimensions.width,
          depth: enclosureDimensions.depth,
        },
        scene,
        genCarrierPCB
      );
    }

    //  generateGerber(scene, traces, carrierPCBDimensions);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleLidExportFormat = (event) => {
    setLidExportFormat(event.target.value as string);
  };

  const handleBaseExportFormat = (event) => {
    setBaseExportFormat(event.target.value as string);
  };

  return (
    <Dialog open={enclosureOptionsOpen} onClose={handleClose} fullScreen>
      <DialogTitle>Enclosure Export</DialogTitle>

      <DialogContent aria-label="">
        <h5>Dimensions</h5>
        <TextField
          // ref={heightCheat}
          onChange={(e) => {
            // console.log('height change and e, : ', e)
            carrierPCBDimensionChange(e, "height");
            setHeightState(parseFloat(e.target.value));
            //setCheatChange(e.target.value)
          }}
          id="EnclosureHeight"
          label="Enclosure Height"
          value={enclosureDimensions.height}
          style={{ width: 100 }}
          InputProps={{ inputProps: { min: 5, max: 500 } }}
          variant="standard"
        ></TextField>

        <TextField
          onChange={(e) => {
            // console.log('width change and e, : ', e.target.value)
            carrierPCBDimensionChange(e, "width");
          }}
          id="EnclosureWidth"
          label="Enclosure Width"
          defaultValue={enclosureDimensions.width}
          style={{ width: 100 }}
          InputProps={{ inputProps: { min: 5, max: 500 } }}
          variant="standard"
        ></TextField>

        <TextField
          onChange={(e) => {
            // console.log('width change and e, : ', e.target.value)
            carrierPCBDimensionChange(e, "width");
          }}
          id="EnclosureDepth"
          label="Enclosure Depth"
          defaultValue={enclosureDimensions.depth}
          style={{ width: 100 }}
          InputProps={{ inputProps: { min: 5, max: 500 } }}
          variant="standard"
        ></TextField>

        <h5>Previews</h5>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="3D Model (STL)" {...a11yProps(0)} />
              <Tab label="Tabbed Box (SVG)" {...a11yProps(1)} />
              <Tab label="Stencil (SVG)" {...a11yProps(2)} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <Enclosure_3dModel
              lidURL={lidURL}
              baseURL={baseURL}
              handleRefreshPreview={handleRefreshPreview}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            {svgArr && (
              <>
                <p1>dreadful</p1>
                <Enclosure_TabbedBox
                  svgArr={svgArr}
                  tabbedBoxURL={"expTabbedBox"}
                  handleRefreshPreview={handleRefreshPreview}
                />
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Enclosure_Stencil lidSVG={lidStencil} />
          </TabPanel>
        </Box>

        {/* <h5>Module Mounting Options</h5>
                <FormControlLabel
                    labelPlacement="start"
                    control={<Checkbox defaultChecked onClick={(event) => {setGenCarrierPCB(event.target.checked)}} />}
                    label="Generate carrier PCB"
                /> */}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button value="export" onClick={handleClose}>
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
}
