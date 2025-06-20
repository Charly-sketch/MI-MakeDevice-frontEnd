/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials } = useGLTF(
    "/models/REPLICATE_glue_cherry_button_SMD.glb"
  );
  return (
    <group {...props} dispose={null}>
      <group>
        <group
          position={[-36.5, -1.75, -35.9]}
          scale={1000}
          userData={{ name: "REPLICATE_glue_cherry_button.wrl" }}
        >
          <group scale={0.0025} userData={{ name: "Compound" }}>
            <group
              position={[18.2776, 0.315, 14.247]}
              rotation={[0, -Math.PI / 2, 0]}
              userData={{ name: "Compound.001" }}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Compound002.geometry}
                material={nodes.Compound002.material}
                userData={{ name: "Compound.002" }}
              />
            </group>
            <group
              position={[20.1968, 0.315, 16.2205]}
              userData={{ name: "Compound.003" }}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Compound004.geometry}
                material={nodes.Compound004.material}
                userData={{ name: "Compound.004" }}
              />
            </group>
            <group
              position={[18.9764, 0.315, 12.126]}
              rotation={[-Math.PI, 0, -Math.PI]}
              userData={{ name: "Compound.005" }}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Compound006.geometry}
                material={nodes.Compound006.material}
                userData={{ name: "Compound.006" }}
              />
            </group>
            <group
              position={[12.5512, 2.2835, 14.3071]}
              rotation={[0, 0, Math.PI]}
              userData={{ name: "Compound.007" }}
            >
              <group userData={{ name: "Compound.008" }}>
                <group userData={{ name: "Compound.009" }}>
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Compound010.geometry}
                    material={materials.mat_0}
                    userData={{ name: "Compound.010" }}
                  />
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Compound011.geometry}
                    material={materials.mat_1}
                    userData={{ name: "Compound.011" }}
                  />
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Compound012.geometry}
                    material={materials.mat_1}
                    userData={{ name: "Compound.012" }}
                  />
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Compound013.geometry}
                    material={materials.mat_1}
                    userData={{ name: "Compound.013" }}
                  />
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Compound014.geometry}
                    material={materials.mat_1}
                    userData={{ name: "Compound.014" }}
                  />
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Compound015.geometry}
                    material={materials.mat_2}
                    userData={{ name: "Compound.015" }}
                  />
                </group>
              </group>
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Compound016.geometry}
              material={materials.mat_3}
              userData={{ name: "Compound.016" }}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Face.geometry}
              material={materials.mat_4}
              userData={{ name: "Face" }}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Face001.geometry}
              material={materials.mat_5}
              userData={{ name: "Face.001" }}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Face002.geometry}
              material={materials.mat_6}
              userData={{ name: "Face.002" }}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Face003.geometry}
              material={materials.mat_4}
              userData={{ name: "Face.003" }}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Face004.geometry}
              material={materials.mat_6}
              userData={{ name: "Face.004" }}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Face005.geometry}
              material={materials.mat_7}
              userData={{ name: "Face.005" }}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/REPLICATE_glue_cherry_button_SMD.glb");
