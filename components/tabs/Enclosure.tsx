import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { TypeSpecimen } from "@mui/icons-material";
import EnclosureView from "./EnclosureView";
import EnclosureForm from "./EnclosureForm";
import OffShelfEnclosureList from "../enclosure-listings/OffShelfEnclosureList";
import Download3DPrint from "../3d-printing-options/Download3DPrint";
import Order3DPrint from "../3d-printing-options/Order3DPrint";
import SVGModelCard from "../models/SVGModelCard";
import SVG from "react-inlinesvg";

export type EnclosureType = "3d_printing" | "laser_cut" | "off_the_shelf" | "";

export default function EnclosureTab(props: {
  isHidden: boolean;
  editorScene: any;
  enclosureDiemsions: any;
  svgArr;
  setSvgArr;
}) {
  const { isHidden, editorScene, enclosureDiemsions, svgArr } = props;

  const [enclosureType, setEnclosureType] = useState("3d_printing");

  const handleEnclosureTypeSelection = (
    event: React.MouseEvent<HTMLElement>,
    newEnclosureType: string
  ) => {
    setEnclosureType(newEnclosureType);
  };

  // const [enclosureType, setEnclosureType] = useState<EnclosureType>("");

  const handleEnclosureTypeChange = (event: SelectChangeEvent) => {
    setEnclosureType(event.target.value as EnclosureType);
  };

  return (
    <div hidden={isHidden} style={{ width: "100%", height: "100%" }}>
      <Grid container direction={"row"} xs={12}>
        <Grid item>
          <Box sx={{ justifyContent: "center" }}></Box>
        </Grid>
      </Grid>

      <Grid container direction={"row"} alignItems="center">
        <Grid item xs={12}>
          <Box component={"div"} padding={"2em"}>
            <Typography variant="h5" fontWeight={"bold"}>
              Enclosure Options
            </Typography>
          </Box>
          <Box
            id="gridbox"
            sx={{ display: "inline" }}
            component={"div"}
            style={{ width: "100%", height: "55vh" }}
          >
            <EnclosureForm outerSetEnclosureType={setEnclosureType} />

            {enclosureType === "3d_printing" && (
              <Box
                sx={{
                  justifyContent: "center",
                  display: "flex",
                  /* flexWrap: "wrap", */
                  "& > :not(style)": {
                    m: 4,
                    width: 128,
                    height: 128,
                  },
                }}
                component="div"
              >
                <Box
                  id="download3d"
                  component={"div"}
                  sx={{ minWidth: "20em", height: "25em", minHeight: "30em" }}
                >
                  <Download3DPrint
                    enclosureDimensions={enclosureDiemsions}
                    scene={editorScene}
                  />
                </Box>

                <Box
                  id="order3d"
                  component={"div"}
                  sx={{ minWidth: "25em", height: "5em", minHeight: "70em" }}
                >
                  <Order3DPrint />
                </Box>
              </Box>
            )}

            {enclosureType === "off_the_shelf" && (
              <Grid container direction="row" spacing={6} padding={"2em"}>
                <Grid item>
                  <OffShelfEnclosureList />
                </Grid>
              </Grid>
            )}

            {enclosureType === "laser_cut" && (
              <Grid container direction="row" spacing={6} padding={"2em"}>
                {svgArr && svgArr[0] && (
                  <>
                    <Grid item xs={6}>
                      <SVG src={svgArr[0][0]}></SVG>
                    </Grid>
                    <Grid item xs={6}>
                      <SVG src={svgArr[1][0]}></SVG>
                    </Grid>
                    <Grid item xs={6}>
                      <SVG src={svgArr[2][0]}></SVG>
                    </Grid>
                    <Grid item xs={6}>
                      <SVG src={svgArr[3][0]}></SVG>
                    </Grid>
                    <Grid item xs={6}>
                      <SVG src={svgArr[4][0]}></SVG>
                    </Grid>
                    <Grid item xs={6}>
                      <SVG src={svgArr[5][0]}></SVG>
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </Box>
        </Grid>
        <Grid item></Grid>
      </Grid>
    </div>
  );
}

/* 
<FormControl>
<FormLabel id="demo-radio-buttons-group-label">
  Enclosure Type
</FormLabel>
<RadioGroup
  aria-labelledby="demo-radio-buttons-group-label"
  defaultValue="3d_print"
  name="radio-buttons-group"
>
  <FormControlLabel
    value="3d_print"
    control={<Radio />}
    label="3D Print"
  />
  <FormControlLabel
    value="laser_cut"
    control={<Radio />}
    label="Laser Cut"
  />
  <FormControlLabel
    value="off_the_shelf"
    control={<Radio />}
    label="Off-the-shelf"
  />
</RadioGroup>
</FormControl> */

/* <div>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Enclosure Type</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Please select how you wish you create an enclosure from
                    these options:
                    <ToggleButtonGroup
                      value={enclosureType}
                      onChange={handleEnclosureTypeSelection}
                      exclusive
                    >
                      <ToggleButton value="3d_printing">
                        3d Printing
                      </ToggleButton>
                      <ToggleButton value="laser_cut">Laser Cut</ToggleButton>
                      <ToggleButton value="off_the_shelf">
                        Off-the-shelf
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Accordion 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography></Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion disabled>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3a-content"
                  id="panel3a-header"
                >
                  <Typography>Disabled Accordion</Typography>
                </AccordionSummary>
              </Accordion>
            </div> */
