import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";

export default function EnclosureView(props: { editorScene }) {
  const { editorScene } = props;

  console.log("editor state: ", editorScene);

  return (
    <Canvas
      scene={editorScene}
      style={{
        position: "relative",
        height: "55vh",
        overflow: "visible",
      }}
    >
      {/*  <ambientLight intensity={1} />
      <directionalLight
        intensity={1}
        castShadow
        shadow-mapSize-height={1512}
        shadow-mapSize-width={1512}
      />
      <color attach="background" args={["lightblue"]}></color>
      <group>
        <mesh></mesh>
      </group> */}
    </Canvas>
  );
}
