import { MathUtils } from "three";
import React, { useState, useEffect, useRef } from "react";
import {
  OrthographicCamera,
  OrbitControls,
  CameraControls,
} from "@react-three/drei";
import { useControls, button, buttonGroup, folder } from "leva";
import { useThree } from "@react-three/fiber";

export default function CustomCameraControls() {
  const { DEG2RAD } = MathUtils;

  const cameraControlsRef = useRef();
  //@ts-ignore
  cameraControlsRef.current?.disconnect(); // disable drag controls

  const {
    minDistance,
    enabled,
    verticalDragToForward,
    dollyToCursor,
    infinityDolly,
  } = useControls({
    thetaGrp: buttonGroup({
      label: "Rotate View",
      opts: {
        "X +": () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
        "X -": () => cameraControlsRef.current?.rotate(-45 * DEG2RAD, 0, true),
        "Y +": () => cameraControlsRef.current?.rotate(0, 45 * DEG2RAD, true),
        "Y -": () => cameraControlsRef.current?.rotate(0, -45 * DEG2RAD, true),
      },
    }),

    zoomGrp: buttonGroup({
      label: "Zoom",
      opts: {
        "Zoom in": () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
        "Zoom out": () =>
          cameraControlsRef.current?.zoom(-camera.zoom / 2, true),
      },
    }),

    MoveCamera: buttonGroup({
      label: "Move View",
      opts: {
        Left: () => cameraControlsRef.current?.truck(-25, 0, true),
        Right: () => cameraControlsRef.current?.truck(25, 0, true),
        Up: () => cameraControlsRef.current?.truck(0, -25, true),
        Down: () => cameraControlsRef.current?.truck(0, 25, true),
      },
    }),

    reset: button(() => cameraControlsRef.current?.reset(true)),
  });

  const { camera } = useThree();

  return (
    <>
      <CameraControls ref={cameraControlsRef} />
    </>
  );
}
