// @ts-nocheck
import React, { useState, useRef, Suspense } from "react";
import { useHelper, useSelect, Edges, useCursor } from "@react-three/drei";

import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import { getFootprintID } from "../flattening/ModuleMap";
import { Globals } from "@react-spring/shared";

Globals.assign({
  frameLoop: "always",
});

import * as THREE from "three";

import { roundBy, route } from "../pf_editor/editFunctions";

import Jacdac_RP2040 from "./Jacdac_RP2040";

// TIER 2 MODULES
// KIT A DONE
import Jacdaptor from "./kittenbot/jacdaptor";
import Light_Sensor from "./kittenbot/light_sensor";
import Magnet_Sensor from "./kittenbot/magnet_sensor";
import Rotary_Button from "./kittenbot/rotary";
import Keycap_Button from "./kittenbot/keycap_button";
import RGBLED_Ring from "./kittenbot/rgb_led_ring";
import Ultrasonic from "./kittenbot/ultrasonic";
import Slider from "./kittenbot/slider";
// Kit B Comperssed
import RP2040 from "./kittenbot/rp2040";
import Single_RGB_LED from "./kittenbot/single_rgb_led";
import Jacdac_Environmental_Sensor from "./kittenbot/environment_sensor";
import Jacdac_Power from "./kittenbot/power";
import Jacdac_Haptic_Output from "./kittenbot/haptic";
import RGB_Strip from "./kittenbot/rgb_strip";
import Relay from "./kittenbot/relay";

// Mounting holes
import Jacdac_Data_MH from "./mounting_holes/jacdac_data_mh_0.1";
import Jacdac_Power_MH from "./mounting_holes/jacdac_power_mh_0.1";
import Jacdac_Ground_MH from "./mounting_holes/jacdac_ground_mh_0.1";
// KIT B UNCOMPRESSED

//import REPLICATE_brain from "./Replicate_brain";
//import Jacdac_Power from "./Jacdac_Power";
//import Jacdac_Dual_Servo from "./Jacdac_Dual_Servo";

// virtual modules
import VM_rgb_led from "./virtual_modules/vm_rgb_led_0.3";
import VM_rgb_ring from "./virtual_modules/vm_rgb_ring_0.3";
import VM_jacdaptor from "./virtual_modules/vm_jacdaptor_0.2";
import VM_keycap_button from "./virtual_modules/vm_keycap_button_0.3";
import VM_keycap_button_row from "./virtual_modules/vm_keycap_button_row_0.3";
import VM_light_sensor from "./virtual_modules/vm_light_sensor_0.3";
import VM_rotary_button from "./virtual_modules/vm_rotary_button_0.3";
import VM_rp2040_brain from "./virtual_modules/vm_rp2040_brain_0.2";
import VM_rp2040_pogo_mh from "./virtual_modules/vm_rp2040_pogo_mh_0.1";
//import Jacdac_servo from "./Jacdac_servo";

// TIER 3 MODULES
/* import REPLICATE_glue_button_cherry from "./REPLICATE_glue_button_cherry";
import REPLICATE_glue_button_tact from "./REPLICATE_glue_button_tact";
import REPLICATE_glue_potentiometer_rotary from "./REPLICATE_glue_potentiometer_rotary";
import REPLICATE_slider_15mm from "./REPLICATE_slider_15mm";
import REPLICATE_light_sensor from "./REPLICATE_light_sensor";
import REPLICATE_neopixel_strip from "./REPLICATE_neopixel_strip";
import REPLICATE_neopixel_strip_v2 from "./REPLICATE_neopixel_strip_v2";  */ // Added for v2 neopixel strip

import { DeviceCatalog, serviceSpecificationFromName } from "jacdac-ts";

export default function PF_Module(props: {
  id: string;
  name: string;
  moduleName: string;
  moduleData: any;
  setIsDragging;
  lastClicked;
  setLastClicked;
  lastClicked: THREE.Object3D;
  floorPlane: THREE.Vector3;
  position?: number[];
  rotation?: number[];
  serErr;
  traces;
  setTraces;
  moduleIDs;
  setModuleIDs;
  lockOrbit;
}) {
  const {
    id,
    name,
    moduleName,
    moduleData,
    setIsDragging,
    lastClicked,
    setLastClicked,
    floorPlane,
    position,
    rotation,

    traces,
    setTraces,
    moduleIDs,
    setModuleIDs,
    setErr,
    lockOrbit,
  } = props;

  const [sel, setSel] = useState(lastClicked === objGroup ? true : false);
  const [act, setAct] = useState(false);

  // hovering
  const [hovered, setHovered] = useState(false);
  useCursor(hovered /*'pointer', 'auto', document.body*/);

  const moduleRotation = rotation ? rotation : [0, -1.5708, 0];

  const dragMesh = useRef();

  const objGroup = useRef();

  const [specification, setSpecification] = useState(null);

  // BOUNDING BOX FOR MODULE

  const helper = useHelper(act && objGroup, THREE.BoxHelper, "yellow");

  //const intersections = [];

  const [pos, setPos] = useState(position ? position : [150, 1, 0]);

  const planeIntersectPoint = new THREE.Vector3();

  const [spring, api] = useSpring(() => ({
    // position: [0, 0, 0],
    position: [Math.round(pos[0]), Math.round(pos[1]), Math.round(pos[2])],
    scale: 1,
    rotation: [0, 0, 0],
    config: { friction: 10, tension: 200, restVelocity: 0, bounce: 0 },
  }));

  const handleClick = () => {
    setAct(true);
  };

  const bind = useDrag(
    ({ active, movement: timeStamp, event }) => {
      if (active && lockOrbit === true) {
        event.ray.intersectPlane(floorPlane, planeIntersectPoint) as MouseEvent;
        event.stopPropagation();
        // check if colliding with other objects...

        setPos([
          roundBy(planeIntersectPoint.x),
          8,
          roundBy(planeIntersectPoint.z),
        ]);
      }

      setIsDragging(active);
      setSel(active);

      // need to fix this
      setLastClicked(objGroup);

      api.start({
        position: pos,
      });
      return timeStamp;
    },
    { delay: false },
  );

  const whichModule = (moduleName) => {
    switch (moduleName.toLowerCase()) {
      case "kittenbot-jacdaptorformicrobitv2v10":
        return <Jacdaptor />;
      case "kittenbot-rotarybuttonv10":
        return <Rotary_Button />;
      case "kittenbot-rgbringv10":
        return <RGBLED_Ring />;
      case "kittenbot-accelerometerv10":
        return null;
      case "kittenbot-keycapbuttonv10":
        return <Keycap_Button />;
      case "kittenbot-sliderv10":
        return <Slider />;
      //return <Jacdac_slider_new />;
      case "kittenbot-lightsensorv10":
        return <Light_Sensor />;
      case "magnet sensor":
        return <Magnet_Sensor />;
      case "kittenbot-rgbstripv10":
        return <RGB_Strip />;
      case "kittenbot-hapticoutputv10":
        return <Jacdac_Haptic_Output />;
      case "kittenbot-powerv10":
        return <Jacdac_Power />;
      case "kittenbot-nanoscript2040v10":
        return <RP2040 />;
      case "single rgb led":
        return <Single_RGB_LED />;
      case "kittenbot-ultrasonicsensorv10":
        return <Ultrasonic />;
      case "kittenbot-envsensorv10":
        return <Jacdac_Environmental_Sensor />;
      case "kittenbot-servov10":
      /* return <Jacdac_servo />; */
      case "kittenbot-relayv10":
        return <Relay />;
      /* case "replicate_brain":
        return <REPLICATE_brain />; */

      case "jacdac_data_mh_0.1":
        return <Jacdac_Data_MH />;
      case "jacdac_power_mh_0.1":
        return <Jacdac_Power_MH />;
      case "jacdac_ground_mh_0.1":
        return <Jacdac_Ground_MH />;

      case "vm_rgb_led_0.3":
        return <VM_rgb_led />;
      case "vm_rgb_ring_0.3":
        return <VM_rgb_ring />;
      case "vm_jacdaptor_0.2":
        return <VM_jacdaptor />;
      case "vm_keycap_button_0.3":
        return <VM_keycap_button />;
      case "vm_keycap_button_row_0.3":
        return <VM_keycap_button_row />;
      case "vm_light_sensor_0.3":
        return <VM_light_sensor />;
      case "vm_rotary_button_0.3":
        return <VM_rotary_button />;
      case "vm_rp2040_brain_0.2":
        return <VM_rp2040_brain />;
      case "vm_rp2040_pogo_mh_0.1":
        return <VM_rp2040_pogo_mh />;
    }
  };

  const rigidBodyRef = useRef();
  return (
    <>
      <Suspense fallback={null}>
        <animated.mesh
          name={name}
          ref={dragMesh}
          userData={{ routeMe: true, isAnimMesh: true }}
          {...spring}
          {...bind()}
          castShadow
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <group
            name={name}
            ref={objGroup}
            userData={{
              name: moduleName,
              isModule: true,
              moduleData: module,
              footprintID: moduleData.shape ? moduleData.shape : "none",
              model_name: moduleData.model_name ? moduleData.model_name : "none"
            }}
            rotation={moduleRotation}
            onClick={() => {
              setAct(true);
            }}
            onPointerMissed={() => {
              setAct(false);
            }}
          >
            {whichModule(id)}
          </group>
        </animated.mesh>
      </Suspense>
    </>
  );
}
