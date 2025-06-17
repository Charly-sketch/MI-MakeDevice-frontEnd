//"use client"

import { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import PFHeaderBar from "../components/toolbar/PFHeaderBar";
import Box from "@mui/material/Box";
import {
  Button,
  CssBaseline,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { FormControl } from "@mui/base";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import SERVICES from "../services.json";
import { useRef, useState } from "react";
import { STM23_PinMap } from "../firmware/STM32/STM32_PinTypes";
import { generateFirmware } from "../firmware/STM32/STM32FirmwareGenerator";

const FirmwareCreator: NextPage = () => {
  const [deviceName, setDeviceName] = useState("device-name");
  const handleNameChange = (event) => {
    setDeviceName(event.target.value as string);
  };

  const [lastSelectedService, setLastSelectedService] = useState("");

  const [lastSelectedServiceIndex, setLastSelectedServiceIndex] = useState("");

  const [selectedServices, setSelectedServices] = useState([]);

  const [numberOfInstances, setNumberOfInstances] = useState(0);

  const handleChipDelete = () => {};

  const handleChange = (event: SelectChangeEvent) => {
    setLastSelectedService(event.target.value as string);
    setLastSelectedServiceIndex(event.target.value as number);

    // updateSelectedServicesFromIndex(event.target.value);
  };

  const handleNumberOfInstancesChange = (event) => {
    setNumberOfInstances(event.target.value);
  };

  const handleAdd = () => {
    updateSelectedServicesFromIndex(
      lastSelectedServiceIndex,
      numberOfInstances
    );
  };

  const handleClear = () => {
    setLastSelectedService("");
    setSelectedServices([]);

    setIsFirmwareGenerated(false);
  };

  const extendedServices = SERVICES.filter((item) => item.extends.length > 0);

  const [isFirmwareGenerated, setIsFirmwareGenerated] = useState(false);
  const [firmware, setFirmware] = useState("");

  const handleGenerateFirmware = () => {
    setFirmware(generateFirmware(deviceName, selectedServices, STM23_PinMap));

    if (!isFirmwareGenerated) setIsFirmwareGenerated(true);
  };

  function updateSelectedServicesFromIndex(
    idxExtendedServices: number,
    numberOfInstances?: number
  ) {
    let servicesToAdd = [];
    for (let i = 0; i < numberOfInstances; i++) {
      servicesToAdd.push(extendedServices[idxExtendedServices]);
    }

    setSelectedServices([...selectedServices, ...servicesToAdd]);
  }

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>MakeDevice - Firmware Creator</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <header style={{ zIndex: 1000 }} className={styles.header}>
            <PFHeaderBar
              page={"editor"}
              MakeCodeFrameVisible={undefined}
              setOptionClicked={undefined}
              setMakeCodeFrameVisible={undefined}
            />
          </header>

          <Box width={"95%"} component={"div"} id="PFEditor" padding={8}>
            <Typography variant="h2">Firmware Creator</Typography>

            <br />

            <Typography variant="body1" padding={3}>
              You can use this tool to generate firmware for your custom Jacdac
              device. Start by selecting from the list of services below.
            </Typography>

            <Box id="formContainer" component={"div"} padding={3}>
              <FormControl fullwidth>
                <TextField
                  id="outlined-basic"
                  label="Device name"
                  variant="outlined"
                  onChange={handleNameChange}
                />

                <br />
                <InputLabel id="demo-simple-select-label">
                  Select Service
                </InputLabel>
                <Stack spacing={2} direction="row">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={lastSelectedService}
                    label="Select Service"
                    onChange={handleChange}
                  >
                    {extendedServices.map((item, idx, arr) => (
                      <MenuItem key={idx} value={idx}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <TextField
                    id="outlined-basic"
                    label="no. of instances"
                    variant="outlined"
                    onChange={handleNumberOfInstancesChange}
                  />

                  <Button onClick={handleAdd} variant="contained">
                    Add
                  </Button>

                  <Button onClick={handleClear} variant="contained">
                    Clear
                  </Button>
                </Stack>
                <br />

                <Typography variant="h5" paddingBottom={2}>
                  Selected services:{" "}
                </Typography>
                <Stack direction="row" spacing={2}>
                  {selectedServices.map((item, idx, arr) => (
                    <Chip
                      key={idx}
                      label={item.name}
                      onDelete={handleChipDelete}
                    />
                  ))}
                </Stack>
                <Box padding={2}>
                  <Button variant="contained" onClick={handleGenerateFirmware}>
                    Generate Firmware
                  </Button>
                </Box>
              </FormControl>
            </Box>

            {isFirmwareGenerated && (
              <Box id="firmwareCodeContainer" component={"div"}>
                <Box
                  id="profile/device.c"
                  sx={{ bgcolor: "lightgrey", m: 2 }}
                  component={"div"}
                >
                  <Box id="codebox header" paddingLeft={1} component={"div"}>
                    <Typography variant="h6">profile/device.c</Typography>
                  </Box>
                  <Box padding={1} component={"div"}>
                    <codebox
                      dangerouslySetInnerHTML={{
                        __html: firmware["device.c"],
                      }}
                    ></codebox>
                  </Box>
                </Box>

                <CssBaseline />
                <Box
                  component={"div"}
                  id="board.h"
                  sx={{ bgcolor: "lightgrey", m: 2 }}
                >
                  <Box
                    id="codebox header"
                    component={"div"}
                    sx={{
                      border: "3px",
                      borderRadius: "16px",
                      borderColor: "blue",
                      paddingLeft: 1,
                    }}
                  >
                    <Typography variant="h6">board.h</Typography>
                  </Box>

                  <Box padding={1} component={"div"}>
                    <codebox
                      dangerouslySetInnerHTML={{
                        __html: firmware["board.h"],
                      }}
                    ></codebox>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </main>
      </div>
    </>
  );
};

export default FirmwareCreator;
