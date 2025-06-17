import React, { useState } from "react";
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
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";

export type EnclosureType = "3d_printing" | "laser_cut" | "off_the_shelf" | "";

export default function EnclosureForm(props: {
  outerSetEnclosureType: (string) => void;
}) {
  const { outerSetEnclosureType } = props;

  const [enclosureType, setEnclosureType] =
    useState<EnclosureType>("3d_printing");

  const handleEnclosureTypeChange = (event: SelectChangeEvent) => {
    setEnclosureType(event.target.value as EnclosureType);
    outerSetEnclosureType(event.target.value as EnclosureType);
  };

  return (
    <>
      <Box
        id="formBox"
        component={"div"}
        /* padding={"1em"} */
        sx={{ display: "inline-block" }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Enclosure Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={enclosureType}
            label="Enclosure Type"
            onChange={handleEnclosureTypeChange}
            style={{ display: "inline", width: "350%" }}
          >
            <MenuItem value={"3d_printing"}>3D Print</MenuItem>
            <MenuItem value={"laser_cut"}>Laser cut</MenuItem>
            <MenuItem value={"off_the_shelf"}>Off-the-shelf</MenuItem>
          </Select>{" "}
        </FormControl>
      </Box>
    </>
  );
}
