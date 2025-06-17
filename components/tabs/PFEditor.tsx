// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import {
  Canvas,
  ambientLight,
  directionalLight,
  useThree,
} from "@react-three/fiber";
// import GLBModel from "../../components/models/GLBModel"
import { OrthographicCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Box, Grid } from "@mui/material";
import CarrierPCB from "../pf_editor/CarrierPCB";
import AddModule from "../pf_editor/AddModule";
import PFToolPanel from "../pf_editor/PFToolPanel";
import PF_Module from "../models/PF_Module";
import Enclosure from "../pf_editor/Enclosure";
import AddConnectedModule from "../pf_editor/AddConnectedModule";
import EnclosureOptions from "../pf_editor/EnclosureOptions";
import CarrierPCBOptions from "../pf_editor/CarrierPCBOptions";
import { route } from "../pf_editor/editFunctions";
import InfoPanel from "../pf_editor/InfoPanel";
import { JDDevice, DeviceCatalog } from "jacdac-ts";
import { MenuItems } from "../pf_editor/PFToolbarMenuItems";

import { useBus, useChange } from "react-jacdac";

export default function Page(props: { isHidden: boolean; canvasTunnel: any }) {
  const { isHidden, canvasTunnel } = props;
  // connected jacdac devices
  /*  const devices = useDevices({
        physical: true,x
        announced: true,
        ignoreInfrastructure: true,
        productIdentifier: true,
    }) */

  //const bus = useBus();
  const devices = null;
  // fetch the connect state, useChange will trigger a re-render when connected changes
  //const connected = useChange(bus, (_) => _.connected);

  // Canvas
  const canvasRef = useRef();

  // used to filter out any none module from selection
  const [moduleIDs, setModuleIDs] = useState([]);

  const customFilterFunction = (objs) => {
    let objToReturn = undefined;
    objs.forEach((obj) => {
      if (obj.userData.isModule === true) {
        return [obj];
      } else {
        obj.traverseAncestors((ancObj) => {
          // console.log("ancs: ", ancObj);
          // console.log(ancObj.userData.isAnimMesh);
          if (ancObj.userData.isModule === true) {
            //// console.log('returing ancObj: ', ancObj)
            objToReturn = ancObj;
            return [ancObj];
          }
        });

        obj.traverse((subObj) => {
          if (subObj.userData.isModule === true) {
            objToReturn = subObj;
            return [subObj];
          }
        });
      }
    });

    if (objToReturn === undefined) {
      return undefined;
    } else {
      return [objToReturn];
    }
  };

  const [camPos, setCamPos] = useState([0, 40, 0]);

  // carrier pcb
  const [carrierPCBDimensions, setCarrierPCBDimensions] = useState({
    height: 100,
    width: 100,
  });

  // enclosure
  const [enclosureDimensions, setEnclosureDimensions] = useState({
    height: 100,
    width: 100,
    depth: 35,
  });

  const [enclosureSTL, setEnclosureSTL] = useState(null);

  const [traces, setTraces] = useState({ power: [], data: [] });

  // lock/unlock orbit
  const [lockOrbit, setLockOrbit] = useState(true);

  // enclosure visible
  const [enclosureVisible, setEnclosureVisible] = useState(false);
  const [enclosureOptionsOpen, setEnclosureOptionsOpen] = useState(false);

  const [CarrierPCBOptionsOpen, setCarrierPCBOptionsOpen] = useState(false);

  //array to hold all jacdac module objects
  const [objects, setObjects] = useState([]);

  // stores current state of threejs scene
  const [editorScene, setEditorScene] = useState(null);

  // module or object selected or 'lastClicked' by the user
  const [lastClicked, setLastClicked] = useState(undefined);

  // Object dragging state used to toggle orbit
  const [isDragging, setIsDragging] = useState(false);
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  const [cheatChange, setCheatChange] = useState(100);

  const defaultModulePosition = [0, 8, -80];

  const addModule = async (moduleName) => {
    // console.log(editorScene);
    console.log("mod name: ", moduleName);
    console.log("allModules: ", objects);

    const topLevelUUID = crypto.randomUUID();

    setObjects([
      ...objects,
      <PF_Module
        name={topLevelUUID}
        moduleName={moduleName}
        key={Math.random()}
        id={crypto.randomUUID()}
        setIsDragging={setIsDragging}
        setLastClicked={setLastClicked}
        lastClicked={lastClicked ? lastClicked : undefined}
        floorPlane={floorPlane}
        position={defaultModulePosition}
        scene={editorScene}
        traces={traces}
        setTraces={setTraces}
        moduleIDs={moduleIDs}
        setModuleIDs={setModuleIDs}
      />,
    ]);
  };

  const changeCameraView = (val) => {
    switch (val) {
      case "top":
        setCamPos([0, 40, 0]);
        break;
      case "left":
        setCamPos([-100, 0, 0]);
      case "right":
        setCamPos([100, 0, 0]);
      case "bottom":
        setCamPos([0, -40, 0]);
    }
  };

  return (
    <div hidden={isHidden}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <AddModule addModule={addModule}></AddModule>
        </Grid>
        <Grid item xs={8}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Grid container spacing={3} direction="row" xs={12}>
              {false && (
                <Grid item>
                  <AddConnectedModule
                    addModule={addModule}
                    devices={devices}
                    objects={objects}
                    setObjects={setObjects}
                    setIsDragging={setIsDragging}
                    lastClicked={lastClicked}
                    floorPlane={floorPlane}
                    setLastClicked={setLastClicked}
                    scene={editorScene}
                    setCarrierPCBDimensions={setCarrierPCBDimensions}
                    route={route}
                    setCheatChange={setCheatChange}
                  ></AddConnectedModule>
                </Grid>
              )}

              <Grid item xs={12}>
                <PFToolPanel
                  lastClicked={lastClicked ? lastClicked : undefined}
                  objectRefs={objects as []}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  addModule={addModule}
                  carrierPCBDimensions={carrierPCBDimensions}
                  setCarrierPCBDimensions={setCarrierPCBDimensions}
                  enclosureDimensions={enclosureDimensions}
                  setEnclosureDimensions={setEnclosureDimensions}
                  enclosureVisible={enclosureVisible}
                  setEnclosureVisible={setEnclosureVisible}
                  setEnclosureOptionsOpen={setEnclosureOptionsOpen}
                  setCarrierPCBOptionsOpen={setCarrierPCBOptionsOpen}
                  scene={editorScene}
                  traces={traces}
                  setTraces={setTraces}
                  lockOrbit={lockOrbit}
                  setLockOrbit={setLockOrbit}
                  cheatChange={cheatChange}
                  changeCameraView={changeCameraView}
                ></PFToolPanel>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              columns={12}
              direction="row"
              padding="20px"
            >
              <Grid
                item
                xs={16}
                direction="column"
                alignItems="stretch"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  height: "100vh",
                }}
              >
                <Box textAlign="center" height={"100%"} width={"100%"}>
                  {enclosureOptionsOpen && (
                    <EnclosureOptions
                      enclosureDimensions={enclosureDimensions}
                      enclosureOptionsOpen={enclosureOptionsOpen}
                      setEnclosureOptionsOpen={setEnclosureOptionsOpen}
                      scene={editorScene}
                    ></EnclosureOptions>
                  )}

                  {CarrierPCBOptionsOpen && (
                    <CarrierPCBOptions
                      CarrierPCBOptionsOpen={CarrierPCBOptionsOpen}
                      setCarrierPCBOptionsOpen={setCarrierPCBOptionsOpen}
                    />
                  )}

                  <Canvas
                    onCreated={({ scene }) => {
                      setEditorScene(scene);
                    }}
                    ref={canvasRef}
                    style={{
                      position: "relative",
                      height: "75%",
                      overflow: "visible",
                    }}
                    shadows
                    onPointerMissed={function () {
                      setLastClicked(undefined);
                    }}
                  >
                    <ambientLight intensity={1} />
                    <directionalLight
                      intensity={1}
                      castShadow
                      shadow-mapSize-height={1512}
                      shadow-mapSize-width={1512}
                    />
                    <color attach="background" args={["lightblue"]}></color>

                    {/*   <gridHelper
                                args={[
                                    100,
                                    10,
                                    new THREE.Color(0xffffff),
                                    new THREE.Color(0xffffff),
                                ]}
                                position={[0, 2, 0]}
                                rotation={[0, 0, 0]}
                    /> */}

                    <CarrierPCB
                      width={carrierPCBDimensions.width}
                      height={carrierPCBDimensions.height}
                      rotation={[(Math.PI / 2) * 3, 0, 0]}
                      position={[0, 6, 0]}
                      color={"green"}
                    />

                    {enclosureVisible && editorScene !== undefined && (
                      <Enclosure
                        height={enclosureDimensions.height}
                        width={enclosureDimensions.width}
                        depth={enclosureDimensions.depth}
                        enclosureDimensions={enclosureDimensions}
                        scene={editorScene}
                        enclosureVisible={enclosureVisible}
                        stl={enclosureSTL}
                      />
                    )}

                    {objects}

                    <OrthographicCamera
                      makeDefault
                      zoom={5}
                      position={camPos}
                      near={-1000}
                      far={10000}
                      up={[1, 0, 0]}
                      /* rotateZ={THREE.MathUtils.degToRad(-90)} */
                    />

                    <OrbitControls
                      minZoom={-10}
                      maxZoom={50}
                      enabled={!isDragging && !lockOrbit}
                    />
                  </Canvas>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={2}>
          <InfoPanel
            lastClicked={lastClicked}
            lockOrbit={lockOrbit}
            setLockOrbit={setLockOrbit}
          ></InfoPanel>
        </Grid>
      </Grid>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function Objects({ objects }) {
  return <React.Fragment>{objects}</React.Fragment>;
}
