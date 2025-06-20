"use client";

import { Button } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import PFHeaderBar from "../components/toolbar/PFHeaderBar";
import styles from "../styles/Home.module.css";

import MakeCode from "../components/tabs/MakeCode";
import Testing from "../components/tabs/Testing";
import MakeCase from "../components/makeCase/MakeCase";
import { JacdacProvider } from "react-jacdac";
import { bus } from "../components/jacdac-react/bus";
import TabSwitch from "../components/toolbar/TabSwitch";

// @ts-nocheck
import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
// import GLBModel from "../../components/models/GLBModel"
import {
  OrthographicCamera,
  OrbitControls,
  Environment,
} from "@react-three/drei";
import CustomCameraControls from "../components/pf_editor/CameraControls";
import { useControls, button, buttonGroup, folder } from "leva";
import * as THREE from "three";
import { Box, Grid } from "@mui/material";
//import CarrierPCB from "../components/pf_editor/CarrierPCB";
import CarrierPCB from "../components/models/carrierPCB/CarrierPCB";
import AddModule from "../components/pf_editor/AddModule";
import PFToolPanel from "../components/pf_editor/PFToolPanel";
import PF_Module from "../components/models/PF_Module";
//import Enclosure from "../components/pf_editor/Enclosure";
import AddConnectedModule from "../components/pf_editor/AddConnectedModule";
import EnclosureOptions from "../components/pf_editor/EnclosureOptions";
import CarrierPCBOptions from "../components/pf_editor/CarrierPCBOptions";
import {
  collectMountingHoleLocations,
  route,
} from "../components/pf_editor/editFunctions";

//import { JDDevice, DeviceCatalog } from "jacdac-ts";

//import { useBus, useChange } from "react-jacdac";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
//import EnclosureView from "../components/tabs/EnclosureView";
import { Globals } from "@react-spring/three";
import {
  getLidSVG,
  getSTLBlob,
  sizeBuffer,
} from "../components/pf_editor/enclosureFunctions";
import STLModel from "../components/models/STLModel";
import EnclosureControls from "../components/tabs/EnclosureControls";
import EditorFooter from "../components/pf_editor/EditorFooter";

import LoadingFallback from "../components/loadingscreen/LoadingFallback";
import FabricationFilesModal from "../components/pf_editor/FabricationFilesModal";
import {
  defaultSettings,
  FabricationSettings,
} from "../components/pf_editor/FabricationSettingsModal";
// temp fix to rafz loop call
Globals.assign({
  frameLoop: "always",
});

import { raf } from "@react-spring/rafz";
raf.frameLoop = "demand";

import { generateFabricationSettingsCookie } from "../components/makeCase/DataJsonCreation";

//const DynamicHomePage: NextPage = dynamic(() => import(Home));
const Home: NextPage = () => {
  useEffect(() => {}, []);

  const [sceneState, setSceneState] = useState();

  const setSceneCallback = (scene) => {
    setSceneState(scene);
  };

  const EnclosureCanvasLink = (props: { setSceneState }) => {
    const scene = useThree((state) => state.scene);
    return <></>;
  };

  const [fabricationFilesModalOpen, setFabricationFilesModalOpen] =
    useState(false);

  const [MakeCodeFrameVisible, setMakeCodeFrameVisible] = useState(false);

  const [optionClicked, setOptionClicked] = useState("");

  const [viewable, setViewable] = useState(1);

  const exporter = new GLTFExporter();

  // connected jacdac devices
  /*   const devices = useDevices({
    physical: true,
    announced: true,
    ignoreInfrastructure: true,
    productIdentifier: true,
  }); */

  //const bus = useBus();
  //const devices = null;
  // fetch the connect state, useChange will trigger a re-render when connected changes
  // You can reduce the brightness by lowering the directionalLight intensity
  // Current directionalLight intensity is 0.25 which might be making the scene too bright
  // Try adjusting it to a lower value like 0.1 or adjust the ambientLight intensity
  // const connected = useChange(bus, (_) => _.connected);

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

  const [projectName, setProjectName] = useState("MyBoard");

  const [camPos, setCamPos] = useState([0, 40, 0]);

  // carrier pcb
  const [carrierPCBDimensions, setCarrierPCBDimensions] = useState({
    width: 100,
    height: 100,
  });

  // enclosure
  const [enclosureDimensions, setEnclosureDimensions] = useState({
    height: 100,
    width: 100,
    depth: 35,
  });

  const [enclosureSTL, setEnclosureSTL] = useState(null);

  const [settings, setSettings]: FabricationSettings = useState({
    ...defaultSettings,
    board: {
      ...defaultSettings.board,
      size: {
        x: carrierPCBDimensions.height,
        y: carrierPCBDimensions.width,
      },
    },
  });

  // Update settings when carrierPCBDimensions changes
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      board: {
        ...prev.board,
        size: {
          x: carrierPCBDimensions.height,
          y: carrierPCBDimensions.width,
        },
      },
    }));
  }, [carrierPCBDimensions]);
  // textures
  const [oakTexture] = [null]; //useLoader(TextureLoader, ["/enclosureTextures/oak.jpg"]);

  const currentTexture = useState(oakTexture);

  const [traces, setTraces] = useState({ power: [], data: [] });
  const [jdMountingHoleLocations, setJDMountingHoleLocations] = useState([]);

  // lock/unlock orbit
  const [lockOrbit, setLockOrbit] = useState(true);

  // enclosure visible
  const [enclosureVisible, setEnclosureVisible] = useState(false);
  const [enclosureOptionsOpen, setEnclosureOptionsOpen] = useState(false);

  const [CarrierPCBOptionsOpen, setCarrierPCBOptionsOpen] = useState(false);

  //array to hold all jacdac module objects
  const [objects, setObjects] = useState([]);

  // stores current state of threejs scen
  const [editorScene, setEditorScene] = useState(null);

  // generate fabrication settings cookie for makeCase
  let initialSettings = undefined;
  generateFabricationSettingsCookie({
    initialSettings,
    editorScene,
  });

  // module or object selected or 'lastClicked' by the user
  const [lastClicked, setLastClicked] = useState(undefined);

  // Object dragging state used to toggle orbit
  const [isDragging, setIsDragging] = useState(false);
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  const [cheatChange, setCheatChange] = useState(100);

  const defaultModulePosition = [0, 8, -80];
  const defaultModuleRotation = [0, -1.5708, 0];

  const [err, setErr] = useState(null);

  const addModule = async (
    module,
    position = defaultModulePosition,
    rotation = defaultModuleRotation,
  ) => {
    const topLevelUUID = crypto.randomUUID();

    console.log("objects: ", objects);
    console.log("module: ", module);

    const moduleName = module.name;
    const moduleFootprintID = module.shape;
    console.log(moduleName);
    setObjects([
      ...objects,
      <PF_Module
        name={topLevelUUID}
        moduleName={moduleName}
        key={Math.random()}
        moduleData={module}
        id={module.id}
        setIsDragging={setIsDragging}
        setLastClicked={setLastClicked}
        lastClicked={lastClicked ? lastClicked : undefined}
        floorPlane={floorPlane}
        position={position}
        rotation={rotation}
        traces={traces}
        setTraces={setTraces}
        moduleIDs={moduleIDs}
        setModuleIDs={setModuleIDs}
        setErr={setErr}
        lockOrbit={lockOrbit}
      />,
    ]);
  };

  const changeCameraView = (val) => {
    switch (val) {
      case "top":
        setCamPos([0, 4, 0]);
        break;
      case "left":
        setCamPos([-100, 0, 0]);
      case "right":
        setCamPos([100, 0, 0]);
      case "bottom":
        setCamPos([0, -40, 0]);
    }
  };

  const [baseURL, setBaseURL] = useState();
  const [lidURL, setLidURL] = useState();

  const [lidOn, setLidOn] = useState(false);

  const lidOffRotation = [
    THREE.MathUtils.degToRad(-90), //x
    THREE.MathUtils.degToRad(0), //y
    THREE.MathUtils.degToRad(90), //z
  ];

  const lidOnRotation = [
    THREE.MathUtils.degToRad(90), //x
    THREE.MathUtils.degToRad(0), //y
    THREE.MathUtils.degToRad(90), //z
  ];

  const lidOffPosition = [0, 0, 0];

  //TODO: fix enclosure lid
  const lidOnPosition =
    //enclosureDimensions.height > enclosureDimensions.width ?
    [0, 0, -((enclosureDimensions.width + sizeBuffer) * 1.1)];
  //: [0, 0, -(enclosureDimensions.width * 0.955 + sizeBuffer * 2)];

  const [svgArr, setSVGArr] = useState([]); //enclosureDimensions ? getLidSVG(enclosureDimensions, scene) : []

  const handleEnclosurePreviewRefresh = async () => {
    const blobs = await getSTLBlob(enclosureDimensions, editorScene);

    console.log("blobs in main: ", blobs);

    console.log("url base: ", window.URL.createObjectURL(blobs.base));
    console.log("url lid: ", window.URL.createObjectURL(blobs.lid));

    setBaseURL(window.URL.createObjectURL(blobs.base));

    setLidURL(window.URL.createObjectURL(blobs.lid));

    const result = await getLidSVG(enclosureDimensions, editorScene);
    if (result.length > 1) {
      console.log("resulting arr: ", result);
      setSVGArr(result);
      //console.log("svgArr: ", svgArr);
    }
  };

  const handleRenderClick = () => {
    const tempMH = collectMountingHoleLocations(editorScene);
    const mountingHoleLocations = tempMH
      .map((hole) => {
        const pos = hole.mountingHolePosition;
        return {
          ...pos,
          x: pos.x,
          z: pos.z,
          corner: false,
        };
      })
      .flat();

    console.log("tempMH: ", tempMH);
    console.log("mountingHoleLocations: ", mountingHoleLocations);
    setJDMountingHoleLocations(mountingHoleLocations);
  };

  const handleRotateLock = () => {
    setLockOrbit(!lockOrbit);
    console.log(lockOrbit);
  };

  return (
    <JacdacProvider initialBus={bus}>
      <div className={styles.container}>
        <Head>
          <title>MakeDevice</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <header style={{ zIndex: 1000 }} className={styles.header}>
            <PFHeaderBar
              page={"editor"}
              MakeCodeFrameVisible={MakeCodeFrameVisible}
              setOptionClicked={setOptionClicked}
              setMakeCodeFrameVisible={setMakeCodeFrameVisible}
            />
            <TabSwitch setViewable={setViewable} />
          </header>
          {viewable === 0 && <MakeCode isHidden={!(viewable === 0)}></MakeCode>}
          {viewable === 2 && <MakeCase isHidden={!(viewable === 2)}></MakeCase>}
          {viewable === 3 && <Testing isHidden={!(viewable === 3)}></Testing>}

          {viewable === 1 && (
            <Box width={"95%"} component={"div"} id="PFEditor">
              <div>
                <Grid id="rootGrid" container spacing={2}>
                  {viewable === 1 && (
                    <Grid item xs={2}>
                      <AddModule addModule={addModule}></AddModule>
                    </Grid>
                  )}

                  <Grid
                    id="centerGridItem"
                    item
                    xs={viewable === 1 ? 10 : 5}
                    hidden={!(viewable === 1 || viewable === 2)}
                  >
                    <Box
                      component={"div"}
                      maxHeight={"88vh"}
                      alignItems="center"
                    >
                      <Grid
                        container
                        spacing={1}
                        direction="column"
                        hidden={!(viewable === 1)}
                      >
                        {false && viewable === 1 && (
                          <Grid item>
                            <AddConnectedModule
                              addModule={addModule}
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
                        {viewable === 1 && (
                          <>
                            <Grid
                              id="menutoplevel"
                              alignItems="center"
                              item
                              xs={1}
                              top={"200%"}
                              display={"inline-block"}
                              flexDirection={"row"}
                            >
                              {/* <Typography textAlign={"center"}>Options</Typography> */}
                              <PFToolPanel
                                lastClicked={
                                  lastClicked ? lastClicked : undefined
                                }
                                objectRefs={objects as []}
                                objects={objects}
                                // eslint-disable-next-line react/jsx-no-duplicate-props
                                addModule={addModule}
                                carrierPCBDimensions={carrierPCBDimensions}
                                setCarrierPCBDimensions={
                                  setCarrierPCBDimensions
                                }
                                enclosureDimensions={enclosureDimensions}
                                setEnclosureDimensions={setEnclosureDimensions}
                                enclosureVisible={enclosureVisible}
                                setEnclosureVisible={setEnclosureVisible}
                                setEnclosureOptionsOpen={
                                  setEnclosureOptionsOpen
                                }
                                setCarrierPCBOptionsOpen={
                                  setCarrierPCBOptionsOpen
                                }
                                scene={editorScene}
                                traces={traces}
                                setTraces={setTraces}
                                lockOrbit={lockOrbit}
                                setLockOrbit={setLockOrbit}
                                cheatChange={cheatChange}
                                changeCameraView={changeCameraView}
                                setLastClicked={setLastClicked}
                                setJdMountingHoleLocations={
                                  setJDMountingHoleLocations
                                }
                                handleRenderClick={handleRenderClick}
                                setFabricationFilesModalOpen={
                                  setFabricationFilesModalOpen
                                }
                              ></PFToolPanel>
                            </Grid>
                          </>
                        )}
                      </Grid>

                      <Grid
                        container
                        spacing={1}
                        direction="column"
                        padding="1em"
                      >
                        <Grid
                          item
                          style={
                            viewable === 1
                              ? {
                                  position: "relative",
                                  overflow: "hidden",
                                  height: "66vh",
                                }
                              : {
                                  position: "relative",
                                  height: "50%",
                                  width: "100%",
                                }
                          }
                        >
                          <Box component={"div"} height={"100%"} width={"100%"}>
                            {enclosureOptionsOpen && (
                              <EnclosureOptions
                                enclosureDimensions={enclosureDimensions}
                                enclosureOptionsOpen={enclosureOptionsOpen}
                                setEnclosureOptionsOpen={
                                  setEnclosureOptionsOpen
                                }
                                scene={editorScene}
                              ></EnclosureOptions>
                            )}

                            {CarrierPCBOptionsOpen && (
                              <CarrierPCBOptions
                                CarrierPCBOptionsOpen={CarrierPCBOptionsOpen}
                                setCarrierPCBOptionsOpen={
                                  setCarrierPCBOptionsOpen
                                }
                              />
                            )}

                            {fabricationFilesModalOpen && (
                              <FabricationFilesModal
                                open={fabricationFilesModalOpen}
                                setOpen={setFabricationFilesModalOpen}
                                projectName={projectName}
                                editorScene={editorScene}
                                initialSettings={settings}
                              />
                            )}
                            {/* add controls here */}
                            <Button
                              variant="outlined"
                              sx={{
                                position: "absolute",
                                top: 15,
                                right: 10,
                                zIndex: 1,
                                backgroundColor: "white",
                              }}
                              onClick={handleRotateLock}
                            >
                              Rotate lock {lockOrbit ? "on" : "off"}
                            </Button>
                            <Canvas
                              id="canvas"
                              frameloop="demand"
                              onCreated={({ scene }) => {
                                setEditorScene(scene);
                              }}
                              ref={canvasRef}
                              shadows
                              onPointerMissed={function () {
                                setLastClicked(undefined);
                              }}
                            >
                              <EnclosureCanvasLink
                                setSceneState={setSceneCallback}
                              />

                              {/*       <ambientLight intensity={0.25} />
                            <directionalLight
                              intensity={0.1}
                              castShadow
                              shadow-mapSize-height={1512}
                              shadow-mapSize-width={1512}
                            /> */}

                              <React.Suspense fallback={null}>
                                <Environment preset="apartment" />
                              </React.Suspense>

                              <color
                                attach="background"
                                args={["lightblue"]}
                              ></color>

                              {/* <CarrierPCB
                              width={carrierPCBDimensions.width}
                              height={carrierPCBDimensions.height}
                              rotation={[(Math.PI / 2) * 3, 0, 0]}
                              position={[0, 6, 0]}
                              color={"green"}
                            /> */}

                              <CarrierPCB
                                width={carrierPCBDimensions.width}
                                height={carrierPCBDimensions.height}
                                rotation={[
                                  (Math.PI / 2) * 1,
                                  (Math.PI / 2) * 0,
                                  (Math.PI / 2) * 4,
                                ]}
                                position={[0, 6.8, 0]}
                                jdMountingHoleLocations={
                                  jdMountingHoleLocations
                                }
                              />

                              {objects}

                              <OrthographicCamera
                                makeDefault
                                zoom={viewable === 1 ? 4 : 2}
                                position={camPos}
                                near={-1000}
                                far={10000}
                                up={[1, 0, 0]}
                                /* rotateZ={THREE.MathUtils.degToRad(-90)} */
                              />

                              <OrbitControls
                                minZoom={-10}
                                maxZoom={50}
                                enabled={!lockOrbit || viewable === 3}
                              />
                              {lidURL !== undefined && viewable === 3 && (
                                <STLModel
                                  name={"lid"}
                                  url={lidURL}
                                  visible={true}
                                  color={"grey"}
                                  // texture={currentTexture}
                                  rotation={
                                    lidOn ? lidOnRotation : lidOffRotation
                                  }
                                  position={
                                    lidOn ? lidOnPosition : lidOffPosition
                                  }
                                ></STLModel>
                              )}

                              {baseURL !== undefined && viewable === 3 && (
                                <STLModel
                                  name={"base"}
                                  url={baseURL}
                                  visible={true}
                                  color={"grey"}
                                  rotation={[
                                    THREE.MathUtils.degToRad(-90), //x
                                    THREE.MathUtils.degToRad(0), //y
                                    THREE.MathUtils.degToRad(0), //z
                                  ]}
                                ></STLModel>
                              )}
                            </Canvas>

                            {viewable === 3 && (
                              <EnclosureControls
                                viewable={viewable}
                                handleEnclosurePreviewRefresh={
                                  handleEnclosurePreviewRefresh
                                }
                                lidOn={lidOn}
                                setLidOn={setLidOn}
                              />
                            )}
                          </Box>
                        </Grid>
                        {false && viewable === 3 && <Grid item xs={6}></Grid>}
                      </Grid>
                    </Box>
                  </Grid>

                  {/* RIGHT SIDE */}
                  {/* <Grid item xs={viewable === 1 ? 2 : 7}>
                  <Box component={"div"} width={"100%"} height={"100%"}>
                    {viewable === 9 && (
                      <InfoPanel
                        lastClicked={lastClicked}
                        lockOrbit={lockOrbit}
                        setLockOrbit={setLockOrbit}
                      ></InfoPanel>
                    )}

                    {viewable === 2 && (
                      <EnclosureTab
                        isHidden={!(viewable === 2)}
                        editorScene={editorScene}
                        enclosureDiemsions={enclosureDimensions}
                        svgArr={svgArr}
                        setSvgArr={setSVGArr}
                      ></EnclosureTab>
                    )}
                  </Box>
                </Grid> */}
                </Grid>
              </div>
            </Box>
          )}
        </main>

        <footer style={{ padding: "0px" }} className={styles.footer}>
          <EditorFooter />
        </footer>
      </div>
    </JacdacProvider>
  );
};

// eslint-disable-next-line react/prop-types
function Objects({ objects }) {
  return <React.Fragment>{objects}</React.Fragment>;
}

export default Home;
