import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
//import Suspense from "../ui/Suspense"

export default function STLModel(props: {
  url: string;
  visible?: boolean;
  color?: string;
  texture: any;
  position?: number[];
  rotation?: number[];
}) {
  const { url, color, texture, visible, position, rotation } = props;

  const pos = position !== undefined ? position : [0, 0, 0];
  const rot = rotation !== undefined ? rotation : [0, 0, 0];

  const obj = useLoader(STLLoader, url);
  return (
    <Suspense>
      <mesh visible={visible} position={pos} rotation={rot}>
        <primitive object={obj} attach="geometry" />
        <meshStandardMaterial color={color || "green"} map={texture} />
      </mesh>
    </Suspense>
  );
}
