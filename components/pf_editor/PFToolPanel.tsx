// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { Grid, Box, TextField, IconButton, Button } from "@mui/material";
import Link from "next/link";
//import icons
import RouteIcon from "@mui/icons-material/Route";
import Delete from "@mui/icons-material/Delete";
import RotateLeft from "@mui/icons-material/RotateRight";
import Cameraswitch from "@mui/icons-material/Cameraswitch";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import {
  rotateX,
  deleteObject,
  route,
  deleteAll,
  collectMountingHoleLocations,
} from "./editFunctions";

import * as THREE from "three";
import {
  downloadSTLEnclosure,
  addEnclosureToScene,
} from "./enclosureFunctions";
import { generateGerber, saveScene } from "./generators/generateGerber";

import EnclosureButton from "./EnclosureButton";
import AddModule from "./AddModule";
import Connect from "../jacdac-react/Connect";
import ConnectComp from "../jacdac-react/DynamicConnext";
import { MoreMenu } from "./MoreMenu";
import ProjectTitle from "./ProjectTitle";

const map = {
  rotary: ["replicate_rotary"], // eslint-disable-line
  button: [], // eslint-disable-line
  key_switch: ["replicate_tact"], // eslint-disable-line
};

const views = ["top", "left", "right", "bottom"];
let count = 0;

export default function PFToolPanel(props: {
  addModule: any;
  lastClicked: THREE.Object3D | undefined;
  objectRefs: [];
  carrierPCBDimensions: { height: number; width: number };
  setCarrierPCBDimensions: any;
  enclosureDimensions: { height: number; width: number; depth: number };
  setEnclosureDimensions: any;
  enclosureVisible: true | false;
  setEnclosureVisible: any;
  setEnclosureOptionsOpen: any;
  setCarrierPCBOptionsOpen: any;
  scene: any;
  traces: any;
  setTraces: any;
  lockOrbit: any;
  setLockOrbit: any;
  cheatChange: any;
  changeCameraView: any;
  addModule: any;
  setLastClicked: any;
  setJdMountingHoleLocations: any;
  handleRenderClick;
  setFabricationFilesModalOpen: any;
  setErr;
}) {
  const {
    addModule,
    lastClicked,
    objectRefs,
    objects,
    carrierPCBDimensions,
    setCarrierPCBDimensions,
    enclosureDimensions,
    setEnclosureDimensions,
    enclosureVisible,
    setEnclosureVisible,
    setEnclosureOptionsOpen,
    setCarrierPCBOptionsOpen,
    scene,
    traces,
    setTraces,
    lockOrbit,
    setLockOrbit,
    cheatChange,
    changeCameraView,
    setLastClicked,
    setJdMountingHoleLocations,
    handleRenderClick,
    setFabricationFilesModalOpen,
    setErr,
  } = props;

  const enclosureVisibleCheckbox = useRef();

  const lockOrbitCheckbox = useRef();

  const heightCheat = useRef();

  const [heightState, setHeightState] = useState(enclosureDimensions.height);

  useEffect(() => {
    setHeightState(cheatChange);
    // console.log(cheatChange);
  }, [cheatChange]);

  function handleExport() {
    generateGerber(scene, traces, carrierPCBDimensions);
  }

  const handleRClick = () => {
    handleRenderClick();
  };

  async function handleFlatten() {
    console.log("FLATTENINNNG");
  }

  //TODO: Use object store for this
  function carrierPCBDimensionChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
  ) {
    let value = parseInt(e.target.value);
    /*  if (value % 2 !== 0) {
      value += 1;
    } */
    if (value > 0) {
      switch (type) {
        case "width":
          setEnclosureDimensions({
            height: carrierPCBDimensions.height,
            width: value,
            depth: enclosureDimensions.depth,
          });

          setCarrierPCBDimensions({
            height: carrierPCBDimensions.height,
            width: value,
          });
          break;
        case "height":
          setEnclosureDimensions({
            height: value,
            width: carrierPCBDimensions.width,
            depth: enclosureDimensions.depth,
          });

          // set the height value of the thing
          setHeightState(value);

          setCarrierPCBDimensions({
            height: value,
            width: carrierPCBDimensions.width,
          });
      }
    }
  }

  const handleSaveAs = () => {
    saveScene(scene);
  };

  function downloadTextFile(data);

  function enclosureDimensionChange(e: { target: { value: any } }, type: any) {
    switch (type) {
      case "height":
        setEnclosureDimensions({
          width: enclosureDimensions.width,
          height: e.target.value,
          depth: enclosureDimensions.depth,
        });
        break;
      case "width":
        setEnclosureDimensions({
          width: e.target.value,
          height: enclosureDimensions.height,
          depth: enclosureDimensions.depth,
        });
        break;
      case "depth":
        setEnclosureDimensions({
          width: enclosureDimensions.width,
          height: enclosureDimensions.height,
          depth: e.target.value,
        });
        break;
    }
  }

  return (
    <Box component={"div"} alignItems={"center"}>
      <Grid
        container
        sx={{
          mt: 1,
          mb: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid item sx={{ mr: 32 }}>
          <ProjectTitle />
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={1}>
        {/* <Grid item>
                    <Typography variant=>Editor</Typography>
                </Grid> */}

        <Grid
          item
          xs={3}
          display={"flex"}
          sx={{ justifyContent: "space-evenly" }}
        >
          <div id="" style={{ padding: "0.5em", display: "inline-block" }}>
            <TextField
              // ref={heightCheat}
              onChange={(e) => {
                // console.log("height change and e, : ", e);
                carrierPCBDimensionChange(e, "width");
                setHeightState(parseFloat(e.target.value));
                //setCheatChange(e.target.value)
              }}
              id="carrierPCBWidthSlider"
              label="PCB height"
              value={enclosureDimensions.width}
              style={{ width: 75 }} // Changed from 100 to 80
              InputProps={{ inputProps: { min: 1, max: 50 } }}
              variant="standard"
            ></TextField>
          </div>
          <div style={{ padding: "0.5em", display: "inline-block" }}>
            <TextField
              onChange={(e) => {
                // console.log("width change and e, : ", e.target.value);
                carrierPCBDimensionChange(e, "height");
              }}
              id="carrierPCBHeightSlider"
              label="PCB width"
              defaultValue={100}
              value={enclosureDimensions.height}
              style={{ width: 75 }}
              InputProps={{ inputProps: { min: 1, max: 50 } }}
              variant="standard"
            ></TextField>
          </div>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent={"space-evenly"}>
          <IconButton
            title={"Change View"}
            onClick={() => {
              handleSaveAs();
            }}
            color="primary"
            aria-label="SaveAs"
          >
            <SaveAsIcon />
          </IconButton>

          <IconButton
            title={"Rotate module"}
            onClick={() => {
              try {
                rotateX(lastClicked.current);
                const test = route(scene);
                console.log("test", test);

                if (test.power === "error" || test.data === "error") {
                  console.log("found error");
                  //setErr("routing");
                } else {
                  //setErr(null);
                }
                setTraces(route(scene));
              } catch {}
            }}
            color="primary"
            aria-label="Rotate"
          >
            <RotateLeft />
          </IconButton>

          <IconButton
            title={"Delete module"}
            onClick={() => {
              deleteObject(lastClicked.current, objectRefs);
              //route(scene);
            }}
            color="primary"
            aria-label="delete"
          >
            <Delete />
          </IconButton>

          {/*  <IconButton
            title={"Auto-route"}
            onClick={() => {
              setTraces(route(scene));
            }}
            color="primary"
            aria-label="Auto-route"
          >
            <RouteIcon />
          </IconButton> */}

          <IconButton
            title={"Export"}
            onClick={() => {
              //setEnclosureOptionsOpen(true)
              //setCarrierPCBOptionsOpen(true);
              //handleExport();
              setFabricationFilesModalOpen(true);
            }}
            color="primary"
            aria-label="Export"
          >
            <FileDownloadIcon />
          </IconButton>

          {/* <MoreMenu
            scene={scene}
            setTraces={setTraces}
            setCarrierPCBDimensions={setCarrierPCBDimensions}
            enclosureDimensions={enclosureDimensions}
            setEnclosureDimensions={setEnclosureDimensions}
          /> */}
        </Grid>

        <Grid item xs={3} display="flex" justifyContent={"center"}>
          <Box selected display="flex" sx={{}}>
            <Box selected display="flex" sx={{ paddingX: "4em" }}>
              {/* <Button
                variant="contained"
                onClick={handleRenderClick}
                sx={{
                  top: "1.5em",
                  fontSize: "0.7rem",
                  height: "36px",
                  padding: "0 8px",
                  minWidth: "90px",
                }}
              >
                Re-render
              </Button> */}

              {/* <Button
                variant="contained"
                onClick={() => setFabricationFilesModalOpen(true)}
                sx={{
                  top: "1.5em",
                  fontSize: "1rem",
                  height: "36px",
                  padding: "0 8px",
                  minWidth: "90px",
                  marginLeft: "8px",
                }}
              >
                Fabricate
              </Button> */}
            </Box>

            {/* <ConnectComp /> */}
            {/* <Button onClick={handleFlatten}>Flatten</Button> */}
            <Button
              variant="contained"
              onClick={handleFlatten}
              sx={{
                height: "30px",
                padding: "12px",
                paddingY: "1.4em",
              }}
            >
              Flatten
            </Button>
          </Box>
        </Grid>
        <Grid item xs={3} display="flex" justifyContent={"center"}>
          <Box selected display="flex"></Box>
        </Grid>
      </Grid>
    </Box>
  );
}

//const objectList = [];

/* scene.traverse((sceneChild) => {
      if (sceneChild.userData.isModule === true) {
        objectList.push({
          id: sceneChild.userData.name,
          position: {
            x: sceneChild.parent.position.x,
            y: sceneChild.parent.position.y,
            z: sceneChild.parent.position.z,
          },
          rotation: {
            x: sceneChild.rotation.x,
            y: sceneChild.rotation.y,
            z: sceneChild.rotation.z,
          },
        });
      }
    }); */

//- remove all the old modules and traces,
//- reset traces
//- grab module list and add corresponding replicate modules

/* setTraces({ power: [], data: [] });
    setLastClicked(undefined);
    route(scene);
    const mhLocs = collectMountingHoleLocations(scene).map(
      (hole) => hole.mountingHolePosition,
    );
    setJdMountingHoleLocations(mhLocs);

    console.log("objlisttt: ", objectList);

    objectList.forEach((object) => {
      // get replicate object name
      const name = map[object.id.toString().toLowerCase().replace(" ", "_")][0];

      addModule(
        name,
        [object.position.x, object.position.y, object.position.z],
        [object.rotation.x, object.rotation.y, object.rotation.z],
      );

      console.log("names recv: ", name);
    }); */
